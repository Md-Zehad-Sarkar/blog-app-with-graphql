import config from "../../config";
import { IUsers } from "../../types/users.type";
import { jwtHelper } from "../../utls/jwtHelper";
import bcrypt from "bcrypt";

export const AuthResolver = {
  // user sign up
  signup: async (parent: any, args: IUsers, { prisma }: any) => {
    args.password = await bcrypt.hash(args.password, Number(config.salt));

    const { bio, ...rest } = args;

    const existingUser = await prisma.user.findFirst({
      where: { email: args.email },
    });

    if (existingUser) {
      return {
        userError: "User Already Exist With This Email.",
        token: null,
      };
    }

    const createUser = await prisma.user.create({ data: rest });

    const token = await jwtHelper.generateToken({
      userId: createUser.id,
      name: createUser.name,
      email: createUser.email,
    });

    if (args.bio) {
      await prisma.profile.create({
        data: { bio: args.bio, userId: createUser.id },
      });
    }

    return {
      userError: "User Sign Up Successful",
      token,
    };
  },

  // user sign in
  signIn: async (parent: any, args: any, { prisma }: any) => {
    const user = await prisma.user.findFirst({
      where: { email: args.email },
    });

    if (!user) {
      return {
        userError: "User Not Find",
        token: null,
      };
    }
    const verifyPassword = await bcrypt.compare(args.password, user?.password);
    if (!verifyPassword) {
      return {
        userError: "Password Didn't MAtch",
        token: null,
      };
    }

    // const token = await jwt.sign(
    //   {
    //     userId: user.id,
    //     email: user.email,
    //     userName: user.name,
    //   },
    //   process.env.JWT_SECRET || "JWT_SECRET",
    //   { expiresIn: process.env.EXPIRES_IN }
    // );

    const token = await jwtHelper.generateToken({
      userId: user.id,
      name: user.name,
      email: user.email,
    });

    return {
      userError: "User login Success",
      token,
    };
  },
};