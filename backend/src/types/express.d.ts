declare global {
  namespace Express {
    interface Locals {
      userId?: string;
    }
  }
}

export {};
