export class ApiResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;

  constructor(
    statusCode: number,
    data: T,
    message = "Request successful"
  ) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}