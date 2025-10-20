import { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { useMainFramework } from '../useMainFramework';

export const usePallets = () => {
  const { user } = useUserStore();
  const { showLoading, hideLoading, lockModal } = useMainFramework();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = `${user.Protocol}${user.Host}`;

  const selectPallet = async (
    machineId: string,
    inContainerId: string,
    typeId: string,
    palletId: string
  ) => {
    const dataString = `MachineId=${machineId}&InContainerId=${inContainerId}&TypeId=${typeId}&PalletId=${palletId}`;

    try {
      setLoading(true);
      setError(null);
      showLoading();

      const response = await fetch(`${baseUrl}/BindMachinePallet/${machineId}/${palletId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });

      const data = await response.text(); // HTML response
      hideLoading();
      setLoading(false);

      const zone = document.getElementById(`MachineZone_${machineId}`);
      if (zone) zone.innerHTML = data;

      lockModal.current = false;
      hideLoading();
    } catch (err) {
      console.error('Error en selectPallet:', err);
      setError('Error al seleccionar palet');
      hideLoading();
      setLoading(false);
    }
  };

  const manualPalletSelect = async (machineId: string, inContainerId: string, typeId: string) => {
    const reference = (document.getElementById('ManualPallet') as HTMLInputElement)?.value;
    if (!reference || reference.trim() === '') {
      alert('Introducir la referencia del palet');
      return;
    }
    await selectPallet(machineId, inContainerId, typeId, reference);
  };

  const manualPalletCreate = async (machineId: string, reference: string) => {
    const form = document.getElementById('ManualPalletForm') as HTMLFormElement;
    let dataString = `MachineId=${machineId}&Reference=${reference}`;

    if (form) {
      const inputs = Array.from(form.elements) as HTMLInputElement[];
      for (const input of inputs) {
        if (input.name) {
          dataString += `&${encodeURIComponent(input.name)}=${encodeURIComponent(input.value)}`;
        }
      }
    }

    try {
      setLoading(true);
      setError(null);
      showLoading();

      const response = await fetch(`${baseUrl}/app/ManualPalletCreate/${machineId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });

      const data = await response.text();
      hideLoading();
      setLoading(false);

      const zone = document.getElementById(`MachineZone_${machineId}`);
      if (zone) zone.innerHTML = data;

      lockModal.current = false;
      hideLoading();
    } catch (err) {
      console.error('Error en manualPalletCreate:', err);
      setError('Error al crear palet manual');
      hideLoading();
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    selectPallet,
    manualPalletSelect,
    manualPalletCreate,
  };
};
