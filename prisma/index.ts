import { PrismaClient } from "@prisma/client";

// export instance of prisma in Singleton Pattern
const prisma = new PrismaClient();
export default prisma;