// Cookie-based session storage for MVP
// This uses a simple in-memory Map for the MVP since we don't have a database
// In production, you would use a proper session store with Redis or database

const SESSION_COOKIE_NAME = "pos_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// In-memory session store (will reset on server restart)
const sessions = new Map<string, any>();

export const sessionStorage = {
  setSession(userId: string, userData: any) {
    const sessionData = {
      user: userData,
      createdAt: Date.now(),
    };

    sessions.set(userId, sessionData);
    return userId;
  },

  getSession(userId?: string) {
    if (userId) {
      return sessions.get(userId) || null;
    }
    // Return the first session if no userId provided
    const firstSession = sessions.values().next().value;
    return firstSession || null;
  },

  deleteSession(userId?: string) {
    if (userId) {
      sessions.delete(userId);
    } else {
      sessions.clear();
    }
  },

  getCurrentSession() {
    // Return the most recent session
    if (sessions.size > 0) {
      const allSessions = Array.from(sessions.values());
      return allSessions[allSessions.length - 1];
    }
    return null;
  },

  getAllSessions() {
    return Array.from(sessions.values());
  },

  clearAllSessions() {
    sessions.clear();
  },
};
