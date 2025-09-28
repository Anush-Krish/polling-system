// UserDTO for Live Polling System
class UserDTO {
  constructor(name, email, password, role) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role || 'student';
  }

  // Method to validate the user data
  static validate(userData) {
    const errors = [];

    if (!userData.name || userData.name.trim().length === 0) {
      errors.push('Name is required');
    }

    if (!userData.email || userData.email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!/^\S+@\S+\.\S+$/.test(userData.email)) {
      errors.push('Email is invalid');
    }

    if (!userData.password || userData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (userData.role && !['student', 'teacher'].includes(userData.role)) {
      errors.push('Role must be either "student" or "teacher"');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Method to sanitize the user data
  static sanitize(userData) {
    return {
      name: userData.name ? userData.name.trim() : '',
      email: userData.email ? userData.email.trim().toLowerCase() : '',
      password: userData.password,
      role: userData.role || 'student'
    };
  }
}

module.exports = UserDTO;