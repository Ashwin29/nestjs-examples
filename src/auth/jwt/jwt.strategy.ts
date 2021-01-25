import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from '../user.repository';
import { JwtPayload } from './jwt-payload.interface';
import * as config from 'config';

const jwtConfig = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.secret,
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
