import { Router } from 'express'
const router = Router()
const multer = require('multer')
import { viewUserProfile,createUser,uploadProfilePicture} from '../controllers/user_controller/UserController'
import { storage } from "../helpers/common/storage-customizer";
import { USER_DIRECTORY } from "../helpers/constants/directories";
const upload = multer({ storage: storage(USER_DIRECTORY) })

router.post('/', createUser)
router.post('/:id/profile_picture', upload.single("profile_picture"), uploadProfilePicture)
router.get('/', viewUserProfile)
export default router
