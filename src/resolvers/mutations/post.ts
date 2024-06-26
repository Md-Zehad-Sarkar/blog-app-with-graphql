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
    console.log("args", args, "userInfo", userInfo);
  },
};
