export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: unknown;
  type?: "FATAL" | "RECOVERABLE";
}

export interface SuccessResponseOptions<T> {
  message?: string;
  statusCode?: number;
  data?: T;
}

export interface ErrorResponseOptions {
  message?: string;
  statusCode?: number;
  error?: unknown;
  type?: "FATAL" | "RECOVERABLE";
}
