const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Investment = require("../models/Investment");
const { authenticateToken, authorizeRole } = require("../middleware/auth");

// Endpoint untuk membuat proyek baru oleh peternak
router.post(
  "/projects",
  authenticateToken,
  authorizeRole("peternak"),
  async (req, res) => {
    const {
      photo,
      businessLicensePhoto,
      bankAccountNumber,
      income,
      neededFunds,
      profitSharing,
    } = req.body;
    try {
      // Membuat proyek baru dengan data dari request body
      const project = await Project.create({
        userId: req.user.id,
        photo,
        businessLicensePhoto,
        bankAccountNumber,
        income,
        neededFunds,
        profitSharing,
      });
      // Mengembalikan respons sukses dengan status 201
      res.status(201).json({
        message: "Usaha telah diinput, menunggu persetujuan Admin!",
        project,
      });
    } catch (error) {
      // Mengembalikan respons error dengan status 400
      res.status(400).json({ error: error.message });
    }
  }
);

// Endpoint untuk mendapatkan daftar proyek yang disetujui untuk investor
router.get(
  "/projects",
  authenticateToken,
  authorizeRole("investor"),
  async (req, res) => {
    const { sortBy, filterBy } = req.query;
    try {
      // Mendapatkan semua proyek yang disetujui
      let projects = await Project.findAll({ where: { status: "approved" } });

      // Mengurutkan proyek jika ada parameter sortBy
      if (sortBy) {
        projects = projects.sort((a, b) => a[sortBy] - b[sortBy]);
      }

      // Memfilter proyek jika ada parameter filterBy
      if (filterBy) {
        projects = projects.filter((project) => project.status === filterBy);
      }

      // Mengembalikan daftar proyek yang disetujui
      res.json(projects);
    } catch (error) {
      // Mengembalikan respons error dengan status 500
      res.status(500).json({ error: error.message });
    }
  }
);

// Endpoint untuk melakukan investasi pada proyek oleh investor
router.post(
  "/projects/:id/invest",
  authenticateToken,
  authorizeRole("investor"),
  async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;

    // Memastikan jumlah investasi minimal 10 ribu rupiah
    if (amount < 10000) {
      return res
        .status(400)
        .json({ pesan: "Jumlah investasi harus minimal 10 ribu rupiah" });
    }

    try {
      // Mendapatkan proyek berdasarkan ID
      const project = await Project.findByPk(id);
      // Memastikan proyek ditemukan dan sudah disetujui
      if (!project || project.status !== "approved") {
        return res
          .status(404)
          .json({ pesan: "Proyek tidak ditemukan atau belum disetujui" });
      }

      // Membuat investasi baru pada proyek tersebut
      const investment = await Investment.create({
        userId: req.user.id,
        projectId: id,
        amount,
      });

      // Mengembalikan respons sukses dengan status 201
      res
        .status(201)
        .json({ pesan: "Investasi berhasil dilakukan", investment });
    } catch (error) {
      // Mengembalikan respons error dengan status 500
      res.status(500).json({ pesan: "Investasi gagal", error: error.message });
    }
  }
);

// Endpoint untuk melihat investasi pada proyek tertentu
router.get("/projects/:id/investments", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Mendapatkan proyek untuk memastikan proyek ada dan dimiliki oleh user yang terotentikasi
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Memastikan user yang terotentikasi adalah pemilik proyek
    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // Mendapatkan semua investasi pada proyek tersebut
    const investments = await Investment.findAll({
      where: { projectId: id },
      attributes: ["id", "userId", "amount", "createdAt", "updatedAt"],
    });

    // Mengembalikan daftar investasi pada proyek tersebut
    res.json({
      message: "Investments retrieved successfully",
      investments: investments.map((investment) => ({
        id: investment.id,
        userId: investment.userId,
        amount: investment.amount,
        createdAt: investment.createdAt,
        updatedAt: investment.updatedAt,
      })),
    });
  } catch (error) {
    // Mengembalikan respons error dengan status 500
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
