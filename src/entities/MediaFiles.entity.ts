import {
	BaseEntity,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { IsInt, IsNumber, IsPositive, IsString, Length, Max, Min } from "class-validator";
import { Note } from "./Note.entity"
@Entity()
export class MediaFiles extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	@IsString()
	path: string
	@Column({
		type: "int",
	  })
	 noteId: number
	@ManyToOne(() => Note, (note) => note.mediaFiles, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn()
	note: Note
	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
