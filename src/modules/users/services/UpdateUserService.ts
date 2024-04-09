import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import { UsersRepository } from '../typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';
import { hash } from 'bcryptjs';

interface IRequest {
  id: string;
  name: string;
  email: string;
  password: string;
}

class UpdateUserService {
  public async execute({ id, name, email, password }: IRequest): Promise<User> {
    const userRepository = getCustomRepository(UsersRepository);

    const user = await userRepository.findOne(id);

    if (!user) {
      throw new AppError('User not found.');
    }

    const userExists = await userRepository.findByEmail(email);

    if (userExists && email != user.email) {
      throw new AppError('There is already one user with this email.');
    }

    user.name = name;
    user.email = email;
    user.password = await hash(password, 8);

    await userRepository.save(user);

    return user;
  }
}

export default UpdateUserService;
