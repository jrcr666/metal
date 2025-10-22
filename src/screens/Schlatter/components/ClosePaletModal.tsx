import type { Machine } from '@app-types/machine.types';
import { Modal } from '@components/modals/Modal';
import { useSchlatter } from '@hooks/screens/useSchlatter';
import { useMachinesStore } from '@store/machinesStore';
import React, { useState } from 'react';

interface ClosePaletProps {
  machine: Machine;
  onClose?: VoidFunction;
}

const ClosePaletModal: React.FC<ClosePaletProps> = ({ machine, onClose }) => {
  const { updateMachine } = useMachinesStore();
  const { closePaletPrint } = useSchlatter();
  const [quantity, setQuantity] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);
  const [canClose, setCanClose] = useState(false);

  const handlePrint = async () => {
    setIsPrinting(true);

    const data = await closePaletPrint(machine.MachineId, quantity);
    updateMachine(machine.MachineId, data);

    setIsPrinting(false);
    setCanClose(true);
  };

  return (
    <Modal onClose={onClose} width={640} height={330} padding={0}>
      <div className="SP_MachineName">Cerrar Palet</div>

      <form id="CloseForm" onSubmit={e => e.preventDefault()}>
        <input
          className="form-control VA_Quantity"
          id="PLL_Quantity"
          name="Quantity"
          type="number"
          placeholder="Introduce Numero de mallas"
          value={quantity}
          disabled={isPrinting || canClose}
          onChange={e => setQuantity(e.target.value)}
        />
      </form>

      <button
        type="button"
        className="btn btn-primary VA_PalletBtn"
        id="PrintPaletBtnClose"
        onClick={handlePrint}
        disabled={isPrinting}
      >
        {isPrinting ? 'Imprimiendo...' : 'Imprimir Etiqueta'}
      </button>

      {canClose && (
        <button
          type="button"
          className="btn btn-primary VA_PalletBtn"
          id="ClosePaletBtnClose"
          onClick={onClose}
        >
          Cerrar Palet
        </button>
      )}
    </Modal>
  );
};

export { ClosePaletModal };
