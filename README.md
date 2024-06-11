# Blog App

# Run The App

`npm run dev`

`npm run start
`

# Project Setup Guide

- go to your preferred folder and open it by terminal
  `npm init -y`

  - you see a `package.json`

 <!-- `
  {
  "name": "blog-app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
  "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  }
` -->

- install graphql `npm install @apollo/server graphql`
- install typescript and types/node `npm install --save-dev typescript @types/node`
- install nodemon and ts-node-dev for auto restarting after file changes
  `npm install nodemon ts-node-dev`
- create a folder `src` and a file `index.ts`
- add script on your `package.json`

  `"scripts": {
"start": "nodemon --watch './\*_/_.ts' --exec ts-node src/index.ts"
}`

- add this for start your server

  `
  import { ApolloServer } from "@apollo/server";
  import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
type Book {
title: String
author: String
}

type Query {
books: [Book]
}
`;

const books = [
{
title: "The Awakening",
author: "Kate Chopin",
},
{
title: "City of Glass",
author: "Paul Auster",
},
];

const resolvers = {
Query: {
books: () => books,
},
};

async function main() {
const server = new ApolloServer({
typeDefs,
resolvers,
});

const { url } = await startStandaloneServer(server, {
listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
}

main();

`

# Setup Prisma

- install prisma `npm install prisma`
- initialized typescrit `tsconfig.json` : `npx tsc --init`
- set up your Prisma ORM project by creating your `Prisma Schema` file with the following command
  `npx prisma init`

  - now you can see `.env` file in the root. open the `.env` and add username & password for postgreSQL.

- open prisma folder and create a schema/models
  `

model Post {
id Int @id @default(autoincrement())
title String
content String
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
published Boolean @default(false)
}

`

- now command for start prisma `npx prisma migrate dev`
