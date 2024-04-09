import AppError from '@shared/errors/AppError';
import path from 'path';
import fs from 'fs';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductsRepository } from '../typeorm/repositores/ProductsRepository';
import uploadConfig from '@config/upload';
import { getFileExtension } from '@config/utils';

interface IRequest {
  id: string;
  photoFilenames: Array<string>;
}

class UploadProductPhotosService {
  public async execute({ id, photoFilenames }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductsRepository);

    const product = await productsRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found.');
    }
    if (product.photos) {
      for (let i = 0; i < photoFilenames.length; i++) {
        const productPhotoFilePath = path.join(
          uploadConfig.directory,
          photoFilenames[i],
        );
        const productPhotoFileExists = await fs.promises.stat(
          productPhotoFilePath,
        );

        if (
          productPhotoFileExists &&
          (getFileExtension(photoFilenames[i]) == 'png' ||
            getFileExtension(photoFilenames[i]) == 'jpg' ||
            getFileExtension(photoFilenames[i]) == 'jpeg' ||
            getFileExtension(photoFilenames[i]) == 'webp')
        ) {
          await fs.promises.unlink(productPhotoFilePath);
        }

        if (i < product.photos.length) {
          product.photos[i] = photoFilenames[i];
        } else {
          product.photos.push(photoFilenames[i]);
        }
      }
    } else {
      if (photoFilenames.length < 3) {
        throw new AppError('upload atleast 3 pics of product.');
      }
      product.photos = photoFilenames;
    }

    //

    await productsRepository.save(product);

    return product;
  }
}

export default UploadProductPhotosService;
