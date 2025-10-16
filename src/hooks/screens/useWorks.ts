import { useUser } from '../../store/userStore';
import { useMainFramework } from '../useMainFramework';

export const useWorks = () => {
  const { user } = useUser();
  const { showLoading, hideLoading, lockModal, hideModal } = useMainFramework();

  const baseUrl = `${user.Protocol}${user.Host}`;

  const updateMachineZone = (machineId: string, html: string) => {
    const zone = document.getElementById(`MachineZone_${machineId}`);
    if (zone) zone.innerHTML = html;
  };

  const edSmartFilter = () => {
    const focused = document.activeElement as HTMLInputElement;
    if (focused?.classList.contains('SmartFilter')) {
      let temp = focused.value;
      temp = temp.replace(/\./g, '-').replace(/,/g, '_').replace(/ /g, '');
      focused.value = temp;
    }
  };

  const selectWork = async (machineId: string, workId: string) => {
    const dataString = `MachineId=${machineId}&WorkId=${workId}`;
    showLoading();
    try {
      const res = await fetch(`${baseUrl}/BindMachineWork/${machineId}/${workId}`, {
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
      console.error(err);
    }
  };

  const openAutoMaticWork = async (machineId: string, reference: string) => {
    if (!reference) {
      alert('Introducir el número de pedido');
      return;
    }
    const dataString = `MachineId=${machineId}&Reference=${reference}`;
    lockModal.current = false;
    showLoading();
    try {
      const res = await fetch(`${baseUrl}/app/OpenAutoMaticWork/${machineId}`, {
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
      console.error(err);
    }
  };

  const manualWorkSelect = async (machineId: string, reference: string) => {
    if (!reference) {
      alert('Introducir el número de pedido');
      return;
    }
    const dataString = `MachineId=${machineId}&Reference=${reference}`;
    lockModal.current = false;
    showLoading();
    try {
      const res = await fetch(`${baseUrl}/app/ManualWork/${machineId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });
      const data = await res.json();
      hideLoading();
      if (data.ItsOK === 'Y') {
        const modal = document.getElementById('ModalZone');
        if (modal) modal.innerHTML = data.Html;
      }
    } catch (err) {
      hideLoading();
      console.error(err);
    }
  };

  const manualWorkCreate = async (machineId: string, reference: string) => {
    const form = document.getElementById('ManualWorkForm') as HTMLFormElement | null;
    if (!form) return;

    let dataString = `MachineId=${machineId}&Reference=${reference}`;
    Array.from(form.elements).forEach(el => {
      const input = el as HTMLInputElement;
      if (input.name) dataString += `&${input.name}=${encodeURIComponent(input.value)}`;
    });

    showLoading();
    try {
      const res = await fetch(`${baseUrl}/app/ManualWorkCreate/${machineId}`, {
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
      console.error(err);
    }
  };

  const selectWIPallet = async (
    machineId: string,
    inNumber: string,
    workInId: string,
    typeId: string,
    id: string,
    ref: string,
    nrChange = false
  ) => {
    if (nrChange) alert('Verificar cambio de NR');

    if (typeId === 'MA') {
      id = (document.getElementById('ManualPallet') as HTMLInputElement)?.value || '';
      ref = id;
      if (!id) {
        typeId = '_';
        id = '_';
        ref = '_';
        workInId = '_';
      }
    }

    const dataString = `MachineId=${machineId}&WorkInId=${workInId}&InNumber=${inNumber}&TypeId=${typeId}&Id=${id}&Ref=${ref}`;
    showLoading();
    try {
      const res = await fetch(`${baseUrl}/BindWIPallet/${machineId}/${inNumber}`, {
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
      console.error(err);
    }
  };

  const selectWIPalletVerifyNr = async (
    machineId: string,
    inNumber: string,
    workInId: string,
    typeId: string,
    id: string,
    ref: string
  ) => {
    const dataString = `MachineId=${machineId}&WorkInId=${workInId}&InNumber=${inNumber}&TypeId=${typeId}&Id=${id}&Ref=${ref}`;
    showLoading();
    try {
      const res = await fetch(`${baseUrl}/BindWIPallet/${machineId}/${inNumber}`, {
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
      console.error(err);
    }
  };

  return {
    edSmartFilter,
    selectWork,
    openAutoMaticWork,
    manualWorkSelect,
    manualWorkCreate,
    selectWIPallet,
    selectWIPalletVerifyNr,
  };
};
