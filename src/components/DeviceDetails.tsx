import { useMachinesStore } from '@store/machinesStore';
import { useUserStore } from '@store/userStore';
import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useMainFramework } from '../hooks/useMainFramework';
import { RodCut } from '../screens/RodCut/RodCut';
import { useAppContext } from '../store/hooks/useAppStore';
import type { MachineBody } from '../types/machine.types';

export type Operator = {
  OperatorId: string;
  Alias: string;
  Name: string;
  Surname: string;
  Active: boolean;
};

type TitleData = {
  Text: string;
  Operators: Operator[];
  AssignOperator: boolean;
  ActiveOperator?: string;
  StationId: string;
};

type DeviceData = {
  Main: { Body: MachineBody }[];
  Title: TitleData;
};

export const DeviceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { setUser, user } = useUserStore();
  const { showLoading, hideLoading, loadModal } = useMainFramework();
  const { setTitle } = useAppContext();
  const { machines, setMachines } = useMachinesStore();

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
  const cmp = useMemo<React.ReactNode>(() => {
    if (machines.length === 0) return null;
    const typeId = machines[0]?.Machine?.TypeId;

    const components: Record<string, React.ReactElement> = {
      RodCut: <RodCut stationId={id ?? ''} />,
    };

    return components[typeId ?? ''] ?? null;
  }, [id, machines]);

  return <>{machines.length > 0 && cmp}</>;
};
