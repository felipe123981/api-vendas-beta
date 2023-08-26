import { getCustomRepository } from 'typeorm';
import { ReviewsRepository } from '../typeorm/repositories/ReviewsRepository';
import AppError from '@shared/errors/AppError';
import Review from '../typeorm/entities/Review';
import { ProductsRepository } from '@modules/products/typeorm/repositores/ProductsRepository';

interface IRequest {
  product_id: string;
}

class ShowProductReviewsService {
  public async execute({ product_id }: IRequest): Promise<Review[]> {
    const reviewRepository = getCustomRepository(ReviewsRepository);
    const productRepository = getCustomRepository(ProductsRepository);

    const product = await productRepository.findOne(product_id);

    if(!product) {
      throw new AppError("Product does not exists.")
    }

    const review = await reviewRepository.findAllByProductId(product_id);

    if(!review) {
      throw new AppError("This product does not have any reviews.")
    }

    return review;
  }
}

export default ShowProductReviewsService;
