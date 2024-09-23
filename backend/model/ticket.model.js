import mongoose from 'mongoose';

const ticket = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  department: {
    type: [String], // Change to array of strings to store multiple departments
    required: true,
  },
  documentUrl: {
    type: String,
   
  },
  email:{
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  referredBy: {
    type: String,
    enum: ['village', 'mandal', 'self'],
    required: true,
  },
  referredName: {
    type: String,
    required: true,
  },
  problemDescription: {
    type: String,
    required: true,
  },
  problemDurationDays: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  problemType: {
    type: String,
    enum: ['self', 'social service'],
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // This will add `createdAt` and `updatedAt` fields
});

const Ticket = mongoose.model('Problem', ticket);

export default Ticket;
