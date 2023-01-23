import { Router } from 'express'
import {
	listCompanies, editNoteProfile, showNote,createNote
} from '../controllers/notes/NoteController'
import {sendNotes} from '../controllers/notes/send-notes-user'

const router = Router()

router.get('/', listCompanies)
router.post('/',createNote)
router.put('/', editNoteProfile)
router.get('/show/:id',showNote )
router.post('/',sendNotes)


export default router
