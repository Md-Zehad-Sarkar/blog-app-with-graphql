import { checkUserAccess } from "../../utls/checkUserAccess";

export const PostResolver = {
  // create post
  addPost: async (parent: any, { post }: any, { prisma, userInfo }: any) => {
    if (!post.title || !post.content) {
      return {
        postStatus: "Title And Content Is Required",
        post: null,
      };
    }

    const existPost = await prisma.post.findFirst({
      where: { title: post.title },
    });

    if (existPost && existPost.title === post.title) {
      return {
        postStatus: "Duplicate Post",
        post: null,
      };
    }

    const posts = await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        authorId: userInfo.userId,
      },
    });

    return {
      postStatus: "Post Create Success",
      post: posts,
    };
  },

  // update post
  updatePost: async (parent: any, args: any, { prisma, userInfo }: any) => {
    // console.log("args", args, "userInfo", userInfo);

    if (!userInfo) {
      return {
        // postStatus: "User Not Found",
        // token: null,
        userError: "Unauthorized User",
        token: null,
      };
    }

    // const user = await prisma.user.findUnique({
    //   where: {
    //     id: Number(userInfo.userId),
    //   },
    // });

    // if (!user) {
    //   return {
    //     // postStatus: "User Not Found",
    //     // post: null,
    //     userError: "Unauthorized User",
    //     token: null,
    //   };
    // }
    // // console.log("user", user);

    // const post = await prisma.post.findUnique({
    //   where: { id: Number(args.postId) },
    // });
    // // console.log("args", args);
    // // console.log("post", post);

    // if (!post) {
    //   return {
    //     postStatus: "Post Not Exist",
    //     post: null,
    //   };
    // }

    // if (post.authorId !== user.id) {
    //   return {
    //     postStatus: "This Post Is not Owned By You",
    //     post: null,
    //   };
    // }

    // console.log("post", post, "user", user);

    const error = await checkUserAccess(prisma, userInfo.userId, args.postId);

    if (error) {
      return error;
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: Number(args.postId),
      },
      data: args.post,
    });

    // console.log("updatedPost", updatedPost);

    return {
      userError: null,
      post: updatedPost,
    };
  },

  deletePost: async (parent: any, args: any, { prisma, userInfo }: any) => {
    // console.log("args", args, "userInfo", userInfo);

    if (!userInfo) {
      return {
        userError: "Unauthorized User",
        token: null,
      };
    }

    const error = await checkUserAccess(prisma, userInfo.userId, args.postId);

    if (error) {
      return error;
    }

    const deletedPost = await prisma.post.delete({
      where: {
        id: Number(args.postId),
      },
    });

    // console.log("deletedPost", deletedPost);

    return {
      userError: null,
      post: deletedPost,
    };
  },
};
