import jwt, { Secret } from "jsonwebtoken";
import { IJwtPayload } from "../types/users.type";

export const jwtHelper = async (payload: IJwtPayload) => {
  const token = await jwt.sign(payload, process.env.EXPIRES_IN as string, {
    expiresIn: process.env.EXPIRES_IN,
  });
  return token;
};
