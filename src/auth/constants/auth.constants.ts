// Constants for the authentication.
const AuthConstants = {
  ACCESS_TOKEN_DURATION: 3600,
  DUPLICATE_USER_ERROR_CODE: '23505',
  INVALID_CREDENTIALS: 'Invalid credentials',
  JWT_SECRET_KEY: 'blackpinkinyourarea',
  PASSWORD_REGEX: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  PASSWORD_WEAK_MESSAGE: 'Password is too weak.',
  USERNAME_ALREADY_EXISTS: 'Username already exists.',
};

// Export.
export { AuthConstants };
