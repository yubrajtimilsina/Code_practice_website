
export const getUserInitials = (name) => {
  if (!name || typeof name !== 'string') return "?";
  
  const trimmedName = name.trim();
  if (!trimmedName) return "?";
  
  const parts = trimmedName.split(" ").filter(Boolean);
  
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const getAvatarColor = (identifier) => {
  if (!identifier) return "from-blue-400 to-blue-600";
  
  const colors = [
    "from-blue-400 to-blue-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
    "from-red-400 to-red-600",
    "from-orange-400 to-orange-600",
    "from-yellow-400 to-yellow-600",
    "from-green-400 to-green-600",
    "from-teal-400 to-teal-600",
    "from-cyan-400 to-cyan-600",
    "from-indigo-400 to-indigo-600"
  ];
  
  // Generate consistent color based on identifier
  const hash = identifier.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};

export const formatUserRole = (role) => {
  if (!role) return "User";
  
  const roleMap = {
    "super-admin": "Super Admin",
    "admin": "Admin",
    "learner": "Learner",
    "user": "User"
  };
  
  return roleMap[role.toLowerCase()] || role.charAt(0).toUpperCase() + role.slice(1);
};

export const getRoleBadgeColor = (role) => {
  const roleColors = {
    "super-admin": "bg-yellow-100 text-yellow-700 border-yellow-300",
    "admin": "bg-red-100 text-red-700 border-red-300",
    "learner": "bg-blue-100 text-blue-700 border-blue-300",
    "user": "bg-slate-100 text-slate-700 border-slate-300"
  };
  
  return roleColors[role?.toLowerCase()] || roleColors.user;
};

export const isAdmin = (role) => {
  return role === "admin" || role === "super-admin";
};

export const isSuperAdmin = (role) => {
  return role === "super-admin";
};


export const canManageUsers = (role) => {
  return role === "admin" || role === "super-admin";
};

export const canManageProblems = (role) => {
  return role === "admin" || role === "super-admin";
};


export const canPinDiscussions = (role) => {
  return role === "admin" || role === "super-admin";
};

export const canEdit = (resource, currentUser) => {
  if (!resource || !currentUser) return false;
  
  // Admins can edit anything
  if (isAdmin(currentUser.role)) return true;
  
  // Users can edit their own content
  return resource.userId === currentUser.id || 
         resource.userId?._id === currentUser.id ||
         resource._id === currentUser.id;
};

export const canDelete = (resource, currentUser) => {
  if (!resource || !currentUser) return false;
  
  // Admins can delete anything
  if (isAdmin(currentUser.role)) return true;
  
  // Users can delete their own content
  return resource.userId === currentUser.id || 
         resource.userId?._id === currentUser.id ||
         resource._id === currentUser.id;
};

export const formatNumber = (num) => {
  if (num === null || num === undefined) return "0";
  
  const number = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(number)) return "0";
  
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const calculateAccuracy = (accepted, total) => {
  if (!total || total === 0) return "0.00";
  const accuracy = (accepted / total) * 100;
  return accuracy.toFixed(2);
};

export const getUserLevel = (solved) => {
  if (solved >= 500) return { name: "Master", color: "text-purple-600", bg: "bg-purple-100" };
  if (solved >= 250) return { name: "Expert", color: "text-red-600", bg: "bg-red-100" };
  if (solved >= 100) return { name: "Advanced", color: "text-orange-600", bg: "bg-orange-100" };
  if (solved >= 50) return { name: "Intermediate", color: "text-yellow-600", bg: "bg-yellow-100" };
  if (solved >= 10) return { name: "Beginner", color: "text-green-600", bg: "bg-green-100" };
  return { name: "Novice", color: "text-blue-600", bg: "bg-blue-100" };
};

export const validateUsername = (username) => {
  if (!username) {
    return { isValid: false, error: "Username is required" };
  }
  
  if (username.length < 3) {
    return { isValid: false, error: "Username must be at least 3 characters" };
  }
  
  if (username.length > 20) {
    return { isValid: false, error: "Username must be less than 20 characters" };
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { isValid: false, error: "Username can only contain letters, numbers, hyphens, and underscores" };
  }
  
  return { isValid: true };
};

export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Invalid email format" };
  }
  
  return { isValid: true };
};


export const isSameUser = (user1, user2) => {
  if (!user1 || !user2) return false;
  
  const id1 = typeof user1 === 'object' ? user1._id || user1.id : user1;
  const id2 = typeof user2 === 'object' ? user2._id || user2.id : user2;
  
  return id1 === id2;
};

export const getUserDisplayName = (user) => {
  if (!user) return "Unknown User";
  return user.name || user.email?.split('@')[0] || "User";
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (err) {
    console.error("Failed to copy:", err);
    return { success: false, error: err.message };
  }
};