import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthConstants } from '../constants/auth.constants';
import { UserRepository } from '../user.repository';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: AuthConstants.JWT_SECRET_KEY,
    });
  }

  /**
   * Verify whether the user from payload
   * object is present in the database.
   *
   * @param payload Jwt Payload object.
   */
  validate = async (payload: JwtPayload) => {
    // Destructure the payload object.
    const { username } = payload;

    // Fetch user entity, if the user is present.
    const user = await this.userRepository.findOne({ username });

    if (!user) {
      // If the user is not present send unauthorized 401 exception.
      throw new UnauthorizedException();
    }

    // Return user.
    return user;
  };
}
