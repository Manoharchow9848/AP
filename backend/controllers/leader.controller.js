import { data } from "../utils/mandal.js";
import { errorHandler } from '../utils/error.js';
import Leader from "../model/leader.model.js";
import Ticket from "../model/ticket.model.js";

export const getDistrict = async (req, res, next) => {
    try {
      const districts = data.map((item) => item.district);
      res.json(districts);
    } catch (error) {
      next(error);
    }
  }; 

  export const getMandal = async (req, res, next) => {
    const { district } = req.query;
  
    const dist = data.find((d) => d.district === district);
  
    if (dist) {
      res.json({ mandals: dist.mandals });
    } else {
      next(errorHandler(400,"Please Select District"))
    }
  };
  function validatePhoneNumber(phoneNumber) {
    const regex = /^[0-9]{10}$/;
    return regex.test(phoneNumber);
  }
export const create =async(req,res,next)=>{
    if (!req.user.isAdmin ) {
        return next(errorHandler(403, 'You are not allowed to crete the leader'));
      }
      if (
        !req.body.name ||
        !req.body.partyName ||
        !req.body.district ||
        !req.body.mandal ||
        !req.body.fatherName ||
        !req.body.phoneNumber ||
        !req.body.email ||
        !req.body.address ||
        !req.body.Qualification||
        !req.body.age ||  !req.body.designation ||
        !req.body.village || !req.body.caste 
        
      ) {
        return next(errorHandler(400, "Please provide all required fields"));
      }
    try {
        if(!validatePhoneNumber(req.body.phoneNumber)){
            return next(errorHandler(400, "Phone Number is Invalid"));
          }
         
          const newLeader = Leader({
            ...req.body,
          });
          await newLeader.save();
          res.json("Leader Added");
    } catch (error) {
        next(error);
    }
    
}
export const getLead = async(req,res,next)=>{
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === 'asc' ? 1 : -1;
  const leaders = await Leader.find({
    ...(req.query.district && { district: req.query.district }),
    ...(req.query.mandal && { mandal: req.query.mandal }),
    ...(req.query.leadId && { _id: req.query.leadId }),
    ...(req.query.searchTerm && {
      $or: [
        { name: { $regex: req.query.searchTerm, $options: 'i' } },
        
      ],
    }),
  })
  .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

      const totalLeaders = await Leader.countDocuments();

     
   
    res.status(200).json(leaders);
  } catch (error) {
    next(error);
  }
}

export const deletelead = async(req,res,next)=>{
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to delete this mla member'));
  }
  try {
    await Leader.findByIdAndDelete(req.query.leadId);
    res.status(200).json('The leader has been deleted');
  } catch (error) {
    next(error);
  }
  
}
export const updateLeader = async(req,res,next)=>{
  if (!req.user.isAdmin ) {
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }
  try {
    const updatedLeader = await Leader.findByIdAndUpdate(req.query.leadId,{
      $set:{
        name:req.body.name,
        fatherName:req.body.fatherName,
        email:req.body.email,
        partyName:req.body.partyName,
        age:req.body.age,
        district:req.body.district,
        mandal:req.body.mandal,
        phoneNumber:req.body.phoneNumber,
        address:req.body.address,
        Qualification:req.body.Qualification,
        profilePicture:req.body.profilePicture,
        partyMembershipId:req.body.partyMembershipId,
        partyMembershipIdpicture:req.body.partyMembershipIdpicture,
        village:req.body.village,
        caste:req.body.caste,
        designation:req.body.designation,
        partyMembershipIdpic:req.body.partyMembershipIdpic
      },
      
    }, { new: true });
    res.status(200).json(updatedLeader);
  } catch (error) {
    next(error);
  }
  
}
export const creteTicket = async(req,res,next)=>{
  if ( req.user.id !== req.query.userId) {
    return next(errorHandler(403, 'You are not allowed to create this ticket'));
  }
  try {
    const {
      name,
      district,
      mandal,
      village,
      phoneNumber,
      referredBy,
      referredName,
      problemDescription,
      problemDurationDays,
      problemType,email,department,documentUrl
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !district ||
      !mandal ||
      !village ||
      !phoneNumber ||
      !referredBy ||
      !referredName ||
      !problemDescription ||
      !problemDurationDays ||
      !problemType ||
      !email ||
       !department
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new problem ticket
    const newProblem = new Ticket({
      name,
      district,
      mandal,
      village,
      phoneNumber,
      referredBy,
      referredName,
      problemDescription,
      problemDurationDays,
      problemType,
      email,
      userId:req.query.userId,
      department,
      documentUrl

    });

    // Save the problem ticket to the database
    await newProblem.save();

    return res.status(201).json({ message: 'Problem ticket created successfully', problem: newProblem });
  } catch (error) {
    console.error('Error creating problem ticket:', error);
    return res.status(500).json({ message: 'Server error' });
  }
  
  
}
export const getTickets = async(req,res,next)=>{
  try {
    
  const sortDirection = req.query.order === 'asc' ? 1 : -1;
  const tickets = await Ticket.find({
    ...(req.query.userId && {userId: req.query.userId }),
   
  })
  .sort({ updatedAt: sortDirection })
     

      

     
   
    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
}
export const updateStatus = async(req,res,next)=>{
  if (!req.user.isAdmin ) {
    return next(errorHandler(403, 'You are not allowed to update this status'));
  }
  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(req.query.ticketId,{
      $set:{
        status:req.body.status,
        
      },
      
    }, { new: true });
    res.status(200).json(updatedTicket);
  } catch (error) {
    next(error);
  }
  
}
export const deleteTicket = async(req,res,next)=>{
  if (!req.user.isAdmin ) {
    return next(errorHandler(403, 'You are not allowed to delete this ticket'));
  }
  try {
    
    
    await Ticket.findByIdAndDelete(req.query.ticketId);
    res.status(200).json('The ticket has been deleted');
  } catch (error) {
    next(error);
  }
  
}
