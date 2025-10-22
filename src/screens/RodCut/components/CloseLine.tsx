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
  const [weight, setWeight] = useState('');
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [disableInputs, setDisableInputs] = useState(false);

  const handlePrint = async () => {
    const data = await closeLinePrint(machineId, { Quantity: quantity, Weight: weight });

    updateMachine(machineId, data);

    setShowCloseButton(true);
    setDisableInputs(true);
  };

  const handleCloseLine = () => {
    closeLineClose();
    onClose?.();
  };

  return (
    <Modal height={330} width={640} onClose={onClose} padding={20}>
      {/* Título */}
      <div className="SP_MachineName" style={{ marginBottom: 15 }}>
        Cerrar Línea
      </div>

      {/* Formulario */}
      <form
        id="CloseForm"
        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        <input
          className="form-control CB_Quantity"
          id="CB_Quantity"
          name="Quantity"
          type="text"
          placeholder="Introduce Numero de Varillas"
          value={quantity}
          disabled={disableInputs}
          onChange={e => setQuantity(e.target.value)}
        />

        <input
          className="form-control CB_Weight"
          id="CB_Weight"
          name="Weight"
          type="text"
          placeholder="Introduce Peso"
          value={weight}
          disabled={disableInputs}
          onChange={e => setWeight(e.target.value)}
        />
      </form>

      {/* Botones */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
        <button type="button" className="btn btn-primary CB_BanquetteBtn" onClick={handlePrint}>
          Imprimir Etiqueta
        </button>

        {showCloseButton && (
          <button
            type="button"
            className="btn btn-primary CB_BanquetteBtn"
            id="BanquetteBtnClose"
            onClick={handleCloseLine}
          >
            Cerrar Línea
          </button>
        )}
      </div>
    </Modal>
  );
};
