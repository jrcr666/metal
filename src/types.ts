export type Machine = {
  MachineId: string;
  TypeId: string; // Tipo de máquina
  Name: string;
  NrId: string;
  MaterialId: string;
  OutContainer1: string;
  StatusId: string;
  LineId: string;
  Lines: Line[];
  Order?: { OrderRef: string };
};

export type MachineBody = {
  Machine: Machine;
  NrAlert: boolean;
  ClientMaterial: 'Y' | 'N';
  Finished: boolean;
};
