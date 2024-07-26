const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Project = sequelize.define("Project", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  businessLicensePhoto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bankAccountNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  income: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  neededFunds: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  profitSharing: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },
});

module.exports = Project;
