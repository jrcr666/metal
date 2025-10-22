import { useMainFramework } from '@hooks/useMainFramework';
import { useUserStore } from '@store/userStore';

export const useMachine = () => {
  const { user } = useUserStore();
  const { showLoading, hideLoading, lockModal, hideModal } = useMainFramework();

  const baseUrl = `${user.Protocol}${user.Host}`;

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
      lockModal.current = false;
      hideModal();

      return data;
    } catch (err) {
      hideLoading();
      console.error('Error al pausar máquina:', err);
    }
  };

  const closeLinePrint = async (machineId: string, data: Record<string, string>) => {
    let dataString = `MachineId=${machineId}`;

    Object.keys(data).forEach(key => {
      dataString += `&${key}=${data[key]}`;
    });

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

  return {
    resumeMachine,
    pauseMachine,
    closeLinePrint,
    closeLineClose,
  };
};
