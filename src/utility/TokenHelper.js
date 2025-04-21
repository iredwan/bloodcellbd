import jwt from 'jsonwebtoken';

export const EncodeToken = (email, userId, role) => {
  return jwt.sign(
    {
      email: email,
      id: userId,
      role: role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '30d'
    }
  );
}; 

export const DecodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};
