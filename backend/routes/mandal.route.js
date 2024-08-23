import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { getDistrict,getMandal,create,getLead,deletelead,updateLeader } from '../controllers/leader.controller.js';
const router = express.Router();



router.get('/dist',verifyToken,getDistrict)
router.get('/mand',verifyToken,getMandal)
router.post('/create',verifyToken,create)
router.get('/getlead',verifyToken,getLead)
router.delete('/delete',verifyToken,deletelead)
router.put('/update',verifyToken,updateLeader)



export default router;
