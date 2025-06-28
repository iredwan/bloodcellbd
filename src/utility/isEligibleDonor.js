import userModel from "../models/UserModel.js";

export const isEligibleDonor = async (userId) => {
  const user = await userModel.findById(userId);

  if (!user) {
    return { eligible: false, reason: "User not found." };
  }

  if (user.isBanned) {
    return { eligible: false, reason: "User is banned." };
  }

  if (!user.isApproved) {
    return { eligible: false, reason: "User is not approved." };
  }

  if (!user.isEligible()) {
    return { eligible: false, reason: "User must wait at least 120 days between donations." };
  }

  return { eligible: true };
};
