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

export class CredentialsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Credentials Error';
  }
}

export class RefreshTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Refresh Token Error';
  }
}

export class NotAgentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Not Agent Error';
  }
}

export class PasswordCodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Password Code Error';
  }
}

export class MaxPostLengthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Max Post Length Error';
  }
}

export class MaxFileSizeImageError extends Error {
  index: number;

  constructor(message: string, index: number) {
    super(message);
    this.name = 'Max File Size Image Error';
    this.index = index;
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Forbidden Error';
  }
}
