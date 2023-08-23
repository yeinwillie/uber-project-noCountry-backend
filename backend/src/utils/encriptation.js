import bcrypt from 'bcrypt';

// Hash the password using bcrypt
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};


// Verify the provided password with the hashed password
export const verifyHashPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};


