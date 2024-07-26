const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const { authenticateToken, authorizeRole } = require("../middleware/auth");

// Admin Waiting List
router.get(
  "/admin/waiting-list",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    try {
      // Fetching all projects with status 'pending'
      const projects = await Project.findAll({
        where: { status: "pending" },
        attributes: [
          "id",
          "userId",
          "photo",
          "businessLicensePhoto",
          "bankAccountNumber",
          "income",
          "neededFunds",
          "profitSharing",
          "status",
          "createdAt",
          "updatedAt",
        ],
      });

      if (projects.length === 0) {
        return res.status(404).json({ message: "No pending projects found" });
      }

      res.json({
        message: "Menunggu Persetujuan Admin",
        projects: projects.map((project) => ({
          id: project.id,
          userId: project.userId,
          photo: project.photo,
          businessLicensePhoto: project.businessLicensePhoto,
          bankAccountNumber: project.bankAccountNumber,
          income: project.income,
          neededFunds: project.neededFunds,
          profitSharing: project.profitSharing,
          status: project.status,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        })),
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Admin Approve/Reject Project
router.post(
  "/admin/projects/:id",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // approved or rejected

    // Ensure status is either 'approved' or 'rejected'
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status value. Must be 'approved' or 'rejected'",
      });
    }

    try {
      // Fetch project by ID
      const project = await Project.findByPk(id, {
        attributes: [
          "id",
          "userId",
          "photo",
          "businessLicensePhoto",
          "bankAccountNumber",
          "income",
          "neededFunds",
          "profitSharing",
          "status",
          "createdAt",
          "updatedAt",
        ],
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Update project status
      project.status = status;
      await project.save();

      res.json({
        message: `Project has been ${status}`,
        project: {
          id: project.id,
          userId: project.userId,
          photo: project.photo,
          businessLicensePhoto: project.businessLicensePhoto,
          bankAccountNumber: project.bankAccountNumber,
          income: project.income,
          neededFunds: project.neededFunds,
          profitSharing: project.profitSharing,
          status: project.status,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
