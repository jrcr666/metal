import { useState } from 'react';
import { useUser } from '../../store/userStore';
import { useMainFramework } from '../useMainFramework';

export const useSelectOrder = () => {
  const { user } = useUser();
  const { showLoading, hideLoading, lockModal, hideModal } = useMainFramework();
  const [error, setError] = useState<string | null>(null);

  const baseUrl = `${user.Protocol}${user.Host}`;

  const updateMachineZone = (machineId: string, html: string) => {
    const zone = document.getElementById(`MachineZone_${machineId}`);
    if (zone) zone.innerHTML = html;
  };

  const postData = async (url: string, dataString: string) => {
    showLoading();
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.json();
      hideLoading();
      return data;
    } catch (err) {
      hideLoading();
      setError('Error en la petición');
      console.error(err);
      return null;
    }
  };

  const selectOrder = async (machineId: string, orderId: string) => {
    const dataString = `MachineId=${machineId}&OrderId=${orderId}`;
    const data = await postData(`${baseUrl}/BindMachineOrder/${machineId}/${orderId}`, dataString);
    if (data) {
      updateMachineZone(machineId, data);
      lockModal.current = false;
      hideModal();
    }
  };

  const stockSelect = async (machineId: string, materialId: string) => {
    const orderId = `STOCK_${materialId}`;
    await selectOrder(machineId, orderId);
  };

  const selectOrderLine = async (machineId: string, lineId: string, oLineId: string) => {
    const dataString = `MachineId=${machineId}&LineId=${lineId}&OLineId=${oLineId}`;
    const data = await postData(
      `${baseUrl}/BindMachineLine/${machineId}/${lineId}/${oLineId}`,
      dataString
    );
    if (data) {
      lockModal.current = false;

      return data;
    }
  };

  const selectOrderLineSimple = async (machineId: string, lineId: string, oLineId: string) => {
    return selectOrderLine(machineId, lineId, oLineId);
  };

  const selectInContainer = async (
    machineId: string,
    containerNumber: string,
    containerId: string
  ) => {
    const dataString = `MachineId=${machineId}&ContainerNumber=${containerNumber}&ContainerId=${containerId}`;
    const data = await postData(
      `${baseUrl}/BindMachineInContainer/${machineId}/${containerNumber}/${containerId}`,
      dataString
    );
    if (data) {
      updateMachineZone(machineId, data);
      lockModal.current = false;
      hideModal();
    }
  };

  const freeContainer = async (machineId: string, containerNumber: string, containerId: string) => {
    const dataString = `MachineId=${machineId}&ContainerNumber=${containerNumber}&ContainerId=${containerId}`;
    const data = await postData(
      `${baseUrl}/FreeMachineInContainer/${machineId}/${containerNumber}/${containerId}`,
      dataString
    );
    if (data) {
      updateMachineZone(machineId, data);
      lockModal.current = false;
      hideModal();
    }
  };

  const forklifterChangeLocation = async (
    machineId: string,
    type: string,
    lineId: string,
    location: string
  ) => {
    const dataString = `MachineId=${machineId}&LineId=${lineId}&Location=${location}`;
    const data = await postData(
      `${baseUrl}/ChangeLocation/${machineId}/${type}/${lineId}`,
      dataString
    );
    if (data) {
      updateMachineZone(machineId, data);
      lockModal.current = false;
      hideModal();
    }
  };

  const workSaveLine = async (machineId: string) => {
    const form = document.getElementById('EditLineForm') as HTMLFormElement | null;
    if (!form) return;

    let dataString = `MachineId=${machineId}`;
    Array.from(form.elements).forEach(el => {
      const input = el as HTMLInputElement;
      if (input.name) dataString += `&${input.name}=${encodeURIComponent(input.value)}`;
    });

    const data = await postData(`${baseUrl}/app/AppSaveLine/${machineId}`, dataString);
    if (data) {
      updateMachineZone(machineId, data);
      lockModal.current = false;
      hideModal();
    }
  };

  return {
    error,
    selectOrder,
    stockSelect,
    selectOrderLine,
    selectOrderLineSimple,
    selectInContainer,
    freeContainer,
    forklifterChangeLocation,
    workSaveLine,
  };
};
