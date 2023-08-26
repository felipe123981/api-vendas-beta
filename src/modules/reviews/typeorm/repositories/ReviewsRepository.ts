import { EntityRepository, In, Repository } from 'typeorm';
import Review from '../entities/Review';

interface IFindReviews {
  id: string;
  rating: number;
  upvotes: number;
  downvotes: number;
}

@EntityRepository(Review)
export class ReviewsRepository extends Repository<Review> {
  public async findById(id: string): Promise<Review | undefined> {
    const review = this.findOne(id);
    return review;
  }

  public async findAllByRatings(reviews: IFindReviews[]): Promise<Review[]> {
    const reviewRatings = reviews.map(review => review.rating);
    const existReviews = this.find({
      where: {
        rating: In(reviewRatings),
      },
    });

    return existReviews;
  }
  public async findAllByUpvotes(reviews: IFindReviews[]): Promise<Review[]> {
    const reviewUpvotes = reviews.map(review => review.upvotes);
    const existReviews = this.find({
      where: {
        upvotes: In(reviewUpvotes),
      },
    });

    return existReviews;
  }
  public async findAllByDownvotes(reviews: IFindReviews[]): Promise<Review[]> {
    const reviewDownvotes = reviews.map(review => review.downvotes);
    const existReviews = this.find({
      where: {
        downvotes: In(reviewDownvotes),
      },
    });

    return existReviews;
  }
  public async findAllByProductId(product_id: string): Promise<Review[]> {

    const reviewsProduct = this.find({
      where: {
        product_id,
      }
    })

    return reviewsProduct;
  }
  public async findAllByCustomerId(customer_id: string): Promise<Review[] | undefined> {

    const reviewsCustomer = this.find({
      where: {
        customer_id,
      }
    })

    return reviewsCustomer;
  }
}
