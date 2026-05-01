import { STATUS_CODES } from "@/constants/status-codes";
import {
  SuccessResponseOptions,
  ApiResponse,
  ErrorResponseOptions,
} from "@/types/api-response";

export function successResponse<T>({
  data,
  message = "Request successful",
  statusCode = STATUS_CODES.OK,
}: SuccessResponseOptions<T>): ApiResponse<T> {
  return { success: true, statusCode, message, data };
}

export function errorResponse<T = unknown>({
  error,
  message = "Something went wrong",
  statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR,
  type = "RECOVERABLE",
}: ErrorResponseOptions): ApiResponse<T> {
  return { success: false, statusCode, message, error, type };
}
