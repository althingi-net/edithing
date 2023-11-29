import { IsNumber } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id!: string;

  @Column()
  firstName!: string;
  
  @Column()
  lastName!: string;

  @Column({ update: false })
  createdAt!: Date;

  @Column({ onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}

export default User;