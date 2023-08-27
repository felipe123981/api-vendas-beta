import { getCustomRepository } from 'typeorm';
import Review from '../typeorm/entities/Review';
import { ReviewsRepository } from '../typeorm/repositories/ReviewsRepository';
import AppError from '@shared/errors/AppError';
import { CustomersRepository } from '@modules/customers/typeorm/repositories/CustomersRepository';
import { ProductsRepository } from '@modules/products/typeorm/repositores/ProductsRepository';
import RedisCache from '@shared/cache/RedisCache';
import { UsersRepository } from '@modules/users/typeorm/repositories/UsersRepository';

interface IRequest {
  product_id: string;
  user_id: string;
  rating: number;
  content: string;
  upvotes: number;
  downvotes: number;
  replied_customers: Array<string>;
}

class CreateReviewService {
  public async execute({
    product_id,
    user_id,
    rating,
    content,
    upvotes = 0,
    downvotes = 0,
    replied_customers,
  }: IRequest): Promise<Review> {
    const reviewRepository = getCustomRepository(ReviewsRepository);
    const customerRepository = getCustomRepository(CustomersRepository);
    const productRepository = getCustomRepository(ProductsRepository);
    const userRepository = getCustomRepository(UsersRepository)

    const user = await userRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Customer not found.');
    }

    const customer = await customerRepository.findByEmail(user.email);

    if(!customer) {
      throw new AppError('Customer not found.')
    }

    const sender_id = customer.id;


    const product = await productRepository.findById(product_id);

    if (!product) {
      throw new AppError('Product not found.');
    }

    const review = reviewRepository.create({
      product_id,
      sender_id,
      rating,
      content,
      upvotes,
      downvotes,
      replied_customers,
    });


    await reviewRepository.save(review);

    return review;
  }
}

export default CreateReviewService;
