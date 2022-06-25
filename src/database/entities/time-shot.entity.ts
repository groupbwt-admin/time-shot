import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from "./user.entity";
import { LocationEntity } from "./location.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity('time_shots')
export class TimeShotEntity extends BaseEntity {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'UUID.' })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => UserEntity, user => user.timeShots, { nullable: false })
    @JoinColumn({ name: "userId" })
    user: UserEntity;

    @ManyToOne(() => LocationEntity, location => location.startTimeShots, { nullable: false })
    @JoinColumn({ name: "locationStartId" })
    locationStart: LocationEntity;

    @ManyToOne(() => LocationEntity, location => location.endTimeShots, { nullable: true })
    @JoinColumn({ name: "locationEndId" })
    locationEnd: LocationEntity;

    @Column({ precision: null, type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    start: Date;

    @Column({ precision: null, type: "timestamp", nullable: true })
    stop?: Date;
}