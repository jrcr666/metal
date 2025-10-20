import { useState } from 'react';
import { useMainFramework } from '../../hooks/useMainFramework';
import { useUserStore } from '../../store/userStore';

export const useReception = () => {
  const { user } = useUserStore();
  const { showLoading, hideLoading, lockModal } = useMainFramework();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = `${user.Protocol}${user.Host}`;

  const createNR = async (machineId: string) => {
    const nrId = (document.getElementById('NRId') as HTMLInputElement)?.value || '';
    const deliveryNoteRef =
      (document.getElementById('DeliveryNoteRef') as HTMLInputElement)?.value || '';
    const packages = (document.getElementById('Packages') as HTMLInputElement)?.value || '';

    const dataString = `MachineId=${machineId}&NRId=${nrId}&DeliveryNoteRef=${deliveryNoteRef}&Packages=${packages}`;

    try {
      setLoading(true);
      setError(null);
      lockModal.current = false;
      showLoading();

      const response = await fetch(`${baseUrl}/app/Reception/NewNRCreate/${machineId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });

      const data = await response.json();
      hideLoading();
      setLoading(false);

      if (data.ItsOk === 'Y') {
        const zone = document.getElementById(`MachineZone_${machineId}`);
        if (zone) zone.innerHTML = data.Html;
        lockModal.current = false;
        const modal = document.getElementById('ModalZone');
        if (modal) modal.style.display = 'none';
      }
    } catch (err) {
      console.error('Error en createNR:', err);
      setError('Error al crear NR');
      hideLoading();
      setLoading(false);
    }
  };

  const closeReception = async (machineId: string) => {
    const dataString = `MachineId=${machineId}`;

    try {
      setLoading(true);
      setError(null);
      lockModal.current = false;
      showLoading();

      const response = await fetch(`${baseUrl}/app/Reception/CloseReception/${machineId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });

      const data = await response.json();
      hideLoading();
      setLoading(false);

      if (data.ItsOk === 'Y') {
        const zone = document.getElementById(`MachineZone_${machineId}`);
        if (zone) zone.innerHTML = data.Html;
        lockModal.current = false;
        const modal = document.getElementById('ModalZone');
        if (modal) modal.style.display = 'none';
      }
    } catch (err) {
      console.error('Error en closeReception:', err);
      setError('Error al cerrar la recepción');
      hideLoading();
      setLoading(false);
    }
  };

  const setWeightReception = async (machineId: string, pieceId: string) => {
    const quantity = (document.getElementById('PLL_Weight') as HTMLInputElement)?.value || '';
    const dataString = `MachineId=${machineId}&Quantity=${quantity}`;

    try {
      setLoading(true);
      setError(null);
      lockModal.current = false;
      showLoading();

      const response = await fetch(`${baseUrl}/app/Reception/SaveWeight/${machineId}/${pieceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });

      const data = await response.json();
      hideLoading();
      setLoading(false);

      if (data.ItsOk === 'Y') {
        const zone = document.getElementById(`MachineZone_${machineId}`);
        if (zone) zone.innerHTML = data.Html;
        lockModal.current = false;
        const modal = document.getElementById('ModalZone');
        if (modal) modal.style.display = 'none';
      }
    } catch (err) {
      console.error('Error en setWeightReception:', err);
      setError('Error al guardar peso');
      hideLoading();
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createNR,
    closeReception,
    setWeightReception,
  };
};
