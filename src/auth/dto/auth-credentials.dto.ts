import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { AuthConstants } from '../constants/auth.constants';

// Destructure the constants.
const { PASSWORD_REGEX, PASSWORD_WEAK_MESSAGE } = AuthConstants;

// Authentication credentials DTO.
export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  /**
   * Username must have 4 chars min and 20 chars
   * max and must be a string.
   */
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(12)
  @Matches(PASSWORD_REGEX, {
    message: PASSWORD_WEAK_MESSAGE,
  })
  /**
   * Password must have 6 chars min and 12 chars
   * max and must match the mentioned regex pattern.
   */
  password: string;
}
