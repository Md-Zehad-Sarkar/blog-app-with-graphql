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

      return { token };
    },
  },
};
