// import { User, UserProfile } from '../models/index';
import { User } from "../models/User"
import { UserProfile } from "../models/UserProfile"
import { Tracking } from "../models/Tracking"
import * as errors from '../helpers/errors';
import path from 'path';
import fs from "fs";
import dotenv from 'dotenv'
import _ from 'lodash';
import bcrypt from 'bcrypt'
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
dotenv.config();
dotenv.config();

const userResolver = {
  Tracking: {
    food: async (parent, args, context) => {
      return context.loader.foodLoader.load(parent.foodId)
    }
  },

  User: {
    userProfile: async (parent, args, context) => {
      return await UserProfile.findOne({
        where: { userId: parent.id }
      })
    }
  },

  Query: {
    //Admin
    getUsers: async (parent, { userQuery }, context) => {
      const { search, active, orderby, limit, page } = userQuery
      const query = search ? search : ""

      const offset = (page - 1) * limit
      const user = await User.findAndCountAll({
        where: {
          [Op.or]: [
            {
              username: { [Op.iLike]: '%' + query + '%' }
            },
            {
              email: { [Op.iLike]: '%' + query + '%' }
            },
          ]
        },
        limit: limit,
        offset: offset
      });
      const totalPage = Math.ceil((user.count) / limit)
      const hasNextPage = page * limit < (user.count - 1)
      const edges = user.rows
      const total = user.count
      return ({
        total,
        totalPage,
        hasNextPage,
        edges
      })
    },

    getUserById: async (parent, { id }, context) => {
      return await User.findOne({
        where: { id: id }
      })
    },
    countUser: async (parent, args, context) => {
      const numUser = await User.count(
        {
          where: { active: true }
        }
      )
      return numUser
    },
    countNewUser: async (parent, args, context) => {
      const today = new Date().setHours(0, 0, 0, 0);
      const numNewUser = await User.count(
        {
          where: {
            createdAt: {
              [Op.gt]: today
            }
          }
        }
      )

      return numNewUser
    },


    //User
    userProfile: async (parent, args, context) => {
      // console.log(context.user);
    },
    getFoodsLog: async (parent, args, context) => {
      try {
        const userId = context.user.user.id;
        const foodLog = await Tracking.findAll({
          where: { userId: userId }
        });
        return foodLog
      } catch (err) {
        throw err
      }
    },
    getFoodsLogByDate: async (parent, { date }, context) => {
      console.log(date);
      try {
        const userId = context.user.user.id;
        const foodLog = await Tracking.findAll({
          where: {
            [Op.and]: [
              { userId: userId },
              {}
            ]
          }
        });
        return foodLog
      } catch (err) {
        throw err
      }
    },
    getFoodLogById: async (_, { id }, context) => {
      try {
        const track = await Tracking.findOne({
          where: { id: id }
        })
        return track
      } catch (err) {
        throw err
      }
    }
  },



  Mutation: {
    //Admin

    addUser: async (parent, { userInput }, context) => {
      const input = JSON.parse(JSON.stringify(userInput))
      const hashPassword = await bcrypt.hash(input.password, 12)
      try {
        const existUser = await User.findOne({
          where: { email: input.email }
        })
        if (!existUser) {
          const user = await User.create({
            username: input.username,
            email: input.email,
            password: hashPassword,
            active: input.active,
            roles: input.roles
          })
          const id = user.id
          const userProfile = await UserProfile.create({
            userId: id,
            gender: input.gender || null,
            birthday: input.birthday || null,
          })
          const res = { ...user.dataValues, ...userProfile.dataValues }
          return res

        }
        else {
          throw new Error('Email already used !!!');
        }
      } catch (err) {
        throw err
      }
    },
    editUser: async (parent, { userInput, id }, context) => {
      const input = JSON.parse(JSON.stringify(userInput))
      try {
        const a = await User.update({
          username: input.username,
          active: input.active,
          roles: input.roles
        },
          {
            where: {
              id: id
            }
          }
        )
        const b = await UserProfile.update({
          gender: input.gender || null,
          birthday: input.birthday || null,
        },
          {
            where: { userId: id }
          })
        const user = await User.findOne({ where: { id: id } })
        const userProfile = await UserProfile.findOne({ where: { userId: id } })
        const res = { ...user.dataValues, ...userProfile.dataValues }
        return res
      }
      catch (error) {
        throw (error)
      }
    },
    changeActiveUser: async (parent, { id }, context) => {
      await User.update({ active: !active }, {
        where: {
          id: id
        }
      });
    },

    //User
    uploadAvatar: async (_, { file }, context) => {
      const roles = context.user.user.roles
      const userId = context.user.user.id

      try {

        const { createReadStream, filename, mimetype, encoding } = await file
        const stream = createReadStream()
        const newfileName = new Date().getTime() + '_' + filename
        const pathName = path.join(__dirname, `../public/images/Avatar/${newfileName}`)
        await stream.pipe(fs.createWriteStream(pathName))

        const imageDBPath = `/images/Avatar/${newfileName}`

        await UserProfile.update({ avatar: imageDBPath }, { where: { userId: userId } })
        return {
          url: imageDBPath,
          success: true
        }
      } catch (error) {
        return error
      }
    },

    changeUserProfile: async (_, userProfileInput, context) => {
      try {
        const input = JSON.parse(JSON.stringify(userProfileInput))
        console.log(context);
        const userInput = input.userProfileInput
        const userId = context.user.user.id;
        await User.update({
          username: userInput.username
        }, {
          where: { id: userId }
        })
        const userProfile = await UserProfile.findOne({ where: { userId: userId } })
        if (userProfile) {
          const userProfiles = await userProfile.update({
            gender: userInput.gender,
            birthday: userInput.birthday,
            height: userInput.height,
            weight: userInput.weight
          }, {
            where: {
              userId: userId
            }
          });
        }
        else {
          const userProfile = await UserProfile.create({
            userId: userId,
            gender: userInput.gender,
            birthday: userInput.birthday,
            height: userInput.height,
            weight: userInput.weight
          });
          // return userProfile;
        }

        const updateUser = await User.findOne({ where: { id: userId } })
        const updateProfile = await UserProfile.findOne({ where: { userId: userId } })
        const res = { ...updateUser.dataValues, ...updateProfile.dataValues }
        return res
      }
      catch (err) {
        throw err
      }
    },

    changePassword: async (_, { oldPassword, newPassword }, context) => {
      try {
        if (!context.user) {
          throw new Error("Bạn chưa đăng nhập, vui lòng kiểm tra lại")
        }
        const userId = context.user.user.id
        const findUser = await User.findOne({ where: { id: userId } })
        const hashPassword = await bcrypt.hash(newPassword, 12)
        const valid = await bcrypt.compare(oldPassword, findUser.password);

        if (!valid) {
          throw new Error("Mật khẩu không đúng! Vui lòng kiểm tra lại")
        }
        await User.update({ password: hashPassword }, {
          where: { id: userId }
        });
        return true
      }
      catch (error) {
        throw error
      }
    },
    // FoodTracking

    addFoodLog: async (_, { input }, context) => {
      console.log(input);
      try {
        const userId = context.user.user.id
        const returnData = []
        for (let i = 0; i < input.length; i++) {
          const foodLog = await Tracking.create({
            userId: userId,
            foodId: input[i].foodId,
            meal: input[i].meal,
            weight: input[i].weight,
            date: input[i].date
          })
          returnData.push(foodLog.dataValues)
        };

        return returnData
      } catch (error) {
        throw error
      }
    },

    editFoodLog: async (_, { input, id }, context) => {
      const userId = context.user.user.id
      try {
        await Tracking.update({
          foodId: input.foodId,
          meal: input.meal,
          date: input.date,
          weight: input.weight
        },
          { where: { id: id } })

        const returnLog = Tracking.findOne({ where: { id: id } })
        return returnLog
      } catch (err) {
        throw err
      }
    },

    deleteFoodLog: async (_, { id }, context) => {
      console.log(id);
      try {
        await Tracking.destroy({ where: { id: id } })
        return id
      } catch (err) {
        throw (err)
      }
    }
  }

}

export default userResolver;