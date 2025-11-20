declare namespace Express {
  interface UserPayload {
    id: number | string;
    role?: string;
    reputation?: number;
  }

  interface Request {
    user?: UserPayload;
  }
}

