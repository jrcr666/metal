import { useState } from 'react';
import { useMainFramework } from '../../hooks/useMainFramework';
import { useUser } from '../../store/userStore';

export const useRodCut = () => {
  const { user } = useUser();
  const { showLoading, hideLoading, lockModal, hideModal } = useMainFramework();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = `${user.Protocol}${user.Host}`;

  const updateMachineZone = (machineId: string, html: string) => {
    const zone = document.getElementById(`MachineZone_${machineId}`);
    if (zone) zone.innerHTML = html;
  };

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
      const data = await res.text();
      hideLoading();
      updateMachineZone(machineId, data);
      lockModal.current = false;
      hideModal();
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

  const newBanquette = async (machineId: string) => {
    const banquetteRef = (document.getElementById('BanquetteRef') as HTMLInputElement)?.value || '';
    const dataString = `MachineId=${machineId}&BanquetteRef=${banquetteRef}`;
    try {
      setLoading(true);
      showLoading();
      const res = await fetch(`${baseUrl}/BindMachineBanquette/${machineId}/${banquetteRef}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.text();
      hideLoading();
      updateMachineZone(machineId, data);
      lockModal.current = false;
      hideModal();
    } catch (err) {
      hideLoading();
      setError('Error al crear banqueta');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveLine = async (machineId: string) => {
    const getVal = (id: string) => (document.getElementById(id) as HTMLInputElement)?.value || '';
    const dataString =
      `MachineId=${machineId}` +
      `&OrderId=${getVal('CB_OrderId')}` +
      `&LineId=${getVal('CB_LineId')}` +
      `&Quantity=${getVal('CB_Quantity')}` +
      `&Extra=${getVal('CB_Extra')}` +
      `&Dimension=${getVal('CB_Dimension')}` +
      `&MaterialId=${getVal('CB_MaterialId')}`;

    try {
      setLoading(true);
      showLoading();
      const res = await fetch(`${baseUrl}/app/AppSaveLine/${machineId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.text();
      hideLoading();
      updateMachineZone(machineId, data);
      lockModal.current = false;
      hideModal();
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

  const closeBanquettePrint = async (machineId: string) => {
    const quantity = (document.getElementById('CB_Quantity') as HTMLInputElement)?.value || '';
    const weight = (document.getElementById('CB_Weight') as HTMLInputElement)?.value || '';
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
      hideLoading();

      if (data.ItsOk === 'Y') {
        const q = document.getElementById('CB_Quantity') as HTMLInputElement;
        const w = document.getElementById('CB_Weight') as HTMLInputElement;
        if (q) q.readOnly = true;
        if (w) w.readOnly = true;
        document.getElementById('BanquetteBtnClose')?.removeAttribute('hidden');
        updateMachineZone(machineId, data.Html);
      }
    } catch (err) {
      hideLoading();
      console.error('Error al imprimir banqueta:', err);
    }
  };

  // ❌ Cerrar banqueta sin imprimir
  const closeBanquetteClose = () => {
    lockModal.current = false;
    hideModal();
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
