import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  // Ensure that a UUIDv4 is generated for the ID before insertion
  // This can also be done in a more centralized way using TypeORM event listeners or hooks
  constructor() {
    this.id = uuidv4();
  }
}
