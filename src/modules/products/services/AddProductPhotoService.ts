import AppError from '@shared/errors/AppError';
import path from 'path';
import fs from 'fs';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductsRepository } from '../typeorm/repositores/ProductsRepository';
import { UsersRepository } from '@modules/users/typeorm/repositories/UsersRepository';
import { CustomersRepository } from '@modules/customers/typeorm/repositories/CustomersRepository';
import uploadConfig from '@config/upload';

interface IRequest {
  id: string;
  photoFilename: string;
  user_id: string;
}

class AddProductPhotoService {
  public async execute({
    id,
    photoFilename,
    user_id,
  }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductsRepository);
    const userRepository = getCustomRepository(UsersRepository);
    const customerRepository = getCustomRepository(CustomersRepository);

    const user = await userRepository.findOne(user_id);

    if(!user) {
      throw new AppError("User not found.");
    }

    const product = await productsRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found.');
    }

    const customer = await customerRepository.findOne(product.customer_id);

    if(!customer) {
      throw new AppError("Customer not found.")
    }
    if (customer.email != user.email) {
      throw new AppError('Operation not permited.', 403);
    }

    /**
     for(let i = 0; i <= product.photos.length; i++) {

     }
     */

    const productPhotoFilePath = path.join(
      uploadConfig.directory,
      photoFilename,
    );
    const productPhotoFileExists = await fs.promises.stat(productPhotoFilePath);

    if (productPhotoFileExists) {
      await fs.promises.unlink(productPhotoFilePath);
    }

    product.photos.push(photoFilename);

    await productsRepository.save(product);

    return product;
  }
}

export default AddProductPhotoService;
