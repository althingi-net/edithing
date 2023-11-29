import { IsDate, IsNumber, IsOptional, Length } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  @IsOptional()
  id?: string;

  @Column()
  @Length(2, 30)
  firstName!: string;
  
  @Column()
  @Length(2, 30)
  lastName!: string;

  @CreateDateColumn()
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @UpdateDateColumn()
  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}

export default User;