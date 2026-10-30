import { PrismaClient } from '@prisma/client';

// One shared database client for the whole backend
const prisma = new PrismaClient();

export default prisma;
