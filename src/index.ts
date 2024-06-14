import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema/schema";
import { resolvers } from "./resolvers/resolver";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { jwtHelper } from "./utls/jwtHelper";
import { TUserInfoContext } from "./types/users.type";

const prisma = new PrismaClient();

type TContext = {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  userInfo: TUserInfoContext;
};

async function main() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }): Promise<TContext> => {
      const userInfo = await jwtHelper.verifyUser(
        req.headers.authorization as string
      );

      return { prisma, userInfo };
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

main();
