import { Request, Response, RequestHandler } from 'express'
import { NoteType} from '../../entities/NoteType.entity'
import { AppDataSource } from '../../config/database/data-source'
import { sendNotFoundResponse } from '../../helpers/responses/404.response'
import { NoteTypeValidation } from '../../helpers/validations/note-type.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
// import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'

const listCompanies = async (req: Request, res: Response) => {
	try{
	const NoteTypes: NoteType[] = await AppDataSource.manager.find<NoteType>(
		NoteType,
		{			relations: ["user"],
	}
	)
	sendSuccessResponse<NoteType[]>(res, NoteTypes)
	}
	catch (e: any) {
		sendErrorResponse(
			formatValidationErrors(e),
			res,
			StatusCodes.BAD_REQUEST
		)
	}
}
const showNoteType = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	try{
	const noteType = await AppDataSource.getRepository(NoteType).findOneOrFail({
		where: {
			id: parseInt(req.params.id),
		},
		relations: ['user', 'programs', 'programs.cycles','reviews'],
	})
	
		sendSuccessResponse<NoteType>(res, noteType)

}
catch (e: any) {
	sendErrorResponse(
		formatValidationErrors(e),
		res,
		StatusCodes.BAD_REQUEST
	)
}
}

const editNoteTypeProfile = async (req: Request, res: Response) => {
	try {
		const id=2 ;
		const validation: NoteType = await NoteTypeValidation.validateAsync(
			req.body,
			{ abortEarly: false }
		)
		const updateResult = await AppDataSource.manager.update<NoteType>(
			NoteType,
			{
				id,
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
export { listCompanies, editNoteTypeProfile, showNoteType }
