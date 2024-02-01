import { IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import BillDocument from './BillDocument';
import User from './User';

enum BillStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
}

@Entity({ name: 'bill' })
class Bill extends BaseEntity {
    @PrimaryGeneratedColumn()
    @IsNumber()
    @IsOptional()
    id?: number;

    /** Author of this bill */
    @ManyToOne(() => User, user => user.bills, { eager: true })
    @ValidateNested()
    author!: User;

    /** Title of this bill */
    @Column()
    @IsString()
    title!: string;

    /** Documents that belong to this bill */
    @OneToMany(() => BillDocument, billDocument => billDocument.bill, { cascade: true, eager: true })
    @IsOptional()
    documents?: BillDocument[];

    /** Status of this bill */
    @Column({
        type: 'enum',
        enum: BillStatus,
        default: BillStatus.DRAFT,
    })
    @IsEnum(BillStatus)
    @IsOptional()
    status?: BillStatus;

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