import { toMs } from "./convert_time_units.js";
import { Response } from "express";

export async function setCookies(res: Response, accessToken: string,refreshToken:string) {
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    maxAge: toMs("hours", 1),
  });
  res.cookie("refreshToken_token", refreshToken, {
    httpOnly: true,
    maxAge: toMs("days", 4),
  });
}
