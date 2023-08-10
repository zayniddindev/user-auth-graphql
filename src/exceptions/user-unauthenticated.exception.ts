export class UserUnauthenticatedException extends Error {
  constructor() {
    super("User is unauthenticated");
  }
}
