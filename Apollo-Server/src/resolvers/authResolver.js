// import sequelize, { User, UserProfile } from '../models/index';
import { User } from "../models/User"
import { UserProfile } from "../models/UserProfile"

import bcrypt from 'bcrypt'
import { generateToken, decodeToken } from "../helpers/jwtHelper";
import { transporter, mailOption } from "../services/mailservice";
import _ from "lodash";
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub()


const authResolvers = {
  User: {
    userProfile: async (parent, args, context) => {
      return await UserProfile.findOne({
        where: { userId: parent.id }
      })
    }
  },
  Query: {

    user: async (parent, { id }) => {
      return await User.findOne({ where: { id: id } })
    },
    currentUser: async (parent, args, { user }) => {
      const userId = user.user.id;
      const currentUser = await User.findOne({ where: { id: userId } })
      return currentUser
    }
  },

  Mutation: {
    signupUser: async (parent, args) => {
      const { username, email, password, roles } = args
      // console.log(args);
      try {
        const existUser = await User.findOne({ where: { email: email, active: true } });
        if (existUser) {
          throw new Error('Email already used !!!');
        }
        const hashPassword = await bcrypt.hash(password, 12)

        const unconfirmUser = await User.findOne({ where: { email: email, active: false } });
        if (unconfirmUser) {
          await User.update({ username: username, password: hashPassword }, {
            where: {
              email: email
            }
          });
          const user = await User.findOne({ where: { email: email } })


          //GENERATE CONFIRMATION URL
          const data = {
            user: _.pick(user, ['id'])
          }
          const token = generateToken(data, "5m");
          const URL = `http://localhost:3000/active/${token}`
          //SEND CONFIRMATION MAIL
          const subject = `*Action Needed* Kích hoạt tài khoản `;
          const text = `Hi ${username},
          Cảm ơn bạn đã đăng ký tài khoản  
          Để kích hoạt tài khoản, vui lòng truy cập link sau:
          <a href="${URL}">${URL}</a>`



          await transporter.sendMail(mailOption(email, subject, text)).then(
            () => console.log("Check your email")
          )
          return user;

        }
        else {
          const user = await User.create({
            username: username,
            email: email,
            password: hashPassword,
            active: false,
            roles: roles
          })

          //GENERATE CONFIRMATION URL
          const data = {
            user: _.pick(user, ['id'])
          }
          const token = generateToken(data, "5m");
          const URL = `http://localhost:3000/active/${token}`
          //SEND CONFIRMATION MAIL
          const subject = `*Action Needed* Kích hoạt tài khoản `;
          const text = `Hi ${username},
        Cảm ơn bạn đã đăng ký tài khoản  
        Để kích hoạt tài khoản, vui lòng truy cập link sau:
        <a href="${URL}">${URL}</a>`



          await transporter.sendMail(mailOption(email, subject, text)).then(
            () => console.log("Check your email")
          )
          return user;
        }

      } catch (err) {
        throw (err)
      }
    },

    activeEmail: async (parent, { token }) => {
      const { user } = decodeToken(token)
      if (!user) {
        // throw Error("Confirmation is expire. Please try again");
        return false;
      }
      await User.update({ active: true }, {
        where: {
          id: user.id
        }
      });
      await UserProfile.create({
        userId: user.id,
        avatar: "images/defaulAvatar.png"
      })
      return true
    },

    login: async (parent, args) => {
      const { email, password, roles } = args

      const user = await User.findOne({ where: { email: email, active: true, roles: roles } })
      if (!user) {
        throw new Error("Incorrected email !!!");
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error("Password is not correct")
      }

      const data = {
        user: _.pick(user, ['id', 'username', 'roles'])
      }
      const token = generateToken(data, "1d")
      return { user, token };
    },

    sendMailForgotPassword: async (parent, { email }) => {
      const user = await User.findOne({ where: { email: email, active: true } });
      // console.log(user);
      if (!user) {
        throw Error("Email chưa đăng ký trên hệ thống !!!");
        return false
      }
      else {
        //GENERATE CONFIRMATION URL
        const data = {
          user: _.pick(user, ['id', 'email'])
        }
        const token = generateToken(data, "5m");
        const URL = `http://localhost:3000/reset-password/${token}`
        //SEND CONFIRMATION MAIL
        const subject = `Reset Password of ${email}`;
        const text = `Xin chào ${user.username}, Hãy click theo đường link sau để đặt lại mật khẩu:
              <a href="${URL}">${URL}</a>
              Vui lòng chú ý link này chỉ có hiệu lực trong 5 phút
              `
        await transporter.sendMail(mailOption(email, subject, text)).then(
          () => console.log("Check your email"))
        return true
      }
    },

    linkReset: async (parent, { token }) => {
      const { user } = decodeToken(token);
      if (user) {
        return true
      }
      return false
    },

    forgotPassword: async (parent, { token, newPassword }) => {
      const { user } = decodeToken(token);
      const hashPassword = await bcrypt.hash(newPassword, 12)
      if (!user) {
        throw Error("Đã có lỗi xảy ra. Vui lòng kiểm tra lại");
        return false;
      } else {
        await User.update({ password: hashPassword }, {
          where: {
            id: user.id
          }
        });
        return true
      }
    }
  }
}

export default authResolvers