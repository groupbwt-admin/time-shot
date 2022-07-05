import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';
import { TimeShotEntity } from "./time-shot.entity";

@Entity('users')
export class UserEntity extends BaseEntity {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'UUID.' })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty({ example: 'user@host.com', description: 'Account email.' })
    @Index("ux_users_email", { unique: true })
    @Column({ length: 32, unique: true, nullable: false, update: false })
    email: string;

    @ApiProperty({ example: 'd1e8a70...8943d082', description: 'Hashed password.' })
    @Column({ length: 255, nullable: false, select: true })
    hashedPassword: string;

    @ApiProperty({ example: Role.USER, default: Role.USER, description: "Permission role." })
    @Column('enum', { enum: Role, default: Role.USER, nullable: false })
    role: Role;

    @ApiProperty({ example: '2022-06-27 09:26:50', description: 'timestamp' })
    @CreateDateColumn({ precision: null, type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @ApiProperty({ example: '2022-06-27 09:26:50', description: 'timestamp' })
    @UpdateDateColumn({
        precision: null,
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP"
    })
    updatedAt: Date;

    @ApiProperty({ example: '2022-06-27 09:26:50', description: 'timestamp' })
    @DeleteDateColumn({ precision: null, type: "timestamp", default: null })
    deletedAt?: Date;

    @OneToMany(() => TimeShotEntity, timeShot => timeShot.user)
    timeShots: TimeShotEntity[];
}
