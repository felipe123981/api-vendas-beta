import { getCustomRepository } from 'typeorm';
import { ProductsRepository } from '../typeorm/repositores/ProductsRepository';
import Product from '../typeorm/entities/Product';
import AppError from '@shared/errors/AppError';
import { CustomersRepository } from '@modules/customers/typeorm/repositories/CustomersRepository';
import { UsersRepository } from '@modules/users/typeorm/repositories/UsersRepository';
//import RedisCache from '@shared/cache/RedisCache';

interface IRequest {
  user_id: string;
}

class ListProductsByCurrentSessionService {
  public async execute({ user_id }: IRequest): Promise<Product[]> {
    const productRepository = getCustomRepository(ProductsRepository);
    const customerRepository = getCustomRepository(CustomersRepository);
    const userRepository = getCustomRepository(UsersRepository);

    //const redisCache = new RedisCache();
    const user = await userRepository.findOne(user_id);
    if (!user) {
      throw new AppError('Customer not found.');
    }

    const customer = await customerRepository.findByEmail(user.email); // Obtenha o cliente pelo ID

    if (!customer) {
      throw new AppError('Customer not found.');
    }

    const customer_id = customer.id;

    const products = await productRepository.findAllByCustomerId(customer_id);

    if (!products) {
      throw new AppError("Customer doesn' have products.");
    }

    return products;
  }
}

export default ListProductsByCurrentSessionService;
