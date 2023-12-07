import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { AfterLoad, BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
class Document extends BaseEntity {
    @PrimaryGeneratedColumn()
    @IsNumber()
    @IsOptional()
    id?: number;

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

    /** Cached XML file content of the law document */
    @Column()
    @IsString()
    content!: string;

    /** Date when this document was last downloaded from Github */
    @Column()
    @IsDate()
    @IsOptional()
    downloadedAt!: Date;

    /** Date when this document was last edited */
    @UpdateDateColumn()
    @IsDate()
    @IsOptional()
    editedAt!: Date;

    @BeforeInsert()
    @BeforeUpdate()
    encodeContent() {
        this.content = Buffer.from(this.content).toString('base64');
    }

    @AfterLoad()
    decodeContent() {
        this.content = Buffer.from(this.content, 'base64').toString('utf-8');
    }
}

export default Document;