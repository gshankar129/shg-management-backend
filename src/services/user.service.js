import prisma from '../config/prisma.js';

export async function getUserProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { 
      id: Number(userId) 
    },
    select: {
      id: true,
      name: true,
      role: true,
      group: {
        select: { 
          name: true 
        }
      }
    }
  });

  if (!user) return null;

  return {
    id: user.id,
    userName: user.name,
    role: user.role,
    shgName: user.group ? user.group.name : null
  };
}