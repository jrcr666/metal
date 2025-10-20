import { create } from 'zustand';

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

// Definimos el store
interface UserStore {
  user: UserState;
  setUser: (user: Partial<UserState>) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserStore>(set => ({
  user: defaultUser,

  // Actualiza solo los campos proporcionados
  setUser: user => set(state => ({ user: { ...state.user, ...user } })),

  // Reset al estado por defecto
  resetUser: () => set({ user: defaultUser }),
}));
