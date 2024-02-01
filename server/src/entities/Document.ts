import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
class Document extends BaseEntity {
    @PrimaryGeneratedColumn()
    @IsNumber()
    @IsOptional()
    id?: number;

    /** Unique document identifier, example: '2023-73' */
    @Column({ unique: true })
    @IsString()
    identifier!: string;

    /** Title of the law */
    @Column()
    @IsString()
    title!: string;
    
    /** Cached Slate content of the law document */
    @Column({ type: 'mediumtext' })
    @IsString()
    content!: string;

    /** Cached XML file content of the law document */
    @Column({ type: 'mediumtext' })
    @IsString()
    originalXml!: string;

    /** Date when this document was last downloaded from Github */
    @CreateDateColumn()
    @IsDate()
    @IsOptional()
    downloadedAt?: Date;

    /** Date when this document was last edited */
    @UpdateDateColumn()
    @IsDate()
    @IsOptional()
    updatedAt?: Date;
}

export default Document;