import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  jwt_secret: process.env.JWT_SECRET,
  jwt_expiresIn: process.env.EXPIRES_IN,
  salt: process.env.BCRYPT_SALT,
};
