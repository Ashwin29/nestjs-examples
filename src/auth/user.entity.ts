import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

/**
 * Entity that holds the user params.
 */
@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  /**
   * Salt is stored in the database for the
   * purpose of checking the hash when the user
   * signs in.
   */
  salt: string;

  /**
   *  Check the password entered while signing in against
   *  the password hash stored in the database.
   *
   * @param password To be compared against the hash.
   */
  async validatePassword(password: string): Promise<boolean> {
    // Generate the hash.
    const hash = await bcrypt.hash(password, this.salt);

    // Compare the stored hash with the generated and return the bool.
    return hash === this.password;
  }
}
