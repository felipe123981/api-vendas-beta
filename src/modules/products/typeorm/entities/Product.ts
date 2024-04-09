import Customer from '@modules/customers/typeorm/entities/Customer';
import OrdersProducts from '@modules/orders/typeorm/entities/OrdersProducts';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('int')
  price: number;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  @Column('string')
  customer_id: Customer;

  @OneToMany(() => OrdersProducts, order_products => order_products.product)
  order_products: OrdersProducts[];
  /*
  }
  @Column('simple-array', { nullable: true })
  photos: string[];

  @Column('simple-array', { nullable: true })
  colors: string[];

  @Column('simple-array', { nullable: true })
  materials: string[];
   */

  /*
  @Column('int')
  rating: number; //0-5

  @Column('string')
  description: string;

  @Column('string')
  material: string;

  @Column('varchar', { array: true })
  categories: string[];

  @Column('int')
  heigth: number;

  @Column('int')
  width: number;

  @Column('int')
  length: number; // nullable if plan(2d)

  @Column('string')
  size: string; //(S, M, L, XL)

  @Column('int')
  number: number;

  @Column('string')
  brand: string;

  @Column('string')
  model: string;

  @Column('string')
  color: string; //hex or color name

  @Column('string')
  publisher: string;

  //@Column('string')
  //customer_id: string;
   */
  @Column('int')
  quantity: number;

  @Column('varchar', { array: true })
  photos: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Product;
