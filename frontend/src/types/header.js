// Header Types

// Header variant types
export const HeaderVariant = {
  PRIMARY: 'primary',      // No back button - for main pages (Home)
  SECONDARY: 'secondary',  // With back button - for internal pages
  CHAT: 'chat'            // Chat specific - adaptive mobile/desktop
};

// User data structure
export const User = {
  name: 'João da Silva',
  title: 'Explorador',
  avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80',
  credits: {
    used: 35,
    total: 50,
    percentage: 70
  }
};

// Notification structure
export const Notification = {};