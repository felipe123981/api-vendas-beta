import AppError from '@shared/errors/AppError';
import path from 'path';
import fs from 'fs';
import { getCustomRepository } from 'typeorm';
import { ProductsRepository } from '../typeorm/repositores/ProductsRepository';
import uploadConfig from '@config/upload';

interface IRequest {
  id: string;
  photoFilename: string;
}

class DeleteProductPhotoService {
  public async execute({ id, photoFilename }: IRequest): Promise<void> {
    const productsRepository = getCustomRepository(ProductsRepository);

    const product = await productsRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found.');
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
