export const typeDefs = `#graphql
type Query {
    me: User
    users: [User]
    posts:[Post]
}


  type Mutation {
    signup(
    name: String,
    email: String,
    password: String,
    ): SignUpUser
  }


type SignUpUser {
    token: String
}

type Post {
     id: ID!
     title: String!
     content: String!
     author: User
     createdAt: String!
     published: Boolean!
}

type User {
    id: ID!
    name: String!
    email: String!
    posts:[Post]
    createdAt: String!
}

type Profile {
    id: ID!
    bio: String!
    user: User
    createdAt: String!
}

`;
