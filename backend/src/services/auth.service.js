import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';
import { HttpError } from '../utils/httpError.js';

// The same message for a wrong email and a wrong password, so it does not reveal which one is wrong
const INVALID_LOGIN = 'Invalid email or password';

// Data about the user that the frontend may see (never the password hash)
export function publicUser(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };
}

export async function login(email, password) {
  if (!email || !password) {
    throw new HttpError(400, 'Email and password are required');
  }

  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user) {
    throw new HttpError(401, INVALID_LOGIN);
  }

  const passwordOk = await bcrypt.compare(password, user.passwordHash);
  if (!passwordOk) {
    throw new HttpError(401, INVALID_LOGIN);
  }

  if (!user.isActive) {
    throw new HttpError(403, 'Your account is deactivated');
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });

  return { token, user: publicUser(user) };
}

export async function getUser(id) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new HttpError(404, 'User not found');
  }
  return publicUser(user);
}
