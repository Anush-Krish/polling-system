const userRepository = require('../repository/userRepository');
const UserDTO = require('../dto/userDTO');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (userData) => {
  // Validate the input data
  const validation = UserDTO.validate(userData);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  // Sanitize the input data
  const sanitizedData = UserDTO.sanitize(userData);

  // Check if user already exists
  const existingUser = await userRepository.findByEmail(sanitizedData.email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(sanitizedData.password, 10);

  // Create new user
  const userDataToSave = {
    name: sanitizedData.name,
    email: sanitizedData.email,
    password: hashedPassword,
    role: sanitizedData.role
  };

  return await userRepository.create(userDataToSave);
};

const login = async (email, password) => {
  // Find user by email
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '24h' }
  );

  return token;
};

const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const updateProfile = async (userId, updateData) => {
  // Validate the update data if it contains user fields
  if (updateData.email) {
    const validation = UserDTO.validate(updateData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    updateData.email = updateData.email.toLowerCase();
  }

  const user = await userRepository.findByIdAndUpdate(
    userId,
    updateData
  );
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};