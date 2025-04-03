import { Job } from "../models/jobModel.js";

// ✅ Post new job
export const postJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experience,
            position,
            companyId
        } = req.body;

        const userId = req.userId; // ✅ use correct user ID from middleware

        // Optional: validate fields
        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: Array.isArray(requirements)
                ? requirements
                : requirements.split(",").map(item => item.trim()),
            salary: Number(salary),
            experienceLevel: Number(experience),
            location,
            jobType,
            position: Number(position),
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });

    } catch (error) {
        console.error("Job Post Error:", error);
        return res.status(500).json({
            message: "Failed to post job.",
            success: false
        });
    }
};

// ✅ Get all jobs (for students)
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };

        const jobs = await Job.find(query).populate("company").sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.error("Get Jobs Error:", error);
        return res.status(500).json({
            message: "Failed to retrieve jobs.",
            success: false
        });
    }
};

// ✅ Get job by ID (for students)
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await Job.findById(jobId).populate("applications");

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error("Get Job By ID Error:", error);
        return res.status(500).json({
            message: "Failed to retrieve job.",
            success: false
        });
    }
};

// ✅ Get admin’s jobs
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.userId; // ✅ fix user ID reference

        const jobs = await Job.find({ created_by: adminId }).populate("company").sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.error("Get Admin Jobs Error:", error);
        return res.status(500).json({
            message: "Failed to retrieve admin jobs.",
            success: false
        });
    }
};
