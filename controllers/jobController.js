import { Job } from "../models/jobModel.js";
import { Company } from "../models/companyModel.js";

// ✅ Admin posts a job
export const postJob = async (req, res) => {
    try {
        console.log("User ID (created_by):", req.id); // Debugging

        const { title, description, requirements, salary, location, jobType, experienceLevel, position, companyId } = req.body;
        const userId = req.id; // This should not be undefined

        if (!userId) {
            return res.status(400).json({
                message: "User ID is missing. Ensure you are authenticated.",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: Array.isArray(requirements) ? requirements : requirements.split(","),
            salary: Number(salary) || 0,
            location,
            jobType,
            experienceLevel: Number(experienceLevel) || 0,
            position,
            company: companyId,
            created_by: userId // Ensure this is not undefined
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });

    } catch (error) {
        console.error("Error in postJob:", error);
        return res.status(500).json({
            message: "Server error.",
            error: error.message,
            success: false
        });
    }
};


// ✅ Students get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };

        const jobs = await Job.find(query).select("-applications");  // Excluding applications for efficiency

        return res.status(200).json({
            jobs,
            success: true,
            message: jobs.length ? "Jobs found." : "No jobs available."
        });

    } catch (error) {
        console.error("Error in getAllJobs:", error);
        return res.status(500).json({
            message: "Server error.",
            error: error.message,
            success: false
        });
    }
};

// ✅ Student gets job by ID
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate("company", "name location");  // Populating company details

        if (!job) {
            return res.status(404).json({
                message: "Job not found with the given ID.",
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });

    } catch (error) {
        console.error("Error in getJobById:", error);
        return res.status(500).json({
            message: "Server error.",
            error: error.message,
            success: false
        });
    }
};

// ✅ Admin gets jobs they created
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate("company", "name location");

        return res.status(200).json({
            jobs,
            success: true,
            message: jobs.length ? "Jobs retrieved successfully." : "No jobs found."
        });

    } catch (error) {
        console.error("Error in getAdminJobs:", error);
        return res.status(500).json({
            message: "Server error.",
            error: error.message,
            success: false
        });
    }
};
