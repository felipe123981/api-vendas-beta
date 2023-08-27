import { Request, Response } from 'express';
import ListReviewsService from '../services/ListReviewsService';
import ShowCustomerReviewsService from '../services/ShowCustomerReviewsService';
import ShowProductReviewsService from '../services/ShowProductReviewsService';
import CreateReviewService from '../services/CreateReviewService';
import UpdateReviewService from '../services/UpdateReviewService';
import DeleteReviewService from '../services/DeleteReviewService';
import QueryString from 'qs';

export default class ReviewsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const ListReviews = new ListReviewsService();

    const products = await ListReviews.execute();

    return response.json(products);
  }

  public async productShow(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { product_id } = request.params;

    const showProduct = new ShowProductReviewsService();

    const reviews = await showProduct.execute({ product_id });

    return response.json(reviews);
  }
  public async customerShow(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { sender_id } = request.params;

    const showReviews = new ShowCustomerReviewsService();

    const reviews = await showReviews.execute({ sender_id });

    return response.json(reviews);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const {
      rating,
      content,
      upvotes,
      downvotes,
      sender_id,
      product_id,
      replied_customers,
    } = request.body;

    const createProduct = new CreateReviewService();

    const product = await createProduct.execute({
      rating,
      content,
      upvotes,
      downvotes,
      sender_id,
      product_id,
      replied_customers,
    });

    return response.json(product);
  }
  public async update(request: Request, response: Response): Promise<Response> {
    const { rating, content } = request.body;
    const { id } = request.params;

    const updateReview = new UpdateReviewService();

    const review = await updateReview.execute({
      id,
      rating,
      content,
    });

    return response.json(review);
  }
  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteReview = new DeleteReviewService();

    await deleteReview.execute({ id });

    return response.json([]);
  }
}
