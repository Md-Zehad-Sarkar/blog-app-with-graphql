export const typeDefs = `#graphql
type Query {
    me(id:Int!): User
    users: [User]
    posts:[Post]
    profiles: [Profile]
    profile(id:Int!): Profile
}


  type Mutation {
    signup(
    name: String!
    email: String!
    password: String!
    bio: String
    ): AuthPayload

    signIn(
    email: String!,
    password: String!,
    ): AuthPayload

    addPost(
    post:PostInput!
    ): PostPayload

    updatePost(postId:ID!, post:PostInput):PostPayload

    deletePost(postId:ID!):PostPayload
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
    posts: String
    createdAt: String!
}

type Profile {
    id: ID!
    bio: String!
    user: User
    createdAt: String!
}


type AuthPayload {
    userError: String
    token: String
}

type PostPayload {
     postStatus: String
     post: Post
}

input PostInput {
title:String
content:String
}
`;
