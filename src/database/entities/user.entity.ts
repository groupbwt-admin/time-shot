import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  BaseEntity,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

@Entity('users')
export class UserEntity extends BaseEntity {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'UUID.' })
  @PrimaryGeneratedColumn("uuid")
  id: number;

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

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamp", default: null })
  deletedAt?: Date;
}
