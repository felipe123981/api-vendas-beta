import Customer from '@modules/customers/typeorm/entities/Customer';
import Product from '@modules/products/typeorm/entities/Product';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('reviews')
class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  rating: number;

  @Column()
  content: string;

  @Column()
  upvotes: number;

  @Column()
  downvotes: number;

  @Column('varchar', { array: true })
  replied_customers: string[];

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  @Column('string')
  product_id: Product;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'sender_id' })
  @Column('string')
  sender_id: Customer;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Review;
