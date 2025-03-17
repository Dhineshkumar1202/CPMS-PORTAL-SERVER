import mongoose from 'mongoose'
import { Job } from './jobModel.js'
import { type } from 'os'
import { stringify } from 'querystring'

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
    }
},{timeseries:true});

export const Application = mongoose.model('Application',applicationShema);