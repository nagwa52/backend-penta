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
import { NoteType } from './NoteType.entity'
import { MediaFiles } from './MediaFiles.entity'
import {
	IsInt,
	IsNumber,
	IsPositive,
	IsString,
	Length,
	Max,
	Min,
} from 'class-validator'
import { User } from './User.entity'
@Entity()
export class Note extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	@Length(3)
	@IsString()
	title: string

	@Column({ type: 'longtext' })
	@Length(10)
	@IsString()
	message_body: string                              

	@Column({ default: '' })
	@IsString()
	media_files?: string

	@OneToOne(() => NoteType)
	@JoinColumn()
	noteType: NoteType

	@OneToMany(() => MediaFiles, (mediaFiles) => mediaFiles.note)
	mediaFiles?: MediaFiles[]

    @ManyToMany(() => User, (user) => user.notes)
    @JoinTable(
		{
		name: 'user_notes',
	}
	)
    users: User[]

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
