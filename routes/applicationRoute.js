import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/applicationController.js";

const router = express.Router();

router.route("/apply/:id").post(isAuthenticated, applyJob); // Changed to POST
router.route("/applied-jobs").get(isAuthenticated, getAppliedJobs); // Changed route name
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").put(isAuthenticated, updateStatus); // Changed to PUT

export default router;
