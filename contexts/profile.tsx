import { createContext, useContext, useState } from "react";
import api from "../api";
import { UserProfile } from "../types";

type ContextType = {
  profile: UserProfile | null;
  loadProfile: (id: number) => Promise<void>;
  unloadProfile: () => void;
  loading: boolean;
};

export const ProfileContext = createContext<ContextType>({
  profile: null,
  loadProfile: async () => {},
  unloadProfile: () => {},
  loading: false,
});

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const loadProfile = async (id: number) => {
    setLoading(true);
    const response = await api.profile.get(id);
    console.log("Loaded profile:", response);
    setProfile(response);
    setLoading(false);
  };

  const unloadProfile = () => {
    setProfile(null);
  };

  return (
    <ProfileContext.Provider
      value={{ profile, loadProfile, unloadProfile, loading }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
