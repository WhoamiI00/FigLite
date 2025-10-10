// Utility functions for user management and naming

const adjectives = [
  "Creative",
  "Brilliant",
  "Swift",
  "Clever",
  "Bold",
  "Bright",
  "Sharp",
  "Quick",
  "Smart",
  "Wise",
  "Cool",
  "Fresh",
  "Epic",
  "Super",
  "Mega",
  "Ultra",
  "Pro",
  "Elite",
  "Prime",
  "Star",
  "Master",
  "Expert",
  "Ace",
  "Top",
  "Best",
  "Great",
  "Amazing",
  "Awesome",
  "Fantastic",
  "Wonderful",
  "Excellent",
  "Perfect",
  "Divine",
];

const nouns = [
  "Designer",
  "Artist",
  "Creator",
  "Builder",
  "Maker",
  "Inventor",
  "Architect",
  "Painter",
  "Sketcher",
  "Drawer",
  "Sculptor",
  "Crafter",
  "Developer",
  "Coder",
  "Wizard",
  "Ninja",
  "Master",
  "Hero",
  "Champion",
  "Legend",
  "Star",
  "Genius",
  "Phoenix",
  "Eagle",
  "Tiger",
  "Lion",
  "Wolf",
  "Dragon",
  "Falcon",
  "Hawk",
  "Rocket",
  "Comet",
  "Storm",
  "Thunder",
  "Lightning",
  "Meteor",
  "Galaxy",
];

export function generateDummyName(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 999) + 1;

  return `${adjective}${noun}${number}`;
}

export function getStoredUserName(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("neolive_user_name");
  }
  return null;
}

export function setStoredUserName(name: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("neolive_user_name", name);
  }
}

export function getUserName(): string {
  let name = getStoredUserName();
  if (!name) {
    name = generateDummyName();
    setStoredUserName(name);
  }
  return name;
}

export function updateUserName(newName: string): string {
  const cleanName = newName.trim() || generateDummyName();
  setStoredUserName(cleanName);
  return cleanName;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
  type: "message" | "system" | "join" | "leave";
}

export function createChatMessage(
  userId: string,
  userName: string,
  message: string,
  type: "message" | "system" | "join" | "leave" = "message"
): ChatMessage {
  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    userName,
    message,
    timestamp: Date.now(),
    type,
  };
}

export function formatMessageTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();

  // If it's today, show time only
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // If it's this year, show month/day and time
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Otherwise show full date
  return date.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
