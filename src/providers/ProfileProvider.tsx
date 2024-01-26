import React, {
  createContext,
  useContext,
  useState,
  ReactElement,
  useEffect,
} from "react";
import * as api from "api";
import { useLocation, useNavigate } from "react-router";

interface ProfileContextProps {
  profile: any;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
}

const ProfileContext = createContext<ProfileContextProps | null>(null);

export const ProfileProvider = ({ children }: { children: ReactElement }) => {
  const [profile, setProfile] = useState<any>(null);
  const navigator = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await api.GetCurrentUser();
        if (data.name) setProfile(data);
        else if (location.pathname !== "/login") navigator("/login");
      } catch (error) {
        if (location.pathname !== "/login") navigator("/login");
      }
    };

    getProfile();
  }, [location]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
