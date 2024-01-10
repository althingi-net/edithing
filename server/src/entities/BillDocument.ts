import { IsArray, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Bill from './Bill';

@Entity()
class BillDocument extends BaseEntity {
    @PrimaryGeneratedColumn()
    @IsNumber()
    @IsOptional()
    id?: number;

    /** Bill that this document belongs to */
    @ManyToOne(() => Bill, bill => bill.documents)
    billId!: number;

    /** Path to the law document in Github */
    @Column({ unique: true })
    @IsString()
    path!: string;

    /** Law year */
    @Column()
    @IsString()
    year!: string;
    
    /** Law number */
    @Column()
    @IsString()
    nr!: string;

    /** Document in slate format stored as binary from Yjs for realtime collaboration */
    @Column({ type: 'binary' })
    @IsArray()
    slate!: Uint8Array;

    /** Original XML document */
    @Column({ type: 'text' })
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

export default BillDocument;