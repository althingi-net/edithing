import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn()
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