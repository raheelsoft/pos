import { fileStorage } from "../file-storage";
import { MOCK_USERS } from "../mock-data";
import { sessionStorage } from "../session-storage";

export const authService = {
  async signInWithPassword({ email, password }: any) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { data: users } = await fileStorage.fetchCollection("users");
    const userList = users && users.length > 0 ? users : MOCK_USERS;

    const user = userList.find((u: any) => u.email === email);

    if (user) {
      sessionStorage.setSession(user.id, user);
      console.log("[v0] Session created for user:", user.email);
      return { data: { user, session: { user } }, error: null };
    }

    return { data: null, error: { message: "Invalid login credentials" } };
  },

  async signUp({ email, password, options }: any) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      full_name: options?.full_name || "New User",
      role: options?.role || "cashier",
      avatar_url: null,
      created_at: new Date().toISOString(),
    };

    await fileStorage.saveItem("users", newUser);
    sessionStorage.setSession(newUser.id, newUser);
    return { data: { user: newUser }, error: null };
  },

  async getUser() {
    const session = sessionStorage.getCurrentSession();
    if (session?.user) {
      return { data: { user: session.user }, error: null };
    }
    return { data: { user: null }, error: null };
  },

  async signOut() {
    sessionStorage.clearAllSessions();
    return { error: null };
  },

  async resetPasswordForEmail(email: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { data: {}, error: null };
  },
};
