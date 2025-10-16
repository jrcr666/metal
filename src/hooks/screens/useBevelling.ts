import { useState } from 'react';
import { useUser } from '../../store/userStore';
import { useMainFramework } from '../useMainFramework';

export const useBevelling = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const { showLoading, lockModal, hideLoading } = useMainFramework();

  const encodeFormData = (form: HTMLFormElement) => {
    const params = new URLSearchParams();
    Array.from(form.elements).forEach(el => {
      const input = el as HTMLInputElement;
      if (input.name) {
        params.append(input.name, encodeURIComponent(input.value));
      }
    });
    return params.toString();
  };

  const closeLineAndPrint = async (machineId: string, max: number) => {
    try {
      const quantity = Number(
        (document.getElementById('CB_Quantity') as HTMLInputElement)?.value || 0
      );
      if (quantity > max) {
        alert(`El máximo de varillas es: ${max}`);
        return;
      }

      const form = document.getElementById('CloseForm') as HTMLFormElement;
      if (!form) {
        console.error('No se encontró el formulario #CloseForm');
        return;
      }

      const dataString = `MachineId=${machineId}&${encodeFormData(form)}`;
      setLoading(true);
      lockModal.current = false;
      showLoading();

      const response = await fetch(`${user.Protocol}${user.Host}/app/LinePrint/${machineId}/N`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });

      const data = await response.json();
      hideLoading();
      setLoading(false);

      if (data.ItsOk === 'Y') {
        Array.from(form.elements).forEach(el => {
          const input = el as HTMLInputElement;
          if (input.id) input.readOnly = true;
        });

        document.getElementById('BanquetteBtnClose')?.setAttribute('style', 'display:block');
        document.getElementById('PalletBtnClose')?.setAttribute('style', 'display:block');

        const machineZone = document.getElementById(`MachineZone_${machineId}`);
        if (machineZone) machineZone.innerHTML = data.Html;
      }
    } catch (err) {
      console.error('Error al cerrar línea e imprimir:', err);
      setError('Error al procesar la solicitud');
      hideLoading();
      setLoading(false);
    }
  };

  const closeBanquetteAndPrint = async (machineId: string, max: number) => {
    try {
      const quantity = Number(
        (document.getElementById('CB_Quantity') as HTMLInputElement)?.value || 0
      );
      if (quantity > max) {
        alert(`El máximo de varillas es: ${max}`);
        return;
      }

      const dataString = `MachineId=${machineId}&Quantity=${quantity}`;
      setLoading(true);
      lockModal.current = true;
      showLoading();

      const response = await fetch(
        `${user.Protocol}${user.Host}/app/Bevelling/Banquette/Print/${machineId}/Y`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: dataString,
        }
      );

      const data = await response.json();
      hideLoading();
      setLoading(false);

      if (data.ItsOk === 'Y') {
        (document.getElementById('CB_Quantity') as HTMLInputElement).readOnly = true;
        (document.getElementById('CB_Weight') as HTMLInputElement).readOnly = true;

        document.getElementById('BanquetteBtnClose')?.setAttribute('style', 'display:block');
        const machineZone = document.getElementById(`MachineZone_${machineId}`);
        if (machineZone) machineZone.innerHTML = data.Html;
      }
    } catch (err) {
      console.error('Error al cerrar banqueta e imprimir:', err);
      setError('Error al procesar la solicitud');
      hideLoading();
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    closeLineAndPrint,
    closeBanquetteAndPrint,
  };
};
