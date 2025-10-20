//RODCUT
import { useServerManager } from '@hooks/screens/useServerManager';
import { useMachinesStore } from '@store/machinesStore';
import React from 'react';
import { Modal } from './Modal';

interface PackageModalType {
  MachineId: string;
  RCPackageId: string;
  Order: { OrderRef: string };
  Quantity: number;
  Material: { Name: string };
  Weight: number;
  BanquetteRef: string;
  Time: string;
}

interface PackageModalProps {
  pkg: PackageModalType;
  onClose?: VoidFunction;
}

export const PackageModal: React.FC<PackageModalProps> = ({ pkg, onClose }) => {
  const { updateMachine } = useMachinesStore();

  const { editPackagePrint, editPackageDelete } = useServerManager();

  const handleDelete = async () => {
    const data = await editPackageDelete(pkg.MachineId, pkg.RCPackageId);
    updateMachine(pkg.MachineId, data);
    onClose?.();
  };

  const handlePrint = async () => {
    const data = await editPackagePrint(pkg.MachineId, pkg.RCPackageId);
    updateMachine(pkg.MachineId, data);
    onClose?.();
  };

  return (
    <Modal width={600} onClose={() => onClose?.()}>
      <div className="SP_MachineName">
        Paquete {pkg.Order.OrderRef} {pkg.Time}
      </div>

      <form id="CloseForm"></form>

      <div style={{ float: 'left', width: '50%', fontSize: '25px' }}>{pkg.Quantity}</div>
      <div style={{ float: 'left', width: '50%', fontSize: '25px' }}>{pkg.Material.Name}</div>
      <div style={{ float: 'left', width: '50%', fontSize: '25px' }}>{pkg.Weight} Kg</div>
      <div style={{ float: 'left', width: '50%', fontSize: '25px' }}>{pkg.BanquetteRef}</div>

      <div style={{ clear: 'both', marginTop: '1rem' }}>
        <button type="button" className="btn btn-primary CB_BanquetteBtn" onClick={handlePrint}>
          Imprimir Etiqueta
        </button>

        <button
          type="button"
          className="btn btn-primary CB_BanquetteBtn"
          id="BanquetteBtnClose"
          onClick={handleDelete}
          style={{ marginLeft: '1rem' }}
        >
          Eliminar Paquete
        </button>
      </div>
    </Modal>
  );
};
