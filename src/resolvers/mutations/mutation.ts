import { IUsers } from "../../types/users.type";
import bcrypt from "bcrypt";
import { jwtHelper } from "../../utls/jwtHelper";
import config from "../../config";

export const Mutation = {
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

  // create post
  post: async (parent: any, args: any, { prisma, userInfo }: any) => {
    if (!args.title || !args.content) {
      return {
        postStatus: "Title And Content Is Required",
        post: null,
      };
    }

    const existPost = await prisma.post.findFirst({
      where: { title: args.title },
    });

    if (existPost && existPost.title === args.title) {
      return {
        postStatus: "Duplicate Post",
        post: null,
      };
    }

    const post = await prisma.post.create({
      data: {
        title: args.title,
        content: args.content,
        authorId: userInfo.userId,
      },
    });

    return {
      postStatus: "Post Create Success",
      post: post,
    };
  },
};
