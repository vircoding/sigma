export class FatalError extends Error {
  constructor() {
    super('Fatal Error');
    this.name = 'Fatal Error';
  }
}

type FieldError = {
  field: string;
  message: string;
};

export class FormFieldError extends Error {
  fields: FieldError[];

  constructor(message: string, data: { fields: FieldError[] }) {
    super(message);
    this.name = 'Form Field Error';
    this.fields = data.fields;
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Bad Request Error';
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Conflict Error';
  }
}

export class MaxSizeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Max Size Error';
  }
}

export class BadCredentialsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Bad Credentials Error';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Not Found Error';
  }
}

export class RefreshTokenExpiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Refresh Token Expired Error';
  }
}

export class InvalidRefreshTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Invalid Refresh Token Error';
  }
}

export class AccessTokenExpiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Access Token Expired Error';
  }
}

export class InvalidAccessTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Invalid Access Token Error';
  }
}
