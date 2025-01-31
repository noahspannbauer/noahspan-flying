export class CustomError extends Error {
  statusCode: number;

  constructor(message, name, statusCode) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}