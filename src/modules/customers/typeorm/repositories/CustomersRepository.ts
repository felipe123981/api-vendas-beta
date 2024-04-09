import { EntityRepository, Repository } from 'typeorm';
import Customer from '../entities/Customer';

@EntityRepository(Customer)
export class CustomersRepository extends Repository<Customer> {
  public async findById(id: string): Promise<Customer | undefined> {
    const customer = this.findOne({
      where: {
        id,
      },
    });
    return customer;
  }
  public async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = this.findOne({
      where: {
        email,
      },
    });
    return customer;
  }
}
