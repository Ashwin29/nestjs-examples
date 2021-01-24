// Constants for the authentication.
const AuthConstants = {
  DUPLICATE_USER_ERROR_CODE: '23505',
  INVALID_CREDENTIALS: 'Invalid credentials',
  PASSWORD_REGEX: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  PASSWORD_WEAK_MESSAGE: 'Password is too weak.',
  USERNAME_ALREADY_EXISTS: 'Username already exists.',
};

// Export.
export { AuthConstants };
