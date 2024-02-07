import { IsDate, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Bill from './Bill';

@Entity()
@Index(['bill', 'identifier'], { unique: true })
class BillDocument extends BaseEntity {
    @PrimaryGeneratedColumn()
    @IsNumber()
    @IsOptional()
    id?: number;

    /** Document identifier, example: '2023-73' */
    @Column()
    @IsString()
    identifier!: string;

    /** Bill that this document belongs to */
    @ManyToOne(() => Bill, bill => bill.documents)
    @ValidateNested()
    bill!: Bill;

    /** Title of this document */
    @Column()
    @IsString()
    title!: string;

    /** Cached Slate content of the law document */
    @Column({ type: 'mediumtext' })
    @IsString()
    content!: string;

    @Column({ type: 'mediumtext' })
    @IsOptional()
    events: string = '[]';

    /** Original XML file content of the law document */
    @Column({ type: 'mediumtext' })
    @IsString()
    originalXml!: string;

    // @Column({ type: 'text' })
    // @IsOptional()
    // changes!: string;

    /** Date document was created */
    @CreateDateColumn()
    @IsDate()
    @IsOptional()
    createdAt?: Date;

    /** Date when this document was last updated */
    @UpdateDateColumn()
    @IsDate()
    @IsOptional()
    updatedAt?: Date;
}

export class UpdateBillDocument {
    @IsString()
    title!: string;

    @IsString()
    content!: string;

    @IsString()
    events!: string;
}

export default BillDocument;