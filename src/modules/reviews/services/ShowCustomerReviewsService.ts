import { getCustomRepository } from 'typeorm';
import { ReviewsRepository } from '../typeorm/repositories/ReviewsRepository';
import AppError from '@shared/errors/AppError';
import Review from '../typeorm/entities/Review';
import { CustomersRepository } from '@modules/customers/typeorm/repositories/CustomersRepository';

interface IRequest {
  sender_id: string;
}

class ShowCustomerReviewsService {
  public async execute({ sender_id }: IRequest): Promise<Review[]> {
    const reviewRepository = getCustomRepository(ReviewsRepository);
    const customerRepository = getCustomRepository(CustomersRepository);

    const customer = await customerRepository.findOne(sender_id);

    if(!customer) {
      throw new AppError("Customer not found.")
    }

    const reviews = await reviewRepository.findAllByCustomerId(sender_id);

    if(!reviews) {
      throw new AppError("This customer haven't posted any reviews yet.");
    }

    return reviews;
  }
}

export default ShowCustomerReviewsService;
