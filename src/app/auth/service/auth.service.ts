import { IUser } from "../../users/model/user.model";
import userRepo, { UserRepo } from "../../users/repo/user.repo";
import {
  Enable2FactorAuthDTO,
  LoginDTO,
  RegisterDTO,
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
import { generateRefreshToken, generateToken } from "../../../lib/token/token";
import { verifyGoogleToken } from "../../../lib/token/google.auth";
import { Provider } from "../../../lib/enum/enum";
import { env } from "../../../lib/config/env";
import jwt, { JwtPayload } from "jsonwebtoken";

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
    this.mailProvider.send(
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
    // if user verifired -> error
    if (user.isVerified) throw userAlreadyVerified;
    // if not found the otp -> error
    const otp = await cacheProvider.get(
      `${this.sendOtpKey}:${enable2FactorAuthDto.email}`,
    );

    if (!otp) throw otpIsExpired;

    if (otp !== enable2FactorAuthDto.code) throw invalidCode;
    await cacheProvider.del(`${this.sendOtpKey}:${enable2FactorAuthDto.email}`);
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
    // if user verifired -> error
    if (user.isVerified) throw userAlreadyVerified;
    // if not found the otp -> error
    const otp = await cacheProvider.get(
      `${this.sendOtpKey}:${verify2FactorAuthCodeToLoginDto.email}`,
    );

    if (!otp) throw otpIsExpired;

    if (otp !== verify2FactorAuthCodeToLoginDto.email) throw invalidCode;
    await cacheProvider.del(
      `${this.sendOtpKey}:${verify2FactorAuthCodeToLoginDto.email}`,
    );
    const token = generateToken({ id: user._id, name: user.userName });
    return token;
  };

  login = async (loginDto: LoginDTO) => {
    const user = await this.userRepo.findByEmail(loginDto.email);
    if (!user) throw userDoesNotExist;
    if (!user.isVerified) throw userIsNotVerified;
    const match = await comparePassword(loginDto.password, user.password);
    if (!match) throw invalidCredentials;

    if (user.is2FactorAuthEnabled) {
      const otp = await generateOTP();
      await cacheProvider.set(
        `${this.sendOtpKey}:${user.email}`,
        otp,
        toSec("minutes", 3),
      );
      await mailjetProvider.send(user.email, "2FA Code", otpTemplate(otp));
      return;
    }
    const token = generateToken({
      id: user.id,
      email: user.email,
      userName: user.userName,
    });
    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      userName: user.userName,
    });
    return {
      token,
      refreshToken,
    };
  };

  sendOTP = async (sendOTPDto: SendOTPDTO) => {
    const user = await this.userRepo.findByEmail(sendOTPDto.email);
    // if user there -> error
    if (!user) throw userDoesNotExist;
    const code = generateOTP();
    await cacheProvider.set(
      `${this.sendOtpKey}:${user._id}`,
      code,
      toSec("minutes", 3),
    );
    this.mailProvider.send(user.email, "Otp:", otpTemplate(code));
  };
  loginWithGoogle = async (idToken: string) => {
    // ? 1 - verify idToken
    const payload = await verifyGoogleToken(idToken);
    if (!payload) throw noPayload;
    // ? 2-cehck user existence
    const user = await this.userRepo.findByEmail(payload.email as string);
    // ? if exist -> send Token
    if (user) {
      return generateToken({
        id: user.id,
        email: user.email,
      });
    }
    // ? if not -> create user and generate the token
    const createdUser = await this.userRepo.create({
      userName: payload.name!,
      email: payload.email!,
      provider: Provider.GOOGLE,
      isVerified: true,
    });
    const token = generateToken({
      id: createdUser.id,
      email: createdUser.email,
    });
    const refreshToken = generateRefreshToken({
      id: createdUser.id,
      email: createdUser.email,
    });
    return {
      token,
      refreshToken,
    };
  };
  refreshToken = async (token: string) => {
    const payload = jwt.verify(token, env.jwt.refreshSecret) as JwtPayload;
    const accessToken = generateToken({
      sub: payload.sub,
      userName: payload.userName,
    });
    const refreshToken = generateRefreshToken({
      sub: payload.sub,
      userName: payload.userName,
    });
    return {
      token,
      refreshToken,
    };
  };
}
export const authService = new AuthService();
