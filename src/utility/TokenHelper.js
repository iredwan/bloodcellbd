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
    if (!token || typeof token !== 'string') return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: Validate basic claims (e.g., id, role, email)
    if (!decoded?.id || !decoded?.role || !decoded?.email) {
      return null;
    }

    return decoded;

  } catch (error) {
    console.error('JWT Decode Error:', error.message); 
    return null;
  }
};

