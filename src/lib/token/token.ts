import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { toSec } from "../../pkg/utils/convert_time_units.js";
import crypto from "crypto";

export function generateToken(payload: JwtPayload) {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: toSec("hours", 1),
    jwtid : crypto.randomUUID(),

  });
}
export function generateRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: toSec("days", 4),
    jwtid : crypto.randomUUID(),
  });
}

export function issueTokens(user: {
  id: string;
  email: string;
  userName: string;
}) {
  const payload = { id: user.id, email: user.email, userName: user.userName };
  return {
    token: generateToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}
