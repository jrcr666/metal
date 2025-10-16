// react/pages/DeviceDetails/DeviceDetails.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMainFramework } from '../hooks/useMainFramework';
import { useAppContext } from '../store/appStore';
import { useUser } from '../store/userStore';
import { RodCut } from './machines/RodCut';

// 🔹 Tipos
interface Machine {
  MachineId: string;
  TypeId: string;
  Name: string;
  NrId: string;
  MaterialId: string;
  OutContainer1: string;
  StatusId: string;
  LineId: string;
  Lines: any[];
  Order?: { OrderRef: string };
}

interface MachineBody {
  Machine: Machine;
  NrAlert: boolean;
  ClientMaterial: 'Y' | 'N';
  Finished: boolean;
}

interface DeviceData {
  Main: { Body: MachineBody }[];
  Title: {
    Text: string;
    Operators: any;
    AssignOperator: any;
    ActiveOperator: any;
    StationId: string;
  };
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
    const fetchDevice = async () => {
      showLoading();
      try {
        const response = await fetch(`${user.Protocol}${user.Host}/app/Station/${id}`);
        const data: DeviceData = await response.json();

        const machineBodies = data.Main.map(m => m.Body);
        setMachines(machineBodies);

        setTitle({
          text: data.Title.Text,
          onClick: openAdminAccess,
          operators: data.Title.Operators,
          assignOperator: data.Title.AssignOperator,
          activeOperator: data.Title.ActiveOperator,
          stationId: data.Title.StationId,
        });
      } catch (error) {
        console.error('Error fetching device details:', error);
      } finally {
        hideLoading();
      }
    };

    if (id) {
      setUser({ ...user, DeviceId: id });
      fetchDevice();
    }
  }, []);

  const cmp = useMemo(() => {
    if (!machines || machines.length === 0) return null;
    const typeId = machines[0]?.Machine?.TypeId;

    const components: Record<string, React.ReactElement> = {
      RodCut: <RodCut stationId={id} machines={machines} setMachines={setMachines} />,
    };

    return components[typeId || ''] || null;
  }, [machines]);

  return <>{machines.length > 0 && cmp}</>;
};
