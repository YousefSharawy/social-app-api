import { IUser } from "../../users/model/user.model";
import userRepo, { UserRepo } from "../../users/repo/user.repo";
import {
  Enable2FactorAuthDTO,
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
  SendOTPDTO,
  Verify2FactorAuthCodeToLoginDTO,
  VerifyAccountDTO,
} from "../dto/dto";
import {
  invalidCredentials,
  userAlreadyExists,
  userAlreadyVerified,
  userDoesNotExist,
  userIsNotVerified,
} from "../../users/error";
import { comparePassword, hashPassword } from "../../../pkg/utils/hash/hash";
import { generateOTP } from "../../../pkg/utils/otp";
import { cacheProvider } from "../../../lib/cache/init";
import { toSec } from "../../../pkg/utils/convert_time_units";
import { mailjetProvider } from "../../../lib/email/init";
import { otpTemplate } from "../../../lib/email/otp.template";
import { MailProvider } from "../../../pkg/mail/mail.interface";
import { invalidCode, noPayload, otpIsExpired } from "../error";
import { issueTokens } from "../../../lib/token/token";
import { verifyGoogleToken } from "../../../lib/token/google.auth";
import { Provider } from "../../../lib/enum/enum";
import { env } from "../../../lib/config/env";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../../pkg/error/error";

class AuthService {
  // private authService: AuthService = authService;
  private readonly userRepo: UserRepo = userRepo;
  private sendOtpKey = "OTP:";
  private twoAuthVerificationKey = "2FA:";
  private readonly mailProvider: MailProvider;
  constructor() {
    this.mailProvider = mailjetProvider;
  }
  register = async (registerDto: RegisterDTO) => {
    // find user by emil
    const user = await this.userRepo.findByEmail(registerDto.email);
    /// if user exist-> user already exists
    if (user) {
      throw userAlreadyExists;
    }
    const hashedPassword = await hashPassword(registerDto.password);
    registerDto.password = hashedPassword;
    const createdeUser = await this.userRepo.create(registerDto as IUser);
    const code = generateOTP();
    await cacheProvider.set(
      `${this.sendOtpKey}${createdeUser._id}`,
      code,
      toSec("minutes", 3),
    );
    await this.mailProvider.send(
      registerDto.email,
      "Verification Code:",
      otpTemplate(code),
    );
    return createdeUser;
  };

  verifyAccount = async (verifyAccountDto: VerifyAccountDTO) => {
    const user = await this.userRepo.findByEmail(verifyAccountDto.email);
    // if user there -> error
    if (!user) throw userDoesNotExist;
    // if user verifired -> error
    if (user.isVerified) throw userAlreadyVerified;
    // if not found the otp -> error
    const otp = await cacheProvider.get(`${this.sendOtpKey}${user._id}`);
    if (!otp) throw otpIsExpired;
    if (otp !== String(verifyAccountDto.code)) throw invalidCode;

    const updatedUser = await this.userRepo.update(
      { email: verifyAccountDto.email },
      {
        isVerified: true,
      },
      {
        returnDocument: "after",
      },
    );
    await cacheProvider.del(`${this.sendOtpKey}${updatedUser!._id}`);
    return updatedUser;
  };

  enable2FactorAuth = async (enable2FactorAuthDto: Enable2FactorAuthDTO) => {
    //check user excistence
    const user = await this.userRepo.findByEmail(enable2FactorAuthDto.email);
    // if user there -> error
    if (!user) throw userDoesNotExist;
    // if not found the otp -> error
    const otp = await cacheProvider.get(`${this.sendOtpKey}${user._id}`);

    if (!otp) throw otpIsExpired;

    if (otp !== enable2FactorAuthDto.code) throw invalidCode;
    await cacheProvider.del(`${this.sendOtpKey}${user._id}`);
    await this.userRepo.update(
      { email: enable2FactorAuthDto.email },
      { is2FactorAuthEnabled: true },
    );
  };

