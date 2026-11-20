import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { toSec } from "../../pkg/utils/convert_time_units.js";

export function generateToken(payload: JwtPayload) {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: toSec("hours", 1),
  });
}
export function generateRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: toSec("days", 4),
  });
}
