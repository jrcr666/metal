import { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { useMainFramework } from '../useMainFramework';

export const useNR = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserStore();
  const { showLoading, lockModal, hideLoading, hideModal } = useMainFramework();

  /** Utilidad para codificar formularios */
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

  /** 🔹 Seleccionar un NR (BindMachineNR) */
  const selectNR = async (machineId: string, nrId: string) => {
    const dataString = `MachineId=${machineId}&NRId=${nrId}`;
    try {
      setLoading(true);
      showLoading();

      const res = await fetch(`${user.Protocol}${user.Host}/BindMachineNR/${machineId}/${nrId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.json();

      hideLoading();
      setLoading(false);

      lockModal.current = false;
      return data.Machine;
    } catch (err) {
      console.error('Error en selectNR:', err);
      setError('Error al seleccionar NR');
      hideLoading();
      setLoading(false);
    }
  };

  /** 🔹 Selección manual de NR */
  const manualNRSelect = async (machineId: string, reference: string) => {
    if (!reference.trim()) {
      alert('Introducir el número de registro');
      return;
    }

    const dataString = `MachineId=${machineId}&Reference=${reference}`;
    try {
      setLoading(true);
      lockModal.current = false;
      showLoading();

      const res = await fetch(`${user.Protocol}${user.Host}/app/ManualNR/${machineId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.json();

      hideLoading();
      setLoading(false);

      if (data.ItsOK === 'Y') {
        return data.Machine;
      }
    } catch (err) {
      console.error('Error en manualNRSelect:', err);
      setError('Error al seleccionar NR manualmente');
      hideLoading();
      setLoading(false);
    }
  };

  /** 🔹 Crear un NR manualmente */
  const manualNRCreate = async (machineId: string, reference: string) => {
    try {
      const form = document.getElementById('ManualNRForm') as HTMLFormElement;
      if (!form) {
        console.error('No se encontró ManualNRForm');
        return;
      }

      const dataString = `MachineId=${machineId}&Reference=${reference}&${encodeFormData(form)}`;
      setLoading(true);
      showLoading();

      const res = await fetch(`${user.Protocol}${user.Host}/app/ManualNRCreate/${machineId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.text();

      hideLoading();
      setLoading(false);

      const machineZone = document.getElementById(`MachineZone_${machineId}`);
      if (machineZone) machineZone.innerHTML = data;

      lockModal.current = false;
      hideModal();
    } catch (err) {
      console.error('Error en manualNRCreate:', err);
      setError('Error al crear NR manual');
      hideLoading();
      setLoading(false);
    }
  };

  /** 🔹 Cerrar stock (CloseStock) */
  const stockClose = async (machineId: string, consignmentId: string) => {
    try {
      //const stock = (document.getElementById(`Stock_${machineId}`) as HTMLInputElement)?.value;
      const dataString = `MachineId=${machineId}&ConsignmentId=${consignmentId}`;

      setLoading(true);
      showLoading();

      const res = await fetch(`${user.Protocol}${user.Host}/app/CloseStock/${machineId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.text();

      hideLoading();
      setLoading(false);

      const machineZone = document.getElementById(`MachineZone_${machineId}`);
      if (machineZone) machineZone.innerHTML = data;
    } catch (err) {
      console.error('Error en stockClose:', err);
      setError('Error al cerrar stock');
      hideLoading();
      setLoading(false);
    }
  };

  /** 🔹 Modificar stock (SetStock) */
  const stockChange = async (machineId: string, consignmentId: string) => {
    try {
      const stock = (document.getElementById(`Stock_${machineId}`) as HTMLInputElement)?.value;
      const dataString = `MachineId=${machineId}&ConsignmentId=${consignmentId}&Stock=${stock}`;

      setLoading(true);
      showLoading();

      const res = await fetch(`${user.Protocol}${user.Host}/app/SetStock/${machineId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.text();

      hideLoading();
      setLoading(false);

      const machineZone = document.getElementById(`MachineZone_${machineId}`);
      if (machineZone) machineZone.innerHTML = data;
    } catch (err) {
      console.error('Error en stockChange:', err);
      setError('Error al cambiar stock');
      hideLoading();
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    selectNR,
    manualNRSelect,
    manualNRCreate,
    stockClose,
    stockChange,
  };
};
