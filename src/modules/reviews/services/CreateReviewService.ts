import { getCustomRepository } from 'typeorm';
import Review from '../typeorm/entities/Review';
import { ReviewsRepository } from '../typeorm/repositories/ReviewsRepository';
import AppError from '@shared/errors/AppError';
import { CustomersRepository } from '@modules/customers/typeorm/repositories/CustomersRepository';
import { ProductsRepository } from '@modules/products/typeorm/repositores/ProductsRepository';
import RedisCache from '@shared/cache/RedisCache';

interface IRequest {
  product_id: string;
  sender_id: string;
  rating: number;
  content: string;
  replied_customers: Array<string>;
}

class CreateReviewService {
  public async execute({
    product_id,
    sender_id,
    rating,
    content,
    replied_customers,
  }: IRequest): Promise<Review> {
    const reviewRepository = getCustomRepository(ReviewsRepository);
    const customerRepository = getCustomRepository(CustomersRepository);
    const productRepository = getCustomRepository(ProductsRepository);

    const customer = await customerRepository.findById(sender_id);

    if (!customer) {
      throw new AppError('Customer not found.');
    }

    const product = await productRepository.findById(product_id);

    if (!product) {
      throw new AppError('Product not found.');
    }

    const review = reviewRepository.create({
      product_id,
      sender_id,
      rating,
      content,
      replied_customers,
    });

    await reviewRepository.save(review);

    await RedisCache.invalidate('api-vendas-REVIEW_LIST');

    await reviewRepository.save(review);

    return review;
  }
}

export default CreateReviewService;
