import mongoose from 'mongoose';

const leaderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  partyName: {
    type: String,
    required: true,
  },
  age:{
      type:Number,
      required:true,
  },
  district: {
    type: String,
    required: true,
  },
  mandal: {
    type: String,
    required: true,
    
  },
  village: {
    type: String,
    required: true,
    
  },
  caste: {
    type: String,
    required: true,
    
  },
  phoneNumber:{
    type:String,
    required:true,
  },
  designation:{
    type:String,
    required:true,
  },
  email:{
    type: String,
    required: true,
    unique: true,
  },
  partyMembershipId:{
    type: String,
    unique: true,
  }, 
  partyMembershipIdpicture:{
    type: String,
    default:''
  },

  address:{
    type:String,
    required:true,
  },
  Qualification:{
    type:String,
    required:true,
  },
  profilePicture: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png', // Default profile picture
},

}, { timestamps: true });

const Leader = mongoose.model('Leader', leaderSchema);

export default Leader;
