import mongoose from 'mongoose';

const MlaSchema = new mongoose.Schema({
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
  constituencies: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber:{
    type:String,
    required:true,
  },
  email:{
    type: String,
    required: true,
    unique: true,
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
services: {
  type: [{
    image: {
      type: String,
      default: '', // Default service image
    },
    description: {
      type: String,
      default: '', // Default service description
    },
  }],
}
}, { timestamps: true });

const Mla = mongoose.model('Mla', MlaSchema);

export default Mla;
