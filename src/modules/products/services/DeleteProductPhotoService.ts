import AppError from '@shared/errors/AppError';
import path from 'path';
import fs from 'fs';
import { getCustomRepository } from 'typeorm';
import { ProductsRepository } from '../typeorm/repositores/ProductsRepository';
import uploadConfig from '@config/upload';
import { UsersRepository } from '@modules/users/typeorm/repositories/UsersRepository';
import { CustomersRepository } from '@modules/customers/typeorm/repositories/CustomersRepository';

interface IRequest {
  id: string;
  photoFilename: string;
  user_id: string
}

class DeleteProductPhotoService {
  public async execute({ id, photoFilename, user_id }: IRequest): Promise<void> {
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

    const productPhotoFilePath = path.join(
      uploadConfig.directory,
      photoFilename,
    );
    const productPhotoFileExists = await fs.promises.stat(productPhotoFilePath);

    if (!productPhotoFileExists) {
      throw new AppError('This photo does not exist in your product.');
    }

    const idx = product.photos.findIndex(o => o === photoFilename);

    product.photos.splice(idx, 1);

    await fs.promises.unlink(productPhotoFilePath);

    await productsRepository.save(product);
  }
}

export default DeleteProductPhotoService;
