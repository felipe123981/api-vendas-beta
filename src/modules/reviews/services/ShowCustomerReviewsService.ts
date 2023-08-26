import { getCustomRepository } from 'typeorm';
import { ReviewsRepository } from '../typeorm/repositories/ReviewsRepository';
import AppError from '@shared/errors/AppError';
import Review from '../typeorm/entities/Review';
import { CustomersRepository } from '@modules/customers/typeorm/repositories/CustomersRepository';

interface IRequest {
  customer_id: string;
}

class ShowCustomerReviewsService {
  public async execute({ customer_id }: IRequest): Promise<Review[]> {
    const reviewRepository = getCustomRepository(ReviewsRepository);
    const customerRepository = getCustomRepository(CustomersRepository);

    const customer = await customerRepository.findOne(customer_id);

    if(!customer) {
      throw new AppError("Customer not found.")
    }

    const review = await reviewRepository.findAllByCustomerId(customer_id);

    if(!review) {
      throw new AppError("This customer haven't posted any reviews yet.");
    }

    return review;
  }
}

export default ShowCustomerReviewsService;
