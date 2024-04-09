import { getCustomRepository } from 'typeorm';
import RedisCache from '@shared/cache/RedisCache';
import Review from '../typeorm/entities/Review';
import { ReviewsRepository } from '../typeorm/repositories/ReviewsRepository';

class ListReviewsService {
  public async execute(): Promise<Review[]> {
    const reviewRepository = getCustomRepository(ReviewsRepository);

    const redisCache = new RedisCache();

    let reviews = await redisCache.recover<Review[]>(
      'api-vendas-REVIEW-LIST',
    );

    if (!reviews) {
      reviews = await reviewRepository.find();

      await redisCache.save('api-vendas-REVIEW_LIST', reviews);
    }

    return reviews;
  }
}

export default ListReviewsService;
