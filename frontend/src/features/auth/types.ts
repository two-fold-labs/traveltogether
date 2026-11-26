// TODO(TT-20): replace hand-written API types with ones generated from the OpenAPI spec
// Backend: PublicUser
interface User {
  id: string;
  name: string;
  isAnonymous: boolean;
}

// Backend: unnamed, built in auth/auth.controller
interface GuestLoginResponse {
  user: User;
}

export type { User, GuestLoginResponse };
