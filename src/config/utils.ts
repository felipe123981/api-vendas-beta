import { UsersRepository } from '@modules/users/typeorm/repositories/UsersRepository';
import { CustomersRepository } from '@modules/customers/typeorm/repositories/CustomersRepository';
import { getCustomRepository } from 'typeorm';
import AppError from '@shared/errors/AppError';

export function getFileExtension(filename: string): string | undefined {
  const match = /[.]/.exec(filename);
  if (match) {
    const extension = /[^.]+$/.exec(filename)?.[0];
    return extension;
  } else {
    return undefined;
  }
}
export async function verifyOwner(
  user_id: string,
  customer_id: string,
): Promise<boolean> {
  const userRepository = getCustomRepository(UsersRepository);
  const customerRepository = getCustomRepository(CustomersRepository);
  const user = await userRepository.findOne(user_id);

  if (!user) {
    throw new AppError('User not found.');
  }

  const customer = await customerRepository.findOne(customer_id);

  if (!customer) {
    throw new AppError('Customer not found.');
  }
  if (user.email === customer.email) {
    return true;
  }
  return false;
}
