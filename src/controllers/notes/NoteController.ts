import { Request, Response, RequestHandler } from 'express'
import { Note } from '../../entities/Note.entity'
import { AppDataSource } from '../../config/database/data-source'
import { sendNotFoundResponse } from '../../helpers/responses/404.response'
import { noteValidation } from '../../helpers/validations/note.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'

const listCompanies = async (req: Request, res: Response) => {
	try{
	const notes: Note[] = await AppDataSource.manager.find<Note>(
		Note,
		{			relations: ["user"],
	}
	)
	sendSuccessResponse<Note[]>(res, notes)
	}
	catch (e: any) {
		sendErrorResponse(
			formatValidationErrors(e),
			res,
			StatusCodes.BAD_REQUEST
		)
	}
}
const showNote = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	try{
	const note = await AppDataSource.getRepository(Note).findOneOrFail({
		where: {
			id: parseInt(req.params.id),
		},
		relations: ['user', 'programs', 'programs.cycles','reviews'],
	})
	
		sendSuccessResponse<Note>(res, note)

}
catch (e: any) {
	sendErrorResponse(
		formatValidationErrors(e),
		res,
		StatusCodes.BAD_REQUEST
	)
}
}

const viewNoteProfile: RequestHandler = async (req, res) => {
	let criteria
	if (req.params.id) {
		criteria = {
			id: +req.params.id,
		}
	} else {
		criteria = {
			userId: getUserIdFromToken(req),
		}
	}
	try{
	const note = await AppDataSource.getRepository(Note).findOneOrFail({
		where: criteria,
		relations: {
			user: true,
			reviews: true,
		},
	})
		sendSuccessResponse<Note>(res, note)
	
}
catch (e: any) {
	sendErrorResponse(
		formatValidationErrors(e),
		res,
		StatusCodes.BAD_REQUEST
	)
}
}
const editNoteProfile = async (req: Request, res: Response) => {
	try {
		const userId = getUserIdFromToken(req)
		const validation: Note = await noteValidation.validateAsync(
			req.body,
			{ abortEarly: false }
		)
		const updateResult = await AppDataSource.manager.update<Note>(
			Note,
			{
				userId,
			},
			validation
		)
		if (updateResult.affected === 1) {
			sendSuccessResponse(res)
		} else {
			sendErrorResponse(['Failed to update'], res, StatusCodes.NO_CHANGE)
		}
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
export { listCompanies, viewNoteProfile, editNoteProfile, showNote }
