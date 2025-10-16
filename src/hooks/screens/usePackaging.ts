import { useState } from 'react';
import { useUser } from '../../store/userStore';
import { useMainFramework } from '../useMainFramework';

export const usePackaging = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();
  const { showLoading, lockModal, hideLoading } = useMainFramework();
  const packagePrint = async (
    machineId: string,
    typeId: string,
    location: string,
    labelType: string
  ) => {
    const dataString = `MachineId=${machineId}&TypeId=${typeId}&Location=${location}&LabelType=${labelType}`;

    try {
      setLoading(true);
      setError(null);
      lockModal.current = false;
      showLoading();

      const response = await fetch(
        `${user.Protocol}${user.Host}/app/Packaging/Print/${machineId}/${typeId}/${location}/${labelType}`,
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
        const machineZone = document.getElementById(`MachineZone_${machineId}`);
        if (machineZone) machineZone.innerHTML = data.Html;
      }
    } catch (err) {
      console.error('Error en packagePrint:', err);
      setError('Error al imprimir paquete');
      hideLoading();
      setLoading(false);
    }
  };

  /**
   * 🔹 Cambia el tipo de fuente (SourceTypeId)
   * @param machineId ID de la máquina
   */
  const changeSourceType = async (machineId: string) => {
    const sourceTypeId = (document.getElementById('SourceTypeId') as HTMLInputElement)?.value;

    const dataString = `MachineId=${machineId}&SourceTypeId=${sourceTypeId}`;

    try {
      setLoading(true);
      setError(null);
      lockModal.current = false;
      showLoading();

      const response = await fetch(
        `${user.Protocol}${user.Host}/app/Packaging/ChangeSourceType/${machineId}/${sourceTypeId}`,
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
        const machineZone = document.getElementById(`MachineZone_${machineId}`);
        if (machineZone) machineZone.innerHTML = data.Html;
      }
    } catch (err) {
      console.error('Error en changeSourceType:', err);
      setError('Error al cambiar tipo de origen');
      hideLoading();
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    packagePrint,
    changeSourceType,
  };
};
