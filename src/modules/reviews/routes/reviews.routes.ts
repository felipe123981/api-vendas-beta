import { Router } from 'express';
import ProductsController from '@modules/products/controllers/ProductsController';
import { celebrate, Joi, Segments } from 'celebrate';
import isAuthenticated from '@shared/http/middlewares/isAuthenticated';
import ReviewsController from '../controllers/ReviewsController';
import multer from 'multer';
import uploadConfig from '@config/upload';

const reviewsRouter = Router();
const reviewsController = new ReviewsController();

const upload = multer(uploadConfig);

reviewsRouter.get('/', reviewsController.index);

reviewsRouter.get(
  '/product/:product_id',
  celebrate({
    [Segments.PARAMS]: {
      product_id: Joi.string().uuid().required(),
    },
  }),
  reviewsController.productShow,
);

reviewsRouter.get(
  '/customer/:sender_id',
  celebrate({
    [Segments.PARAMS]: {
      sender_id: Joi.string().uuid().required(),
    },
  }),
  reviewsController.customerShow,
);

reviewsRouter.post(
  '/',

  reviewsController.create,
);

reviewsRouter.put(
  '/:id',
  celebrate({
    [Segments.BODY]: {
      content: Joi.string().required(),
      rating: Joi.number().required(),
    },
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  reviewsController.update,
);

reviewsRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  reviewsController.delete,
);

export default reviewsRouter;
