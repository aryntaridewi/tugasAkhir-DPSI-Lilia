const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("investor", "peternak", "admin"),
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        const count = await User.count({ where: { role: user.role } });
        let prefix = "";
        switch (user.role) {
          case "peternak":
            prefix = "peternak";
            break;
          case "investor":
            prefix = "investor";
            break;
          case "admin":
            prefix = "admin";
            break;
        }
        user.id = `${prefix}${count + 1}`;
        user.password = await bcrypt.hash(user.password, 10);
      },
    },
  }
);

module.exports = User;
