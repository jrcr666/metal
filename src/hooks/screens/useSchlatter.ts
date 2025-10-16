import { useState } from 'react';
import { useUser } from '../../store/userStore';
import { useMainFramework } from '../useMainFramework';

export const useSchlatter = () => {
  const { user } = useUser();
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
        updateMachineZone(machineId, data.Html);
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

  const closePaletPrint = async (machineId: string) => {
    const form = document.getElementById('CloseForm') as HTMLFormElement | null;
    if (!form) return;

    let dataString = `MachineId=${machineId}`;
    Array.from(form.elements).forEach(el => {
      const input = el as HTMLInputElement;
      if (input.name) dataString += `&${input.name}=${encodeURIComponent(input.value)}`;
    });

    try {
      document.getElementById('PrintPaletBtnClose')?.setAttribute('hidden', 'true');
      lockModal.current = false;
      showLoading();
      const res = await fetch(`${baseUrl}/app/ClosePalet/Print/${machineId}/Y`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.json();
      hideLoading();

      if (data.ItsOk === 'Y') {
        updateMachineZone(machineId, data.Html);
        Array.from(form.elements).forEach(el => {
          const input = el as HTMLInputElement;
          if (input.id) input.readOnly = true;
        });
        document.getElementById('PrintPaletBtnClose')?.removeAttribute('hidden');
        document.getElementById('ClosePaletBtnClose')?.removeAttribute('hidden');
      }
    } catch (err) {
      hideLoading();
      setError('Error al cerrar e imprimir palet');
      console.error(err);
    } finally {
      // siempre mostrar el botón tras finalizar (como .always en jQuery)
      document.getElementById('PrintPaletBtnClose')?.removeAttribute('hidden');
    }
  };

  const closePaletClose = () => {
    lockModal.current = false;
    hideModal();
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
      const data = await res.text();
      hideLoading();
      updateMachineZone(machineId, data);
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
    closePaletClose,
    closeLineClose,
    verifyPalet,
  };
};
