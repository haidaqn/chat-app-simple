export interface CreateUserSsoPayload {
  email: string;
  fullName: string;
  emailVerified: boolean;
  avatar: string;
}

interface QueryGoogleUser {
  googleId: string;
}

interface QueryAppleUser {
  appleId: string;
}

export type QuerySsoUser = QueryGoogleUser | QueryAppleUser;
