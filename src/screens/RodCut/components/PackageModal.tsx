import { Modal } from '@components/modals/Modal';
import { useServerManager } from '@hooks/screens/useServerManager';
import { useMachinesStore } from '@store/machinesStore';
import React from 'react';

/* Tipos base */
interface BasePackage {
  MachineId: string;
  Order: { OrderRef: string };
  Quantity: number;
  Time: string;
}

interface RodCutPackage extends BasePackage {
  RCPackageId: string;
  Material: { Name: string };
  Weight: number;
  BanquetteRef: string;
}

interface SchlatterPackage extends BasePackage {
  SCPackageId: string;
  ModelId: string;
}

/* Props del modal */
interface PackageModalProps {
  type: string;
  pkg: RodCutPackage | SchlatterPackage;
  onClose?: VoidFunction;
}

export const PackageModal = ({ type, pkg, onClose }: PackageModalProps) => {
  const { updateMachine } = useMachinesStore();
  const { editPackagePrint, editPackageDelete } = useServerManager();

  // Discriminación de tipo
  let packageId: string;
  let renderDetails: React.ReactNode;

  if (type === 'RodCut' && 'RCPackageId' in pkg) {
    const rodPkg = pkg as RodCutPackage;
    packageId = rodPkg.RCPackageId;
    renderDetails = (
      <>
        <div style={{ float: 'left', width: '50%', fontSize: '25px' }}>{rodPkg.Quantity}</div>
        <div style={{ float: 'left', width: '50%', fontSize: '25px' }}>{rodPkg.Material.Name}</div>
        <div style={{ float: 'left', width: '50%', fontSize: '25px' }}>{rodPkg.Weight} Kg</div>
        <div style={{ float: 'left', width: '50%', fontSize: '25px' }}>{rodPkg.BanquetteRef}</div>
      </>
    );
  } else if (type === 'Schlatter' && 'SCPackageId' in pkg) {
    const schlPkg = pkg as SchlatterPackage;
    packageId = schlPkg.SCPackageId;
    renderDetails = (
      <>
        <div style={{ float: 'left', width: '50%', fontSize: '25px' }}>{schlPkg.Quantity}</div>
        <div style={{ float: 'left', width: '50%', fontSize: '25px' }}>{schlPkg.ModelId}</div>
      </>
    );
  } else {
    // Tipo no soportado
    return null;
  }

  const handlePrint = async () => {
    const data = await editPackagePrint(pkg.MachineId, packageId);
    updateMachine(pkg.MachineId, data);
    onClose?.();
  };

  const handleDelete = async () => {
    const data = await editPackageDelete(pkg.MachineId, packageId);
    updateMachine(pkg.MachineId, data);
    onClose?.();
  };

  return (
    <Modal width={600} padding={20} onClose={onClose}>
      <div className="SP_MachineName">
        Paquete {pkg.Order.OrderRef} {pkg.Time}
      </div>

      <form id="CloseForm"></form>

      {renderDetails}

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
