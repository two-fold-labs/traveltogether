interface User {
  id: string;
  name: string;
  isAnonymous: boolean;
}

interface GuestLoginResponse {
  user: User;
}

export type { User, GuestLoginResponse };
