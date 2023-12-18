import { IsDate, IsNumber, IsOptional } from 'class-validator';
import { BaseEntity, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import BillDocument from './BillDocument';
import User from './User';

@Entity()
class Bill extends BaseEntity {
    @PrimaryGeneratedColumn()
    @IsNumber()
    @IsOptional()
    id?: number;

    /** Author of this bill */
    @ManyToOne(() => User, user => user.bills)
    authorId!: number;

    /** Documents that belong to this bill */
    @OneToMany(() => BillDocument, billDocument => billDocument)
    documents!: BillDocument[];

    /** Date bill was created */
    @CreateDateColumn()
    @IsDate()
    @IsOptional()
    createdAt?: Date;

    /** Date when this bill was last updated */
    @UpdateDateColumn()
    @IsDate()
    @IsOptional()
    updatedAt?: Date;
}

export default Bill;