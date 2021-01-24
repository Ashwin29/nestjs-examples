import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthConstants } from './constants/auth.constants';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';

/**
 * Takes care of the authentication business logic.
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  /**
   * Takes care of creating a new user.
   * @param authCredentialsDto Holds the authentication params.
   */
  signUp = async (authCredentialsDto: AuthCredentialsDto): Promise<void> => {
    return this.userRepository.signUp(authCredentialsDto);
  };

  /**
   * Takes care of signing in an existing user.
   * @param authCredentialsDto Holds the authentication params.
   */
  signIn = async (authCredentialsDto: AuthCredentialsDto) => {
    // Validate the user password.
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!username) {
      // Destructure the constants.
      const { INVALID_CREDENTIALS } = AuthConstants;

      // Throw unauthorized 401 exception.
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }
  };
}
