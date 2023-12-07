import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Document from './Document';
import User from './User';

@Entity()
class History extends BaseEntity {
    @PrimaryGeneratedColumn()
    @IsNumber()
    @IsOptional()
    id?: number;

    @ManyToOne(() => Document)
    document!: Document;

    @ManyToOne(() => User)
    user!: User;

    @Column()
    @IsString()
    changeDocument!: string;

    @Column()
    @IsString()
    gitCommitId!: string;

    /** Date when entry was created */
    @CreateDateColumn()
    @IsDate()
    @IsOptional()
    createdAt?: Date;
}

export default History;