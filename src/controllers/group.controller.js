import * as groupService from '../services/group.service.js';

export async function createGroupHandler(req, res) {
  try {
    const userId = req.user.id; // Passed from auth middleware
    const group = await groupService.createGroup(userId, req.body);
    res.status(201).json({ success: true, data: group });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function joinGroupHandler(req, res) {
  try {
    const userId = req.user.id;
    const request = await groupService.requestToJoinGroup(userId, req.body.groupCode);
    res.status(200).json({ message: "Join request submitted", data: request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// Get pending requests handler
export async function getPendingRequestsHandler(req, res) {
  try {
    const adminGroupId = req.user.groupId; // From auth middleware token
    if (!adminGroupId) {
      return res.status(400).json({ error: 'Admin is not associated with any group' });
    }

    const requests = await groupService.getPendingRequests(adminGroupId);
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Process request handler
export async function respondToRequestHandler(req, res) {
  try {
    const { requestId } = req.params;
    const { action } = req.body; // Expects "APPROVE" or "REJECT"
    const adminUserId = req.user.id;

    const result = await groupService.respondToJoinRequest(requestId, action, adminUserId);
    res.status(200).json({ success: true, message: `Request ${action.toLowerCase()}d successfully`, data: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


export async function getGroupMembersHandler(req, res) {
  try {
    const { groupId } = req.params;
    const data = await groupService.getGroupMembersCount(groupId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}