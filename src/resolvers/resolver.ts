import { PrismaClient } from "@prisma/client";
import { IUsers } from "../types/users.type";
import bcrypt from "bcrypt";
import { jwtHelper } from "../utls/jwtHelper";
import { title } from "process";

const prisma = new PrismaClient();
export const resolvers = {
  Query: {
    users: async (parent: any, args: any, context: any) => {
      return await prisma.user.findMany();
    },

    me: async (parent: any, args: any, context: any) => {
      return await prisma.user.findFirst({ where: { id: args.id } });
    },

    profiles: async (parent: any, args: any, context: any) => {
      return await prisma.profile.findMany();
    },

    profile: async (parent: any, args: { id: number }, context: any) => {
      return await prisma.profile.findFirst({ where: { id: args.id } });
    },
  },

  Mutation: {
    // user sign up
    signup: async (parent: any, args: IUsers, context: any) => {
      args.password = await bcrypt.hash(args.password, 12);

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

      const token = await jwtHelper({
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

      // const token = await jwt.sign(
      //   {
      //     userId: user.id,
      //     email: user.email,
      //     userName: user.name,
      //   },
      //   process.env.JWT_SECRET || "JWT_SECRET",
      //   { expiresIn: process.env.EXPIRES_IN }
      // );

      const token = await jwtHelper({
        userId: user.id,
        name: user.name,
        email: user.email,
      });

      return {
        userError: "User login Success",
        token,
      };
    },

    // create post
    post: async (parent: any, args: any, context: any) => {
      const author = await prisma.user.findFirst({ where: { id: args.id } });
      if (!author) {
        return "user Not found";
      }

      const existPost = await prisma.post.findFirst({
        where: { title: args.title },
      });

      if (existPost && existPost.title === args.title) {
        return {
          title: "Duplicate Post",
        };
      }

      const post = await prisma.post.create({
        data: {
          title: args.title,
          content: args.content,
          authorId: author.id,
        },
      });
      if (post && post.title === args.title) {
      }
      return {
        title: post.title,
        content: post.content,
        authorId: post.authorId,
      };
    },
  },
};
