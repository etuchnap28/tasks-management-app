export interface AuthState {
  token: string;
  currentUser: string;
}

export interface Token {
  accessToken: string;
}

export interface DecodedTokenPayload {
  user: string;
}

export interface RegisterInput {
  password: string;
}

export interface LoginInput {
  password: string;
}
