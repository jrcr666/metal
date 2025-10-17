import { useState } from 'react';
import { useMainFramework } from '../../hooks/useMainFramework';
import { useUser } from '../../store/userStore';

interface SaveLineParams {
  machineId: string;
  orderId: string | number;
  lineId: string | number;
  quantity: string | number;
  extra: string | number;
  dimension: string | number;
  materialId: string | number;
}

export const useRodCut = () => {
  const { user } = useUser();
  const { showLoading, hideLoading, lockModal, hideModal } = useMainFramework();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = `${user.Protocol}${user.Host}`;

  const assignNR = async (machineId: string, consignmentId: string) => {
    const dataString = `MachineId=${machineId}&ConsignmentId=${consignmentId}`;
    try {
      setLoading(true);
      showLoading();
      const res = await fetch(`${baseUrl}/BindMachineConsignment/${machineId}/${consignmentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.json();
      hideLoading();
      lockModal.current = false;

      return data;
    } catch (err) {
      hideLoading();
      setError('Error al asignar NR');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const assignOutput = async (machineId: string, materialId: string) => {
    const dataString = `MachineId=${machineId}&MaterialId=${materialId}`;
    try {
      setLoading(true);
      showLoading();
      await fetch(`${baseUrl}/BindMachineOutput/${machineId}/${materialId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      // intentionally left minimal as en el original estaba comentado
    } catch (err) {
      console.error('Error al asignar salida:', err);
      setError('Error al asignar salida');
    } finally {
      hideLoading();
      setLoading(false);
    }
  };

  const newBanquette = async (machineId: string, banquetteRef: string) => {
    const dataString = `MachineId=${machineId}&BanquetteRef=${banquetteRef}`;
    try {
      setLoading(true);
      showLoading();
      const res = await fetch(`${baseUrl}/BindMachineBanquette/${machineId}/${banquetteRef}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.json();
      hideLoading();

      return data;
    } catch (err) {
      hideLoading();
      setError('Error al crear banqueta');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveLine = async ({
    machineId,
    orderId,
    lineId,
    quantity,
    extra,
    dimension,
    materialId,
  }: SaveLineParams) => {
    const dataString =
      `MachineId=${machineId}` +
      `&OrderId=${orderId}` +
      `&LineId=${lineId}` +
      `&Quantity=${quantity}` +
      `&Extra=${extra}` +
      `&Dimension=${dimension}` +
      `&MaterialId=${materialId}`;

    try {
      setLoading(true);
      showLoading();
      const res = await fetch(`${baseUrl}/app/AppSaveLine/${machineId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.json();
      hideLoading();
      lockModal.current = false;
      return data;
    } catch (err) {
      hideLoading();
      setError('Error al guardar línea');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resumeMachine = async (machineId: string) => {
    const dataString = `MachineId=${machineId}`;
    try {
      showLoading();
      const res = await fetch(`${baseUrl}/app/ResumeMachine/${machineId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.json();
      hideLoading();
      // updateMachineZone(machineId, data);
      lockModal.current = false;
      hideModal();

      return data;
    } catch (err) {
      hideLoading();
      console.error('Error al reanudar máquina:', err);
    }
  };

  const pauseMachine = async (machineId: string) => {
    const dataString = `MachineId=${machineId}`;
    try {
      showLoading();
      const res = await fetch(`${baseUrl}/app/PauseMachine/${machineId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.json();

      hideLoading();
      //updateMachineZone(machineId, data);
      lockModal.current = false;
      hideModal();

      return data;
    } catch (err) {
      hideLoading();
      console.error('Error al pausar máquina:', err);
    }
  };

  const closeLinePrint = async (machineId: string, quantity: string, weight: string) => {
    const form = document.getElementById('CloseForm') as HTMLFormElement | null;
    if (!form) return;

    const dataString = `MachineId=${machineId}&Quantity=${quantity}&Weight=${weight}`;

    console.log(dataString);

    try {
      lockModal.current = false;
      showLoading();
      const res = await fetch(`${baseUrl}/app/LinePrint/${machineId}/N`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.json();
      hideLoading();

      if (data.ItsOk === 'Y') {
        // document.getElementById('BanquetteBtnClose')?.removeAttribute('hidden');
        //document.getElementById('PalletBtnClose')?.removeAttribute('hidden'); // NO EN Rod CUT

        return data.Machine;
      }
    } catch (err) {
      hideLoading();
      console.error('Error al imprimir línea:', err);
    }
  };

  const closeLineClose = () => {
    lockModal.current = false;
  };

  const closeBanquettePrint = async (machineId: string, quantity: string, weight: string) => {
    const dataString = `MachineId=${machineId}&Quantity=${quantity}&Weight=${weight}`;

    try {
      lockModal.current = true;
      showLoading();
      const res = await fetch(`${baseUrl}/app/RodCut/Banquette/Print/${machineId}/Y`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.json();

      if (data.ItsOk === 'Y') {
        hideLoading();

        return data.Machine;
      }
    } catch (err) {
      hideLoading();
      console.error('Error al imprimir banqueta:', err);
    }
  };

  const closeBanquetteClose = () => {
    lockModal.current = false;
    //hideModal();
  };

  return {
    loading,
    error,
    assignNR,
    assignOutput,
    newBanquette,
    saveLine,
    resumeMachine,
    pauseMachine,
    closeLinePrint,
    closeLineClose,
    closeBanquettePrint,
    closeBanquetteClose,
  };
};
