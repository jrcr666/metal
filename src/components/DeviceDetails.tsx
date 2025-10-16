import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMainFramework } from '../hooks/useMainFramework';
import { useAppContext } from '../store/appStore';
import { useUser } from '../store/userStore';
import { RodCut } from './machines/RodCut';

// 🔹 Tipos
type Line = {
  RodCutLineId: string;
  OLineId: string;
  Quantity: number;
  QuantityAux?: number;
  Left: number;
  Dimension: string;
  Material: { Name: string };
  MaterialId: string;
  Weight: number;
};

interface Machine {
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
}

interface MachineBody {
  Machine: Machine;
  NrAlert: boolean;
  ClientMaterial: 'Y' | 'N';
  Finished: boolean;
}

interface MachineData {
  Machine: Machine;
  NrAlert: boolean;
  ClientMaterial: 'Y' | 'N';
  Finished: boolean;
}

export interface Operator {
  OperatorId: string;
  Alias: string;
  Name: string;
  Surname: string;
  Active: boolean;
}

interface TitleData {
  Text: string;
  Operators: Operator[];
  AssignOperator: boolean;
  ActiveOperator?: string;
  StationId: string;
}

interface DeviceData {
  Main: { Body: MachineBody }[];
  Title: TitleData;
}

export const DeviceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { setUser, user } = useUser();
  const { showLoading, hideLoading, loadModal } = useMainFramework();
  const { setTitle } = useAppContext();

  const [machines, setMachines] = useState<MachineBody[]>([]);

  const openAdminAccess = () => {
    loadModal('GenericModal', '/app/AdminAccess');
  };

  useEffect(() => {
    if (!id || !user) return;

    const fetchDevice = async (): Promise<void> => {
      showLoading();
      try {
        const response = await fetch(`${user.Protocol}${user.Host}/app/Station/${id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data: DeviceData = await response.json();

        // Guardamos los MachineBody
        const machineBodies = data.Main.map(m => m.Body);
        setMachines(machineBodies);

        // Configuramos el título y operadores
        setTitle({
          text: data.Title.Text,
          onClick: openAdminAccess,
          operators: data.Title.Operators,
          assignOperator: data.Title.AssignOperator,
          activeOperator: data.Title.ActiveOperator ?? null,
          stationId: data.Title.StationId,
        });
      } catch (error) {
        console.error('Error fetching device details:', error);
      } finally {
        hideLoading();
      }
    };

    setUser({ ...user, DeviceId: id });
    fetchDevice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Convertimos MachineBody a MachineData para RodCut
  const rodCutMachines: MachineData[] = machines.map(m => ({
    Machine: m.Machine,
    NrAlert: m.NrAlert,
    ClientMaterial: m.ClientMaterial,
    Finished: m.Finished,
  }));

  const cmp = useMemo<React.ReactNode>(() => {
    if (machines.length === 0) return null;
    const typeId = machines[0]?.Machine?.TypeId;

    const components: Record<string, React.ReactElement> = {
      RodCut: <RodCut stationId={id ?? ''} machines={rodCutMachines} setMachines={setMachines} />,
    };

    return components[typeId ?? ''] ?? null;
  }, [machines, id, rodCutMachines, setMachines]);

  return <>{machines.length > 0 && cmp}</>;
};
