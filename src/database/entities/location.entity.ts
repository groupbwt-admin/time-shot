import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    DeleteDateColumn,
    BaseEntity,
    Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('locations')
export class LocationEntity extends BaseEntity {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'UUID.' })
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @ApiProperty({ example: 'user@user.com', description: "Creator email." })
    @Index("ux_locations_creator_email")
    @Column({ length: 32, unique: false, nullable: false })
    creator_email: string;

    @ApiProperty({ example: 'Name', description: 'Name location.' })
    @Column({ length: 128, unique: true, nullable: false })
    name: string;

    @ApiProperty({ example: 1, description: 'Location active or no active' })
    @Column({ type: 'bit' })
    isActive: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;

    @DeleteDateColumn({ type: "timestamp", default: null })
    deletedAt?: Date;
}