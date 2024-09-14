import { getCustomRepository } from 'typeorm';
import { ProductsRepository } from '../typeorm/repositores/ProductsRepository';
import { UsersRepository } from '@modules/users/typeorm/repositories/UsersRepository';
import { CustomersRepository } from '@modules/customers/typeorm/repositories/CustomersRepository';
import Product from '../typeorm/entities/Product';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';

interface IRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
  photos: Array<string>;
  user_id: string;
}

class UpdateProductService {
  public async execute({
    id,
    name,
    price,
    quantity,
    photos,
    user_id,
  }: IRequest): Promise<Product> {
    const userRepository = getCustomRepository(UsersRepository);

    const user = await userRepository.findOne(user_id);
    if (!user) {
      throw new AppError('User not found.');
    }

    const customerRepository = getCustomRepository(CustomersRepository);

    const productRepository = getCustomRepository(ProductsRepository);

    const product = await productRepository.findOne(id);

    if (!product) {
      throw new AppError('Product not found.');
    }

    const productExists = await productRepository.findByName(name);

    if (productExists && name != product.name) {
      throw new AppError('There is already one product with this name');
    }

    const customer = await customerRepository.findOne(product.customer_id);
    if (!customer) {
      throw new AppError('Customer not found.');
    }

    if (customer.email != user.email) {
      throw new AppError('Operation not permited.', 403);
    }

    const redisCache = new RedisCache();

    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    product.name = name;
    product.price = price;
    product.quantity = quantity;
    product.photos = photos;

    await productRepository.save(product);

    return product;
  }
}

export default UpdateProductService;
