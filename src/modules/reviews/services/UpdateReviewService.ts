import { getCustomRepository } from 'typeorm';
import Review from '../typeorm/entities/Review';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';
import { ReviewsRepository } from '../typeorm/repositories/ReviewsRepository';

interface IRequest {
  id: string;
  rating: number;
  content: string;
}

class UpdateReviewService {
  public async execute({
    id,
    rating,
    content
  }: IRequest): Promise<Review> {
    const reviewRepository = getCustomRepository(ReviewsRepository);

    const review = await reviewRepository.findOne(id);

    if (!review) {
      throw new AppError('Review not found.');
    }

    const redisCache = new RedisCache();

    await redisCache.invalidate('api-vendas-REVIEW_LIST');

    review.rating = rating;
    review.content = content;

    await reviewRepository.save(review);

    return review;
  }
}

export default UpdateReviewService;
