import { AppError } from "../../../pkg/error/error";
import { IUser } from "../../users/model/user.model";
import userRepo, { UserRepo } from "../../users/repo/user.repo";
import bcrypt from "bcrypt";
import {
  LoginDTO,
  RegisterDTO,
  SendOTPDTO,
  VerifyAccountDTO,
} from "../dto/dto";
import { userAlreadyExists } from "../error";
import { hashPassword } from "../../../pkg/utils/hash/hash";
import { setCookies } from "../../../pkg/utils/cookies";
import { generateOTP } from "../../../pkg/utils/otp";
import { cacheProvider } from "../../../lib/cache/init";
import { toSec } from "../../../pkg/utils/convert_time_units";
import { mailjetProvider } from "../../../lib/email/init";
import { otpTemplate } from "../../../lib/email/otp.template";
import { MailProvider } from "../../../pkg/mail/mail.interface";

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
  verifyAccount = async (verifyAccountDto :VerifyAccountDTO )=>{
    
  }
  async login(loginDto: LoginDTO) {}
  async sendOTP(sendOTPDto: SendOTPDTO) {}
}
export const authService = new AuthService();
