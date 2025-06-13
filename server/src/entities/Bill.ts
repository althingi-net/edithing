import { IsDate, IsEnum, IsNumber, IsOptional, IsString, IsInt, ValidateNested, Min, Length } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import BillDocument from './BillDocument';
import User from './User';

export enum BillStatus {
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

    /** Public ID of this bill */
    @Column()
    @IsInt()
    @Min(1)
    lagasafnId!: number;

    /** Title of this bill */
    @Column()
    @IsString()
    @Length(3)
    title!: string;

    /** Description of this bill */
    @Column()
    @IsString()
    @Length(10)
    description!: string;

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
