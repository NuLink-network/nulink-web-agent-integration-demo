export type AuthUser = {
  id: string;
  name: string;
};

export type UserResponse = {
  jwt: string;
  user: AuthUser;
};