  verify2FactorAuthCodeToLogin = async (
    verify2FactorAuthCodeToLoginDto: Verify2FactorAuthCodeToLoginDTO,
  ) => {
    //check user excistence
    const user = await this.userRepo.findByEmail(
      verify2FactorAuthCodeToLoginDto.email,
    );
    // if user there -> error
    if (!user) throw userDoesNotExist;
    // if not found the otp -> error
    const otp = await cacheProvider.get(`${this.sendOtpKey}${user._id}`);

    if (!otp) throw otpIsExpired;

    if (otp !== verify2FactorAuthCodeToLoginDto.code) throw invalidCode;
    await cacheProvider.del(`${this.sendOtpKey}${user._id}`);
    return issueTokens(user);
  };

  login = async (loginDto: LoginDTO) => {
    const user = await this.userRepo.findByEmail(loginDto.email);
    if (!user) throw invalidCredentials;
    if (user.provider !== Provider.LOCAL) throw invalidCredentials;
    if (!user.isVerified) throw userIsNotVerified;
    const match = await comparePassword(loginDto.password, user.password);
    if (!match) throw invalidCredentials;

    if (user.is2FactorAuthEnabled) {
      const otp = generateOTP();
      await cacheProvider.set(
        `${this.sendOtpKey}${user._id}`,
        otp,
        toSec("minutes", 3),
      );
      await this.mailProvider.send(user.email, "2FA Code", otpTemplate(otp));
      return;
    }
    return issueTokens(user);
  };

  sendOTP = async (sendOTPDto: SendOTPDTO) => {
    const user = await this.userRepo.findByEmail(sendOTPDto.email);
    // if user there -> error
    if (!user) throw userDoesNotExist;
    const code = generateOTP();
    await cacheProvider.set(
      `${this.sendOtpKey}${user._id}`,
      code,
      toSec("minutes", 3),
    );
    await this.mailProvider.send(user.email, "Otp:", otpTemplate(code));
  };
  loginWithGoogle = async (idToken: string) => {
    // ? 1 - verify idToken
    const payload = await verifyGoogleToken(idToken);
    if (!payload) throw noPayload;
    // ? 2-cehck user existence
    const user = await this.userRepo.findByEmail(payload.email as string);
    // ? if exist -> send Token
    if (user) {
      return issueTokens(user);
    }
    // ? if not -> create user and generate the token
    const createdUser = await this.userRepo.create({
      userName: payload.name!,
      email: payload.email!,
      provider: Provider.GOOGLE,
      isVerified: true,
    });
    return issueTokens(createdUser);
  };
  refreshToken = async (token: string) => {
    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, env.jwt.refreshSecret) as JwtPayload;
    } catch {
      throw new AppError("Invalid or expired refresh token", 401);
    }
    const revoked = await cacheProvider.get(`revoked:${payload.jti}`);
    if (revoked) throw new AppError("Token has been revoked", 401);
    const user = await this.userRepo.getOne({ _id: payload.id });
    if (!user) throw new AppError("Invalid or expired refresh token", 401);
    return issueTokens(user);
  };
  logout = async (token: string) => {
    const { jti, exp } = jwt.decode(token) as JwtPayload;
    const secondsLeft = exp! - Math.floor(toSec("milliseconds", Date.now()));
    await cacheProvider.set(`revoked:${jti}`, "1", secondsLeft);
  };
  forgetPassword = async (email: string) => {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw invalidCredentials;
    await this.sendOTP({ email });
  };
  resetPassword = async (resetPasswordDto: ResetPasswordDTO) => {
    const user = await this.userRepo.findByEmail(resetPasswordDto.email);
    if (!user) throw invalidCredentials;
    const cachedCode = await cacheProvider.get(`${this.sendOtpKey}${user._id}`);
    if (!cachedCode) throw otpIsExpired;
    if (resetPasswordDto.code !== cachedCode) throw invalidCode;
    const hashed = await hashPassword(resetPasswordDto.password);
    await this.userRepo.update({ _id: user._id }, { password: hashed });
    await cacheProvider.del(`${this.sendOtpKey}${user._id}`);
  };
}
export const authService = new AuthService();
