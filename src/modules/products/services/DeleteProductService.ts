import { getCustomRepository } from 'typeorm';
import { ProductsRepository } from '../typeorm/repositores/ProductsRepository';
import { UsersRepository } from '@modules/users/typeorm/repositories/UsersRepository';
import { CustomersRepository } from '@modules/customers/typeorm/repositories/CustomersRepository';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';

interface IRequest {
  id: string;
  user_id: string;
}

class DeleteProductService {
  public async execute({ id, user_id }: IRequest): Promise<void> {
    const productRepository = getCustomRepository(ProductsRepository);
    const userRepository = getCustomRepository(UsersRepository);
    const customerRepository = getCustomRepository(CustomersRepository);
    const user = await userRepository.findOne(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    const product = await productRepository.findOne(id);

    if (!product) {
      throw new AppError('Product not found.');
    }

    const customer = await customerRepository.findOne(product.customer_id);

    if(!customer) {
      throw new AppError('Customer not found.')
    }
    if (customer.email != user.email) {
      throw new AppError('Operation not permited.', 403);
    }

    const redisCache = new RedisCache();

    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    await productRepository.remove(product);
  }
}

export default DeleteProductService;
