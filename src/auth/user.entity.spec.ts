import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

describe('When User entity is called,', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.password = 'testPassword';
    user.salt = 'testSalt';
    bcrypt.hash = jest.fn();
  });

  it('Should able return true when the password is valid.', async () => {
    bcrypt.hash.mockReturnValue('testPassword');
    expect(bcrypt.hash).not.toHaveBeenCalled();
    const result = await user.validatePassword('Ash@123');
    expect(bcrypt.hash).toHaveBeenCalledWith('Ash@123', 'testSalt');
    expect(result).toEqual(true);
  });

  it('Should able return false when the password is invalid.', async () => {
    bcrypt.hash.mockReturnValue('wrongPassword');
    expect(bcrypt.hash).not.toHaveBeenCalled();
    const result = await user.validatePassword('Ash@123');
    expect(bcrypt.hash).toHaveBeenCalledWith('Ash@123', 'testSalt');
    expect(result).toEqual(false);
  });
});
