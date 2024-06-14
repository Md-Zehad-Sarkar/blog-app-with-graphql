export const Query = {
  users: async (parent: any, args: any, {prisma}: any) => {
    return await prisma.user.findMany();
  },

  me: async (parent: any, args: any, {prisma}: any) => {
    return await prisma.user.findFirst({ where: { id: args.id } });
  },

  profiles: async (parent: any, args: any, {prisma}: any) => {
    return await prisma.profile.findMany();
  },

  profile: async (parent: any, args: { id: number }, {prisma}: any) => {
    return await prisma.profile.findFirst({ where: { id: args.id } });
  },
};
