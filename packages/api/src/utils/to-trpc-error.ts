import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  QueryError,
  RelationNotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@ai-sales-page/queries/errors";
import { TRPCError, type TRPC_ERROR_CODE_KEY } from "@trpc/server";

const errorMap: [new (...args: any[]) => Error, TRPC_ERROR_CODE_KEY][] = [
  [NotFoundError, "NOT_FOUND"],
  [RelationNotFoundError, "NOT_FOUND"],
  [ConflictError, "CONFLICT"],
  [UnauthorizedError, "UNAUTHORIZED"],
  [ForbiddenError, "FORBIDDEN"],
  [ValidationError, "BAD_REQUEST"],
  [QueryError, "INTERNAL_SERVER_ERROR"],
];

export function toTRPCError(err: Error): TRPCError {
  for (const [ErrorClass, code] of errorMap) {
    if (err instanceof ErrorClass)
      return new TRPCError({ code, message: err.message });
  }
  return new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err.message });
}
