export const Query = {
  users: async (parent: any, args: any, { prisma }: any) => {
    return await prisma.user.findMany();
  },

  me: async (parent: any, args: any, { prisma, userInfo }: any) => {
    return await prisma.user.findUnique({ where: { id: userInfo.userId } });
  },

  profiles: async (parent: any, args: any, { prisma }: any) => {
    return await prisma.profile.findMany();
  },

  profile: async (
    parent: any,
    args: { id: number },
    { prisma, userInfo }: any
  ) => {
    return await prisma.profile.findUnique({ where: { id: args.id } });
  },

  posts: async (parent: any, args: any, { prisma }: any) => {
    return await prisma.post.findMany({
      where: {
        published: true,
        // published: false,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  },
};
