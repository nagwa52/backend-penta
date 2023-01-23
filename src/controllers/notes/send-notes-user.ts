import { Request, Response } from "express";
import { AppDataSource } from "../../config/database/data-source";
import { Note } from "../../entities/Note.entity";
import { User } from "../../entities/User.entity";
import { StatusCodes } from "../../helpers/constants/statusCodes";
import { formatValidationErrors } from "../../helpers/functions/formatValidationErrors";
import { sendErrorResponse } from "../../helpers/responses/sendErrorResponse";
import { sendSuccessResponse } from "../../helpers/responses/sendSuccessResponse";

export const sendNotes = async (req: Request, res: Response) => {

  try {
    const noteId: number | undefined = +req.params.noteId
    const userId: number| undefined = +req.params.userId
    const note = await AppDataSource.getRepository(Note).findOne({
      where: {
        id: noteId,
      },
      relations: ["users"],
    })
    const user = await AppDataSource.getRepository(User).findOne({
      where: {
        id: userId,
      },
      relations: ["notes"]
    })
    let flag: boolean = true
    if (user) {
      user.notes.forEach(function (item) {
        if (item.id == noteId) {
          flag = false;
          return
        }
      });
    }
    if (note && user && flag)
    {
      note.users.push(user)
      // note.followers_count += 1
      await AppDataSource.manager.save(note)
      sendSuccessResponse<Note>(res, note)
    }
    else {
      const error: any = ['not found']
      sendErrorResponse(
        formatValidationErrors(error),
        res,
        StatusCodes.NOT_ACCEPTABLE
      )
    }

  }
  catch (error: any) {
    sendErrorResponse(
      formatValidationErrors(error),
      res,
      StatusCodes.NOT_ACCEPTABLE
    )
  }
}

