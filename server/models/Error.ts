export class UnexpectedError extends Error {
  constructor() {
    super('Unexpected Error');
    this.name = 'Unexpected Error';
  }
}

export class BodyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Body Error';
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Conflict Error';
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Bad Request Error';
  }
}

export class VerifiedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Verified Error';
  }
}

export class VerificationTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VerificationTokenError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Not Found Error';
  }
}
