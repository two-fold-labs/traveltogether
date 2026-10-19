import type { ErrorCode } from './error.constants.js';

export type ValidationIssue = {
  field: string;
  message: string;
};

export type AppErrorOptions = {
  code: ErrorCode;
  message?: string | undefined;
  details?: ValidationIssue[] | undefined;
};
