import React, { useState } from 'react';
import { useRodCut } from '../../hooks/screens/useRodCut';
import { Modal } from './Modal';
import type { Machine } from '../../types';

interface NewBanquetteModalProps {
  machineId: string;
  onClose?: () => void;
  changeMachine: (machineId: string, data: Machine) => void;
}

export const NewBanquetteModal: React.FC<NewBanquetteModalProps> = ({
  machineId,
  onClose,
  changeMachine,
}) => {
  const { newBanquette } = useRodCut();
  const [banquetteRef, setBanquetteRef] = useState('');

  const handleAssign = async () => {
    console.log(`NewBanquette_select('${machineId}')`);
    const data: Machine = await newBanquette(machineId, banquetteRef);
    changeMachine(machineId, data);
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
