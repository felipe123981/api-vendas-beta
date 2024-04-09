import { getCustomRepository } from 'typeorm';
import { ReviewsRepository } from '../typeorm/repositories/ReviewsRepository';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';

interface IRequest {
  id: string;
}

class DeleteReviewService {
  public async execute({ id }: IRequest): Promise<void> {
    const reviewRepository = getCustomRepository(ReviewsRepository);

    const review = await reviewRepository.findOne(id);

    if (!review) {
      throw new AppError('Review not found.');
    }
    const redisCache = new RedisCache();

    await redisCache.invalidate('api-vendas-REVIEW_LIST');

    await reviewRepository.remove(review);
  }
}

export default DeleteReviewService;
