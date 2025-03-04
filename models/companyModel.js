import mongoose from 'mongoose'

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        reuired: true,
        unique: true
    },
    description: {
        type: String,
        reuired: true
    },
    website: {
        type: String,
        reuired: true
    },
    location: {
        type: String,
    },
    logo: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        reuired: true
    },
    name: {
        type: String,
        reuired: true
    },
}, { timestamps: true })
export const Company = mongoose.model("Company", companySchema)