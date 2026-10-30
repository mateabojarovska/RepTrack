// An error with an HTTP status code; the error handler in app.js sends it to the client
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
