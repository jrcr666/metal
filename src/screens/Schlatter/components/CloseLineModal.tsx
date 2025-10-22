import { Modal } from '@components/modals/Modal';
import { useMachine } from '@hooks/useMachine';
import { useMachinesStore } from '@store/machinesStore';
import React, { useState } from 'react';

interface CloseLineModalProps {
  machineId: string;
  onClose?: () => void;
}

export const CloseLineModal: React.FC<CloseLineModalProps> = ({ machineId, onClose }) => {
  const { updateMachine } = useMachinesStore();
  const { closeLinePrint, closeLineClose } = useMachine();

  const [quantity, setQuantity] = useState('');
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [disableInputs, setDisableInputs] = useState(false);

  const handlePrint = async () => {
    const data = await closeLinePrint(machineId, { Quantity: quantity });

    updateMachine(machineId, data);

    setShowCloseButton(true);
    setDisableInputs(true);
  };

  const handleCloseLine = () => {
    closeLineClose();
    onClose?.();
  };

  return (
    <Modal height={330} width={640} padding={20} onClose={onClose}>
      <div className="SP_MachineName">Cerrar Línea</div>

      <form id="CloseForm" style={{ marginTop: 10 }}>
        <input
          className="form-control CB_Quantity"
          id="CB_Quantity"
          name="Quantity"
          type="text"
          placeholder="Introduce número de mallas"
          value={quantity}
          onChange={e => setQuantity(e.target.value.replace(/\D/g, ''))}
          style={{ height: 40 }}
          disabled={disableInputs}
        />
      </form>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button type="button" className="btn btn-primary CB_BanquetteBtn" onClick={handlePrint}>
          Imprimir Etiqueta
        </button>

        {showCloseButton && (
          <button
            type="button"
            className="btn btn-primary CB_BanquetteBtn"
            onClick={handleCloseLine}
          >
            Cerrar Línea
          </button>
        )}
      </div>
    </Modal>
  );
};
