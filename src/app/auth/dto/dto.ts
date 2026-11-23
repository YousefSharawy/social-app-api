import { Gender } from "../../../lib/enum/enum";

export interface RegisterDTO {
    userName:string,
    email:string,
    password:string,
    phoneNumber?:string,
    gender?:Gender,
};

export interface LoginDTO {
    email:string,
    password:string,
};

export interface SendOTPDTO {
    email:string,
};

export interface VerifyAccountDTO {
    email:string,
    code:string,
}
export interface Enable2FactorAuthDTO {
    email:string,
    code:string,
}
export interface Verify2FactorAuthCodeToLoginDTO {
    email:string,
    code:string,
}
export interface ResetPasswordDTO {
    email:string,
    code:string,
    password:string,
    
}