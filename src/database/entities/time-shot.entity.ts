import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from "./user.entity";
import { LocationEntity } from "./location.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity('time_shots')
export class TimeShotEntity extends BaseEntity {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'UUID.' })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => UserEntity, user => user.timeShots, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "userId" })
    user: UserEntity;

    @ManyToOne(() => LocationEntity, location => location.startTimeShots, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "locationStartId" })
    locationStart: LocationEntity;

    @ManyToOne(() => LocationEntity, location => location.endTimeShots, {
        nullable: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "locationEndId" })
    locationEnd: LocationEntity;

    @CreateDateColumn({ type: "timestamp" })
    start: Date;

    @Column({ type: "timestamp", nullable: true })
    stop: Date;
}