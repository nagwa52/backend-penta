
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	OneToOne,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Note } from './Note.entity'
import { IsInt, IsString, Max, Min,IsPositive,IsBoolean,Length} from 'class-validator'
@Entity()
export class NoteType extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	@Length(3)
	@IsString()
	name: string

	@Column({
		type: 'int',
		default: 0,
	})
	@IsBoolean()
	disable: boolean

    @OneToOne(() => Note, (note) => note.note_type) // specify inverse side as a second parameter
    note: Note
	// @IsInt()
	// @Min(1)
	// @Max(5)
	// rating: number

	// @Column({
	// 	type: 'longtext',
	// })
	// @IsString()
	// review: string

	// @Column({
	// 	type: 'int'
	// })
	// @IsInt()
	// @IsPositive()
	// travelerId: number;

	// @ManyToOne(() => Traveler, (traveler) => traveler.cycles_reviews)
	// @JoinColumn()
	// traveler: Traveler

	// @Column({
	// 	type: 'int'
	// })
	// @IsInt()
	// @IsPositive()
	// cycleId: number;

	// @ManyToOne(() => Cycle, (cycle) => cycle.reviews)
	// @JoinColumn()
	// cycle: Cycle

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date

	@DeleteDateColumn()
	deleted_at: Date
}
