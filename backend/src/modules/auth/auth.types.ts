export type User = {
  id: string;
  name: string;
  email: string | null;
  password_hash: string | null;
  is_anonymous: boolean;
  created_at: Date;
};

export type PublicUser = {
  id: string;
  name: string;
  isAnonymous: boolean;
};
