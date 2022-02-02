import sequelize from "./index";
import Sequelize, { DataTypes, where } from 'sequelize';
import { UserProfile } from "./UserProfile";
export const User = sequelize.define('User', {
  id: {
    type: Sequelize.STRING(8),
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING(128),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: Sequelize.STRING(128),
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING(128),
    allowNull: false,
    // validate: {
    //   notEmpty: true,
    // },
  },
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  roles: {
    type: Sequelize.STRING(8)
  }
},
);
User.hasOne(UserProfile, { foreignKey: 'userId', sourceKey: 'id' })
UserProfile.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' })