import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
class Document extends BaseEntity {
    @PrimaryGeneratedColumn()
    @IsNumber()
    @IsOptional()
    id?: number;

    /** Title of this document */
    @Column()
    @IsString()
    title!: string;
    
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

    /** Cached Slate content of the law document */
    @Column({ type: 'mediumtext' })
    @IsString()
    content!: string;

    /** Cached XML file content of the law document */
    @Column({ type: 'mediumtext' })
    @IsString()
    xml!: string;

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

    /** Encode content to reduce size in database */
    // @BeforeInsert()
    // @BeforeUpdate()
    // encodeContent() {
    //     this.content = Buffer.from(this.content).toString('base64');
    // }

    /** Decode content */
    // @AfterLoad()
    // decodeContent() {
    //     this.content = Buffer.from(this.content, 'base64').toString('utf-8');
    // }
}

export default Document;