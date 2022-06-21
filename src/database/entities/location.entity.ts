import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  ManyToOne, OneToMany
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { TimeShotEntity } from "./time-shot.entity";

@Entity('locations')
export class LocationEntity extends BaseEntity {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'UUID.' })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174121', description: 'UUID creator.' })
  @Index("ix_locations_creator")
  @ManyToOne(() => UserEntity)
  creator: string;

  @ApiProperty({ example: "First Location", description: "Name location." })
  @Column({ length: 256, unique: true })
  name: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamp", default: null })
  deletedAt?: Date;

  @OneToMany(() => TimeShotEntity, timeShot => timeShot.locationStart)
  startTimeShots: TimeShotEntity[];

  @OneToMany(() => TimeShotEntity, timeShot => timeShot.locationEnd)
  endTimeShots: TimeShotEntity[];
}
