import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum UpdateStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    ERROR = 'error',
}

@Entity()
class BillDocumentUpdate extends BaseEntity {
    @PrimaryGeneratedColumn()
    @IsNumber()
    @IsOptional()
    id?: number;
    
    @Column()
    @IsNumber()
    billDocumentId!: number;

    /** Title of this document */
    @Column()
    @IsString()
    title!: string;

    /** Cached Slate content of the law document */
    @Column({ type: 'mediumtext', select: false })
    @IsString()
    content!: string;

    /** Cached Slate events of the law document */
    @Column({ type: 'mediumtext', select: false })
    @IsString()
    events!: string;

    @Column({
        type: 'enum',
        enum: UpdateStatus,
        default: UpdateStatus.PENDING,
    })
    @IsEnum(UpdateStatus)
    @IsOptional()
    status?: UpdateStatus;

    /** Date document was created */
    @CreateDateColumn({ select: false })
    @IsDate()
    @IsOptional()
    createdAt?: Date;

    /** Date when this document was last updated */
    @UpdateDateColumn({ select: false })
    @IsDate()
    @IsOptional()
    updatedAt?: Date;
}

export default BillDocumentUpdate;