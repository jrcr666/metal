import { useRodCut } from '@hooks/screens/useRodCut';
import { useMachinesStore } from '@store/machinesStore';
import React, { useState } from 'react';
import { Modal } from './Modal';

interface NewBanquetteModalProps {
  machineId: string;
  onClose?: () => void;
}

export const NewBanquetteModal: React.FC<NewBanquetteModalProps> = ({ machineId, onClose }) => {
  const { updateMachine } = useMachinesStore();

  const { newBanquette } = useRodCut();
  const [banquetteRef, setBanquetteRef] = useState('');

  const handleAssign = async () => {
    const data = await newBanquette(machineId, banquetteRef);
    updateMachine(machineId, data);
    onClose?.();
  };

  return (
    <Modal onClose={() => onClose?.()}>
      <div className="SP_MachineName" style={{ marginBottom: 15 }}>
        Nueva Banqueta
      </div>

      <input
        className="form-control NB_BanquetteRef"
        id="BanquetteRef"
        name="BanquetteRef"
        type="text"
        placeholder="Introduce Número de Banqueta"
        value={banquetteRef}
        onChange={e => setBanquetteRef(e.target.value)}
        style={{ marginBottom: 15 }}
      />

      <button type="button" className="btn btn-primary NB_BanquetteBtn" onClick={handleAssign}>
        Asignar
      </button>
    </Modal>
  );
};
