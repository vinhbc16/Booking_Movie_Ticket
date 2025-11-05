class CustomAPIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;   
  }
}

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message, 400);
  }
}

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message, 401);
  }
}

class ForbiddenError extends CustomAPIError {
    constructor(message){
        super(message,403)
    }
}

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message, 404);
  }
}

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnauthenticatedError,
  ForbiddenError,
  NotFoundError
};