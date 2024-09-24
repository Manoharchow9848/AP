import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { getDistrict,getMandal,create,getLead,deletelead,updateLeader, creteTicket, getTickets, updateStatus, deleteTicket } from '../controllers/leader.controller.js';
const router = express.Router();



router.get('/dist',verifyToken,getDistrict)
router.get('/mand',verifyToken,getMandal)
router.post('/create',verifyToken,create)
router.get('/getlead',verifyToken,getLead)
router.delete('/delete',verifyToken,deletelead)
router.put('/update',verifyToken,updateLeader)
router.post('/create-ticket',verifyToken,creteTicket)
router.get('/getTic',verifyToken,getTickets)
router.put('/updateStatus',verifyToken,updateStatus)
router.delete('/deleteticket',verifyToken,deleteTicket)


export default router;
