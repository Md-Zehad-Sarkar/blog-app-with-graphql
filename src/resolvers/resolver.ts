import { Mutation } from "./mutations/mutation";
import { Query } from "./query/query";
import { Post } from "./post/post";
import { User } from "./user/user";
import { Profile } from "./profile/profile";

export const resolvers = {
  Query,
  Mutation,
  Post,
  User,
  Profile,
};
