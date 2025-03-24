import mongoose from 'mongoose'

const applicationShema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:['pending','accepted','rejected'],
        default:'pending'
    },
    createdAt: { 
        type: Date, 
        default: Date.now
     }

},{timeseries:true});

export const Application = mongoose.model('Application',applicationShema);