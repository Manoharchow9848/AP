import Mla from "../model/mla.model.js";
import { errorHandler } from "../utils/error.js";

export const createMla = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  if (
    !req.body.name ||
    !req.body.partyName ||
    !req.body.district ||
    !req.body.constituencies ||
    !req.body.fatherName ||
    !req.body.phoneNumber ||
    !req.body.email ||
    !req.body.address ||
    !req.body.Qualification||
    !req.body.age
    
  ) {
    return next(errorHandler(400, "Please provide all required fields"));
  }
  if(!validatePhoneNumber(req.body.phoneNumber)){
    return next(errorHandler(400, "Phone Number is Invalid"));
  }
  if(req.body.phoneNumber.length!==10){
    return next(errorHandler(400, "Phone Number Should Be 10 digit"));
  }
  const newMla = Mla({
    ...req.body,
  });
  try {
    await newMla.save();
    res.json("Mla Added");
  } catch (error) {
    next(error);
  }
};
function validatePhoneNumber(phoneNumber) {
  const regex = /^\+?[1-9]\d{1,14}$/;
  return regex.test(phoneNumber);
}


export const getmlas = async (req, res, next)=>{
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === 'asc' ? 1 : -1;
  const mla = await Mla.find({
    ...(req.query.district && { district: req.query.district }),
    ...(req.query.constituencies && { constituencies: req.query.constituencies }),
    ...(req.query.mlaId && { _id: req.query.mlaId }),
    
  })
  .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

      const totalMla = await Mla.countDocuments();

     
   
    res.status(200).json(mla);
  } catch (error) {
    next(error);
  }
  
}

export const deletemla = async(req,res,next)=>{
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to delete this mla member'));
  }
  try {
    await Mla.findByIdAndDelete(req.query.mlaId);
    res.status(200).json('The mla has been deleted');
  } catch (error) {
    next(error);
  }
  
}
export const updateMla = async(req,res,next)=>{
  if (!req.user.isAdmin ) {
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }
  try {
    const updatedMla = await Mla.findByIdAndUpdate(req.query.mlaId,{
      $set:{
        name:req.body.name,
        fatherName:req.body.fatherName,
        email:req.body.email,
        partyName:req.body.partyName,
        age:req.body.age,
        district:req.body.district,
        constituencies:req.body.constituencies,
        phoneNumber:req.body.phoneNumber,
        address:req.body.address,
        Qualification:req.body.Qualification,
        services:req.body.services,
        profilePicture:req.body.profilePicture,
        services:req.body.services,
      },
      
      
    }, { new: true });
    res.status(200).json(updatedMla);
  } catch (error) {
    next(error);
  }
  
}