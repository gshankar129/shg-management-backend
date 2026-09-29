//import { PrismaClient } from '@prisma/client';
import prisma from "../config/prisma.js";

// Step 2A: Create Group (Guest -> Admin)
export async function createGroup(userId, groupData){
    return await prisma.$transaction(async (tx)=>{
        const group = await tx.group.create({
            data:{
                name:groupData.name,
                village: groupData.village,
                groupCode: `SHG-${Math.floor(1000+ Math.random() * 9000)}`,
                createdById: userId,
            },
        });

        await tx.user.update({
            where:{ id: userId },
            data:{
                groupId: group.id,
                role: 'ADMIN',
            },
        })
        return group;
    })
}

// Step 2B: Send Join Request
export async function requestToJoinGroup(userId, groupCode) {
  const group = await prisma.group.findUnique({ where: { groupCode } });
  if (!group) throw new Error("Group not found");

  return await prisma.joinRequest.create({
    data: {
      userId,
      groupId: group.id,
    },
  });
}

// Get all pending join requests for an SHG group
export async function getPendingRequests(groupId){
    return await prisma.joinRequest.findMany({
        where:{
            groupId :groupId,
            status: 'PENDING',
        },
        include: {
            user:{
                select:{name: true, email: true, phone: true},
            }
        }
    });
}


// Approve or Reject a Join Request
export async function respondToJoinRequest(requestId, action, adminUserId) {
  // 1. Find the request
  const request = await prisma.joinRequest.findUnique({
    where: { id: parseInt(requestId) },
    include: { group: true },
  });

  if (!request) throw new Error('Join request not found');

  // 2. Ensure the action performer is the admin of this group
  if (request.group.createdById !== adminUserId) {
    throw new Error('Unauthorized: Only the group admin can process requests');
  }

  if (action === 'REJECT') {
    return await prisma.joinRequest.update({
      where: { id: parseInt(requestId) },
      data: { status: 'REJECTED' },
    });
  }

  if (action === 'APPROVE') {
    // Transaction: Approve request + promote user to MEMBER
    return await prisma.$transaction([
      prisma.joinRequest.update({
        where: { id: parseInt(requestId) },
        data: { status: 'APPROVED' },
      }),
      prisma.user.update({
        where: { id: request.userId },
        data: {
          groupId: request.groupId,
          role: 'MEMBER',
        },
        select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        groupId: true,
        createdAt: true,
        updatedAt: true,
      },


      }),
    ]);
  }

  throw new Error('Invalid action. Use APPROVE or REJECT.');
}


export async function getGroupMembersCount(groupId) {
  // Option A: Just get the total member count
  const memberCount = await prisma.user.count({
    where: {
      groupId: parseInt(groupId),
      role: { in: ['ADMIN', 'MEMBER'] }, // Counts both Admins and Members
    },
  });

  // Option B: Get full group info along with member list and total count
  const groupDetails = await prisma.group.findUnique({
    where: { id: parseInt(groupId) },
    include: {
      _count: {
        select: { members: true }, // Prisma automatically counts linked members
      },
      members: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      },
    },
  });

  if (!groupDetails) throw new Error("Group not found");

  return {
    groupId: groupDetails.id,
    groupName: groupDetails.name,
    totalMembers: groupDetails._count.members,
    members: groupDetails.members,
  };
}