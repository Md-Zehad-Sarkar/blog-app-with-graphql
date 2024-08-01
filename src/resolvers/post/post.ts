export const Post = {
  author: async (parent: any, args: any, { prisma, userInfo }: any) => {
    console.log("parent", parent);
    return await prisma.user.findUnique({
      where: {
        id: parent.authorId,
      },
    });
  },
};
