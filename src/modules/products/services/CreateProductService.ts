import { getCustomRepository } from 'typeorm';
import { ProductsRepository } from '../typeorm/repositores/ProductsRepository';
import { CustomersRepository } from '@modules/customers/typeorm/repositories/CustomersRepository'; // Importe corretamente o repositório de clientes
import AppError from '@shared/errors/AppError';
import Product from '../typeorm/entities/Product';
import RedisCache from '@shared/cache/RedisCache';
import { UsersRepository } from '@modules/users/typeorm/repositories/UsersRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
  photos: Array<string>;
  user_id: string;
}

class CreateProductService {
  public async execute({
    name,
    price,
    quantity,
    photos,
    user_id,
  }: IRequest): Promise<Product> {
    const productRepository = getCustomRepository(ProductsRepository);
    const customerRepository = getCustomRepository(CustomersRepository); // Obtenha o repositório de clientes
    const userRepository = getCustomRepository(UsersRepository);

    const productExists = await productRepository.findByName(name);
    if (productExists) {
      throw new AppError('Already exists one product with this name.');
    }

    const user = await userRepository.findOne(user_id);
    if (!user) {
      throw new AppError('Customer not found.');
    }

    const customer = await customerRepository.findByEmail(user.email); // Obtenha o cliente pelo ID

    if (!customer) {
      throw new AppError('Customer not found.');
    }

    const customer_id = customer.id;

    const redisCache = new RedisCache();
    const product = productRepository.create({
      name,
      price,
      quantity,
      photos,
      customer_id,
    });

    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    await productRepository.save(product);

    console.log(`User ${user.name} created the product ${product.name}.`)

    return product;
  }
}

export default CreateProductService;
