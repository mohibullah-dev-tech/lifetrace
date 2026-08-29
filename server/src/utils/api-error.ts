export class ApiError extends Error {
  statusCode: number;
  success: boolean;
  errors: unknown;

  constructor(
    statusCode: number,
    message: string,
    errors: unknown = null
  ) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}