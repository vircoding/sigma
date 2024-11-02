export class FatalError extends Error {
  constructor(message: string) {
    super(message);
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
