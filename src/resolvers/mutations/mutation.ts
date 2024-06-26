import { AuthResolver } from "./auth";
import { PostResolver } from "./post";

export const Mutation = {
  ...AuthResolver,
  ...PostResolver,
};
