import { EntityRepository, In, Repository } from 'typeorm';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

@EntityRepository(Product)
export class ProductsRepository extends Repository<Product> {
  public async findByName(name: string): Promise<Product | undefined> {
    const product = this.findOne({
      where: {
        name,
      },
    });
    return product;
  }
  public async findById(id: string): Promise<Product | undefined> {
    const product = this.findOne(id);
    return product;
  }
  public async findAllByIds(products: IFindProducts[]): Promise<Product[]> {
    const productIds = products.map(product => product.id);
    const existProducts = this.find({
      where: {
        id: In(productIds),
      },
    });

    return existProducts;
  }
}
