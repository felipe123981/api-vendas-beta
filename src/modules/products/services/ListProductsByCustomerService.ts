import { getCustomRepository } from 'typeorm';
import { ProductsRepository } from '../typeorm/repositores/ProductsRepository';
import Product from '../typeorm/entities/Product';
import AppError from '@shared/errors/AppError';
import { CustomersRepository } from '@modules/customers/typeorm/repositories/CustomersRepository';
//import RedisCache from '@shared/cache/RedisCache';

interface IRequest {
  id: string;
}

class ListProductsByCustomerService {
  public async execute({ id }: IRequest): Promise<Product[]> {
    const productsRepository = getCustomRepository(ProductsRepository);
    const customersRepository = getCustomRepository(CustomersRepository);

    //const redisCache = new RedisCache();
    const customer = await customersRepository.findOne(id); // Obtenha o cliente pelo ID
    if (!customer) {
      throw new AppError('Customer not found.');
    }

    const products = await productsRepository.findAllByCustomerId(customer.id);

    if (!products) {
      throw new AppError("Customer doesn' have products.");
    }

    return products;
  }
}

export default ListProductsByCustomerService;
