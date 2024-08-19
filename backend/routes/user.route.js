import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router()
import { updateUser,deleteUser,signout,getUsers } from '../controllers/user.controller.js';



router.put('/update/:userId',verifyToken,updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout',signout);
router.get('/getusers', verifyToken, getUsers);


export default router; 