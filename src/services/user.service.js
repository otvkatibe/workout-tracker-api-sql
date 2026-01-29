import db from '../models/index.model.js';

const User = db.users;

export const getAllUsersService = async () => await User.findAll();

export const createUser = async (userData) => await User.create(userData);

export const findUserByUsername = async (username) => await User.findOne({ where: { username } });

export const findUserByEmail = async (email) => await User.findOne({ where: { email } });
