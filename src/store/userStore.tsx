// store/userStore.ts
import { createContext, useContext, useState } from 'react';

export interface UserState {
  UserId: string;
  DeviceId: string;
  UserName: string;
  Password: string;
  Host: string;
  RegistrationId: string;
  Name: string;
  Surname: string;
  Protocol: string;
}

const defaultUser: UserState = {
  UserId: 'proba',
  DeviceId: '',
  UserName: '',
  Password: '',
  Host: 'localhost:3000/api',
  RegistrationId: '',
  Name: '',
  Surname: '',
  Protocol: 'http://',
};

interface UserContextType {
  user: UserState;
  setUser: React.Dispatch<React.SetStateAction<UserState>>;
}

const UserContext = createContext<UserContextType>({
  user: defaultUser,
  setUser: () => {},
});

const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(defaultUser);
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

const useUser = () => useContext(UserContext);

export { UserProvider, useUser };
