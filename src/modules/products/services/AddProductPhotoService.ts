import AppError from '@shared/errors/AppError';
import path from 'path';
import fs from 'fs';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductsRepository } from '../typeorm/repositores/ProductsRepository';
import uploadConfig from '@config/upload';

interface IRequest {
  id: string;
  photoFilename: string;
}

class AddProductPhotoService {
  public async execute({ id, photoFilename }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductsRepository);

    const product = await productsRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found.');
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
