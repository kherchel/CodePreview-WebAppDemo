import { createContext, useContext, useEffect, useState } from "react";
import { LoginProps, RegisterProps, User } from "../types";
import api from "../api";

type ContextType = {
  user: User | null;
  loading: boolean;
  login: (props: LoginProps) => Promise<boolean>;
  register: (props: RegisterProps) => Promise<boolean>;
  logout: () => Promise<void>;
  reloadUser: () => Promise<User | null>;
  errors: string[];
  clearErrors: () => void;
  deleteAccount: () => Promise<boolean>;
  update: (props: Partial<User>) => Promise<boolean>;
  acceptTOS: () => Promise<boolean>;
  avatar: string | null;
  userUpdateKey: number; // Used to force a re-render of avatar component after user updates it
};

export const UserContext = createContext<ContextType>({
  user: null,
  loading: true,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  reloadUser: async () => null,
  errors: [],
  clearErrors: () => {},
  deleteAccount: async () => false,
  update: async () => false,
  acceptTOS: async () => false,
  avatar: null,
  userUpdateKey: 0,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [userUpdateKey, setUserUpdateKey] = useState(0);

  useEffect(() => {
    reloadUser();
  }, []);

  const login = async ({ username, password }: LoginProps) => {
    setErrors([]);
    setLoading(true);
    const response = await api.user.login({ username, password });

    if (response.errors) {
      setErrors(response.errors);
      setLoading(false);
      return;
    }
    if (response.message) {
      setErrors([response.message]);
      setLoading(false);
      return;
    }

    console.log("User login response:", response);
    await reloadUser();
    setLoading(false);

    return response;
  };

  const register = async ({ username, email, password }: RegisterProps) => {
    setUser(null);
    setLoading(true);
    const response = await api.user.register({ username, email, password });
    console.log("User register response:", response);
    return await login({ username, password });
  };

  const logout = async () => {
    await api.user.logout();
    setUser(null);
  };

  const deleteAccount = async () => {
    if (!user) return false;
    const response = await api.user.deleteAccount(user.id);
    console.log("User delete response:", response);
    setUser(null);
    return response;
  };

  const reloadUser = async () => {
    const response = await api.user.getMyself();
    console.log("User reload response:", response);
    setUser(response);
    const avatar = api.members.getAvatar(response.id);
    setAvatar(avatar);
    setLoading(false);
    return response;
  };

  const update = async (props: Partial<User>) => {
    if (!user) return false;
    try {
      const response = await api.user.update(user.id, props);
      console.log("User update response:", response);
      await reloadUser();
      setUserUpdateKey((key) => key + 1);
      return response;
    } catch (e) {
      console.error("User update error:", e);
      return false;
    }
  };

  const acceptTOS = async () => {
    if (!user) return false;
    const response = await api.tos.accept();
    console.log("TOS accept response:", response);
    await reloadUser();
    return response;
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        reloadUser,
        errors,
        clearErrors,
        deleteAccount,
        update,
        acceptTOS,
        avatar,
        userUpdateKey,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
