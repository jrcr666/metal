import { useUser } from '../../store/userStore';
import { useMainFramework } from '../useMainFramework';

export const useServerManager = () => {
  const { user } = useUser();
  const { showLoading, hideLoading, lockModal, hideModal } = useMainFramework();

  const baseUrl = `${user.Protocol}${user.Host}`;

  const updateMachineZone = (machineId: string, html: string) => {
    const zone = document.getElementById(`MachineZone_${machineId}`);
    if (zone) zone.innerHTML = html;
  };

  const changeServer = (address: string) => {
    user.Host = address;
    lockModal.current = false;
    hideModal();
    window.location.href = '/app/StationsList'; // reemplaza mainScreen.LoadMain
  };

  const getAdmin = async (adminPw: string) => {
    showLoading();
    try {
      const res = await fetch(`${baseUrl}/app/GetAdmin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `AdminPw=${encodeURIComponent(adminPw)}`,
      });
      const data = await res.json();
      hideLoading();

      lockModal.current = false;
      hideModal();

      if (data.ItsOK === 'Y') {
        window.location.href = '/app/StationsList';
      } else {
        window.location.href = `/app/Station/${user.DeviceId}`;
      }
    } catch (err) {
      hideLoading();
      console.error(err);
    }
  };

  const checkOperator = async (stationId: string, operatorId: string) => {
    const dataString = `StationId=${stationId}&idOperator=${operatorId}`;
    showLoading();
    try {
      const res = await fetch(`${baseUrl}/app/CheckOperator/${stationId}/${operatorId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.text();
      hideLoading();
      if (data) {
        const modal = document.getElementById('ModalZone');
        if (modal) modal.innerHTML = data;
      }
    } catch (err) {
      hideLoading();
      console.error(err);
    }
  };

  const checkPwOperator = async (stationId: string, operatorId: string, pw: string) => {
    const dataString = `StationId=${stationId}&OperatorId=${operatorId}&Pw=${pw}`;

    showLoading();
    try {
      await fetch(`${baseUrl}/app/CheckPWOperator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      hideLoading();
      lockModal.current = false;
      hideModal();
      window.location.reload();
    } catch (err) {
      hideLoading();
      console.error(err);
    }
  };

  const closeOperator = async (stationId: string, operatorId: string) => {
    if (!confirm('¿Esta seguro abandonar la estación?')) return;

    const dataString = `StationId=${stationId}&OperatorId=${operatorId}`;
    showLoading();
    try {
      await fetch(`${baseUrl}/app/CloseOperator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      hideLoading();
      lockModal.current = false;
      hideModal();
      window.location.href = `/app/Station/${user.DeviceId}`;
    } catch (err) {
      hideLoading();
      console.error(err);
    }
  };

  const editPackagePrint = async (machineId: string, packageId: string) => {
    const form = document.getElementById('CloseForm') as HTMLFormElement | null;
    if (!form) return;

    let dataString = `MachineId=${machineId}`;
    Array.from(form.elements).forEach(el => {
      const input = el as HTMLInputElement;
      if (input.name) dataString += `&${input.name}=${encodeURIComponent(input.value)}`;
    });

    showLoading();
    try {
      const res = await fetch(`${baseUrl}/app/EditPackage/Print/${machineId}/${packageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.json();
      hideLoading();

      if (data.ItsOk === 'Y') {
        Array.from(form.elements).forEach(el => {
          const input = el as HTMLInputElement;
          if (input.name) input.readOnly = true;
        });
        updateMachineZone(machineId, data.Html);
      }
      lockModal.current = false;
      hideModal();
    } catch (err) {
      hideLoading();
      console.error(err);
    }
  };

  const editPackageDelete = async (machineId: string, packageId: string) => {
    if (!confirm('¿Esta seguro de eliminar este paquete?')) return;

    const form = document.getElementById('CloseForm') as HTMLFormElement | null;
    if (!form) return;

    let dataString = `MachineId=${machineId}`;
    Array.from(form.elements).forEach(el => {
      const input = el as HTMLInputElement;
      if (input.name) dataString += `&${input.name}=${encodeURIComponent(input.value)}`;
    });

    showLoading();
    try {
      const res = await fetch(`${baseUrl}/app/EditPackage/Delete/${machineId}/${packageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.json();
      hideLoading();

      if (data.ItsOk === 'Y') {
        Array.from(form.elements).forEach(el => {
          const input = el as HTMLInputElement;
          if (input.name) input.readOnly = true;
        });
        updateMachineZone(machineId, data.Html);
      }
      lockModal.current = false;
      hideModal();
    } catch (err) {
      hideLoading();
      console.error(err);
    }
  };

  const reloadMachine = async (machineId: string) => {
    const dataString = `MachineId=${machineId}`;
    showLoading();
    try {
      const res = await fetch(`${baseUrl}/app/ReloadMachine/${machineId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.json();
      hideLoading();

      if (data.ItsOK === 'Y') updateMachineZone(machineId, data.Html);
    } catch (err) {
      hideLoading();
      console.error(err);
    }
  };

  const activeOperator = async (stationId: string, operatorId: string) => {
    const dataString = `StationId=${stationId}&OperatorId=${operatorId}`;
    showLoading();
    try {
      await fetch(`${baseUrl}/app/ActiveOperator/${stationId}/${operatorId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
    } catch (err) {
      console.error(err);
    }
    hideLoading();
  };

  return {
    changeServer,
    getAdmin,
    checkOperator,
    checkPwOperator,
    closeOperator,
    editPackagePrint,
    editPackageDelete,
    reloadMachine,
    activeOperator,
  };
};
