import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthConstants } from './constants/auth.constants';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { UserRepository } from './user.repository';

/**
 * Takes care of the authentication business logic.
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
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
  signIn = async (
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> => {
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

    // Initialize the jwt payload object.
    const payload: JwtPayload = { username };

    // Create an access token.
    const accessToken = await this.jwtService.sign(payload);

    // Return the accessToken.
    return { accessToken };
  };
}
