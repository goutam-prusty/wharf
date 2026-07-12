export class UnauthorizedError extends Error {
  constructor(message = 'You must be signed in to do this.') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'You do not have access to this resource.') {
    super(message);
    this.name = 'ForbiddenError';
  }
}
