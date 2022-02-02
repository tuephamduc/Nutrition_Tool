import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import _ from "lodash";

dotenv.config();

const secret = process.env.SECRET;


export const generateToken = (data, expiresIn) => {
  const token = jwt.sign(data, secret, { expiresIn });
  return `${token}`;
}

export const decodeToken = (token) => {
  return jwt.verify(token, secret);
}
