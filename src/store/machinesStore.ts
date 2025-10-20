import type { MachineBody } from '@app-types/machine.types';
import { create } from 'zustand';

interface MachinesStore {
  machines: MachineBody[];
  setMachines: (machines: MachineBody[]) => void;
  updateMachine: (machineId: string, data: Partial<MachineBody>) => void;
  resetMachines: () => void;
}

export const useMachinesStore = create<MachinesStore>(set => ({
  machines: [],

  // 🔹 Setea todas las máquinas
  setMachines: machines => set({ machines }),

  // 🔹 Actualiza una máquina específica
  updateMachine: (machineId, data) =>
    set(state => ({
      machines: state.machines.map(m =>
        m.Machine.MachineId === machineId
          ? {
              ...m,
              ...data,
              Machine: { ...m.Machine, ...(data.Machine ?? {}) },
            }
          : m
      ),
    })),

  resetMachines: () => set({ machines: [] }),
}));
