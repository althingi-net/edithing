import { IsDate, IsEnum, IsLowercase, IsNumber, IsOptional, Length } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import bcrypt from 'bcrypt';

export enum UserRole {
    ADMIN = 'admin',
    EDITOR = 'editor',
}

@Entity()
class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    @IsNumber()
    @IsOptional()
    id?: number;

    @Column()
    @Length(2, 30)
    firstName!: string;

    @Column()
    @Length(2, 30)
    lastName!: string;

    @Column({ unique: true })
    @IsLowercase()
    email!: string;

    @Column({ select: false })
    password!: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.EDITOR,
    })
    @IsEnum(['editor', 'admin'])
    @IsOptional()
    role?: UserRole;

    @Column({ nullable: true, select: false })
    authenticationToken?: string;

    @Column({ nullable: true, select: false })
    resetPasswordToken?: string;

    @Column({ nullable: true, select: false })
    resetPasswordExpires?: Date;

    @Column({ default: false, select: false })
    isActive?: boolean;

    @CreateDateColumn()
    @IsDate()
    @IsOptional()
    createdAt?: Date;

    @UpdateDateColumn()
    @IsDate()
    @IsOptional()
    updatedAt?: Date;

    static hashPassword(password: string) {
        return bcrypt.hash(password, 10);
    }

    async comparePassword(password: string) {
        const user = await User.find({ where: { id: this.id }, select: ['password'], take: 1 });

        if (!user.length) {
            throw new Error('User not found');
        }

        return bcrypt.compare(password, user[0].password);
    }

    @BeforeInsert()
    async hashPassword() {
        this.password = await User.hashPassword(this.password);
    }
}

export default User;