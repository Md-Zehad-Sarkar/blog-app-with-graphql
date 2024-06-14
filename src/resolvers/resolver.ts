import { PrismaClient } from "@prisma/client";
import { IUsers } from "../types/users.type";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
export const resolvers = {
  Query: {
    users: async (parent: any, args: any, context: any) => {
      return await prisma.user.findMany();
    },
  },

  Mutation: {
    signup: async (parent: any, args: IUsers, context: any) => {
      args.password = await bcrypt.hash(args.password, 12);

      const createUser = await prisma.user.create({ data: args });
      const token = jwt.sign(
        { id: createUser.id, email: createUser.email },
        process.env.JWT_SECRET || "jwt-secret",
        { expiresIn: process.env.EXPIRES_IN }
      );

      return {
        userError: null,
        token,
      };
    },

    signIn: async (parent: any, args: any, context: any) => {
      const user = await prisma.user.findFirst({
        where: { email: args.email },
      });

      if (!user) {
        return {
          userError: "User Not Find",
          token: null,
        };
      }
      const verifyPassword = await bcrypt.compare(
        args.password,
        user?.password
      );
      if (!verifyPassword) {
        return {
          userError: "Password Didn't MAtch",
          token: null,
        };
      }

      const token = await jwt.sign(
        {
          userId: user.id,
          email: user.email,
          userName: user.name,
        },
        process.env.JWT_SECRET || "JWT_SECRET",
        { expiresIn: process.env.EXPIRES_IN }
      );

      return {
        userError: "User login Success",
        token,
      };
    },
  },
};
