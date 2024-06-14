import jwt, { JwtPayload } from "jsonwebtoken";
import { IJwtPayload, TUserInfoContext } from "../types/users.type";
import config from "../config";

const generateToken = async (payload: IJwtPayload) => {
  const token = await jwt.sign(payload, config.jwt_secret as string, {
    expiresIn: config.jwt_expiresIn,
  });
  return token;
};

const verifyUser = async (token: string) => {
  try {
    const userInfo = jwt.verify(
      token,
      config.jwt_secret as string
    ) as JwtPayload;

    const { iat, exp, ...rest } = userInfo;
    return rest as TUserInfoContext;
  } catch {
    return null;
  }
};

export const jwtHelper = {
  generateToken,
  verifyUser,
};
