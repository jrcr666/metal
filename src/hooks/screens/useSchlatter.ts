import { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { useMainFramework } from '../useMainFramework';

export const useSchlatter = () => {
  const { user } = useUserStore();
  const { showLoading, hideLoading, lockModal, hideModal } = useMainFramework();
  const [error, setError] = useState<string | null>(null);

  const baseUrl = `${user.Protocol}${user.Host}`;

  const updateMachineZone = (machineId: string, html: string) => {
    const zone = document.getElementById(`MachineZone_${machineId}`);
    if (zone) zone.innerHTML = html;
  };

  const newPaletPrint = async (machineId: string) => {
    const dataString = `MachineId=${machineId}`;
    try {
      lockModal.current = false;
      showLoading();
      const res = await fetch(`${baseUrl}/app/NewPalet/Print/${machineId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.json();
      hideLoading();
      if (data.ItsOk === 'Y') {
        document.getElementById('NewPaletBtnClose')?.removeAttribute('hidden');
        updateMachineZone(machineId, data.Html);
      }
    } catch (err) {
      hideLoading();
      setError('Error al imprimir nuevo palet');
      console.error(err);
    }
  };

  const newPaletNoPrint = async (machineId: string) => {
    const dataString = `MachineId=${machineId}`;
    try {
      lockModal.current = false;
      showLoading();
      const res = await fetch(`${baseUrl}/app/NewPalet/NoPrint/${machineId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.json();
      hideLoading();
      if (data.ItsOk === 'Y') {
        return data.Machine;
      }
    } catch (err) {
      hideLoading();
      setError('Error al crear nuevo palet sin imprimir');
      console.error(err);
    }
  };

  const newPaletClose = () => {
    lockModal.current = false;
    hideModal();
  };

  const closePaletPrint = async (machineId: string, quantity: string) => {
    const dataString = `MachineId=${machineId}&Quantity=${quantity}`;

    try {
      lockModal.current = false;
      showLoading();
      const res = await fetch(`${baseUrl}/app/ClosePalet/Print/${machineId}/Y`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.json();
      hideLoading();

      if (data.ItsOk === 'Y') return data;
    } catch (err) {
      hideLoading();
      setError('Error al cerrar e imprimir palet');
      console.error(err);
    }
  };

  const closeLineClose = () => {
    lockModal.current = false;
    hideModal();
  };

  // 🔍 Verificar palet
  const verifyPalet = async (machineId: string, outContainer: string) => {
    try {
      showLoading();
      const res = await fetch(`${baseUrl}/app/VerifyPalet/${machineId}/${outContainer}`, {
        method: 'GET',
      });
      const data = await res.json();
      hideLoading();

      return data;
    } catch (err) {
      hideLoading();
      setError('Error al verificar palet');
      console.error(err);
    }
  };

  return {
    error,
    newPaletPrint,
    newPaletNoPrint,
    newPaletClose,
    closePaletPrint,
    closeLineClose,
    verifyPalet,
  };
};
