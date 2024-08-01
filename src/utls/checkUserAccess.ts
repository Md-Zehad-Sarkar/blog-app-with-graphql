export const checkUserAccess = async (
  prisma: any,
  userId: any,
  postId: any
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
  });

  if (!user) {
    return {
      userError: "Unauthorized User",
      token: null,
    };
  }

  const post = await prisma.post.findUnique({
    where: { id: Number(postId) },
  });

  if (!post) {
    return {
      postStatus: "Post Not Exist",
      post: null,
    };
  }

  if (post.authorId !== user.id) {
    return {
      postStatus: "This Post Is not Owned By You",
      post: null,
    };
  }
};
