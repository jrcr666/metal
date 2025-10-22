type Material = {
  Name: string;
};

type Line = {
  RodCutLineId: string;
  OLineId: string;
  Quantity: number;
  QuantityAux?: number;
  Left: number;
  Dimension: string;
  Material: Material;
  MaterialId: string;
  Weight: number;
  SchlatterLineId: string;
  ModelRef: string;
  Verified_NR?: string | null;
};

export type Machine = {
  MachineId: string;
  TypeId: string;
  Name: string;
  NrId: string;
  MaterialId: string;
  OutContainer1: string;
  StatusId: string;
  LineId: string;
  Lines: Line[];
  actualPaletVerified?: string | null;
  Order: {
    OrderRef: string;
  };
};

export type InContainer = {
  Label: string;
  Name: string;
  NR: string;
  No: string;
  WorkInId: string;
  Type: string;
  WorkId: string;
  WLineId: string;
};

export type MachineBody = {
  Machine: Machine;
  NrAlert: boolean;
  ClientMaterial: 'Y' | 'N';
  WithWorksIn: boolean;
  Finished: boolean;
  InContainers: Array<InContainer>;
};
