import { Request, Response } from 'express';
import ListProductService from '../services/ListProductService';
import ShowProductService from '../services/ShowProductService';
import CreateProductService from '../services/CreateProductService';
import UpdateProductService from '../services/UpdateProductService';
import DeleteProductService from '../services/DeleteProductService';
import ListProductsByCurrentSessionService from '../services/ListProductsByCurrentSessionService';
import ListProductsByCustomerService from '../services/ListProductsByCustomerService';

export default class ProductsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const ListProducts = new ListProductService();

    const products = await ListProducts.execute();

    return response.json(products);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showProduct = new ShowProductService();

    const product = await showProduct.execute({ id });

    return response.json(product);
  }

  public async showBySession(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const user_id = request.user.id;

    const listProducts = new ListProductsByCurrentSessionService();

    const products = await listProducts.execute({ user_id });

    return response.json(products);
  }

  public async showByCustomerId(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    const listProducts = new ListProductsByCustomerService();

    const products = await listProducts.execute({ id });

    return response.json(products);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { name, price, quantity, photos } = request.body;

    const createProduct = new CreateProductService();

    const product = await createProduct.execute({
      name,
      price,
      quantity,
      user_id,
      photos,
    });

    return response.json(product);
  }
  public async update(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity, photos } = request.body;
    const { id } = request.params;

    const updateProduct = new UpdateProductService();

    const product = await updateProduct.execute({
      id,
      name,
      price,
      quantity,
      photos,
    });

    return response.json(product);
  }
  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteProduct = new DeleteProductService();

    await deleteProduct.execute({ id });

    return response.json([]);
  }
}
