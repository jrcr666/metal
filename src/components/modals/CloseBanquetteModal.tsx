import { useRodCut } from '@hooks/screens/useRodCut';
import { useMachinesStore } from '@store/machinesStore';
import React, { useState } from 'react';

interface CloseBanquetteModalProps {
  machineId: string;
  banquetteRef?: string;
  onClose?: () => void;
}

export const CloseBanquetteModal: React.FC<CloseBanquetteModalProps> = ({ machineId, onClose }) => {
  const { updateMachine } = useMachinesStore();

  const { closeBanquettePrint, closeBanquetteClose } = useRodCut();
  const [quantity, setQuantity] = useState('');
  const [weight, setWeight] = useState('');
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [disableInputs, setDisableInputs] = useState(false);

  const handlePrint = async () => {
    console.log(`CloseBanquette_Print('${machineId}')`);
    const data = await closeBanquettePrint(machineId, quantity, weight);

    updateMachine(machineId, data);
    setShowCloseButton(true);
    setDisableInputs(true);
  };

  const handleCloseBanquette = async () => {
    console.log(`CloseBanquette_Close('${machineId}')`);
    await closeBanquetteClose();
    onClose?.();
  };

  return (
    <div
      id="ModalBack"
      onClick={() => onClose?.()}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: 10,
        zIndex: 1000,
      }}
    >
      <div
        id="ModalZone"
        onClick={e => e.stopPropagation()}
        style={{
          top: 1,
          marginTop: 0,
          height: 'auto',
          width: 500,
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 20,
        }}
      >
        {/* 🔹 Título */}
        <div className="SP_MachineName" style={{ marginBottom: 15 }}>
          Cerrar Banqueta
        </div>

        {/* 🔹 Formulario */}
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

        {/* 🔹 Botones */}
        <button
          type="button"
          className="btn btn-primary CB_BanquetteBtn"
          style={{ marginTop: 15 }}
          onClick={handlePrint}
          disabled={disableInputs}
        >
          Imprimir Etiqueta
        </button>

        {showCloseButton && (
          <button
            type="button"
            className="btn btn-primary CB_BanquetteBtn"
            id="BanquetteBtnClose"
            style={{ marginTop: 10 }}
            onClick={handleCloseBanquette}
          >
            Cerrar Banqueta
          </button>
        )}
      </div>
    </div>
  );
};
