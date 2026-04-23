export class HttpError extends Error {
  status: number = 500;
  code?: string | undefined;
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "HttpError";
  }
  toResponse() {
    return {
      status: this.status,
      message: this.message,
      code: this.code,
      error: this,
    };
  }
}
