import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../store/userStore';
import { useMainFramework } from '../../hooks/useMainFramework';
import { useRodCut } from '../../hooks/screens/useRodCut';
import type { Machine } from '../../types';
import { Modal } from './Modal';
import { useNR } from '../../hooks/screens/useNR';

// 🔹 Tipos
interface Consignment {
  ConsignmentId: string;
  NrId: string;
  DateIn: string;
  Material: { Name: string };
  Supplier: string;
  Stock: number;
}

interface AssignNRModalProps {
  machineId: string;
  onClose?: () => void;
  changeMachine: (machineId: string, data: Machine) => void;
}

export const AssignNRModal: React.FC<AssignNRModalProps> = ({
  machineId,
  onClose,
  changeMachine,
}) => {
  const { user } = useUser();
  const { showLoading, hideLoading } = useMainFramework();
  const { assignNR } = useRodCut();
  const { manualNRSelect } = useNR();

  const [machine, setMachine] = useState<Machine | null>(null);
  const [consignments, setConsignments] = useState<Consignment[]>([]);
  const [manualNR, setManualNR] = useState('');

  // 👉 Cargar datos de la modal (ficticio)
  const loadScreen = useCallback(async () => {
    try {
      showLoading();
      const dataString = `mobile.UserId=${user.UserId}&mobile.DeviceId=${user.DeviceId}`;
      const url = `${user.Protocol}${user.Host}/app/AssignNR/${machineId}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: dataString }),
      });

      const data = await response.json();

      if (data.ItsOK === 'Y') {
        setConsignments(data.Consignments);
        setMachine(data.Machine);
      }
    } catch (err) {
      console.error('Error cargando AssignNR modal:', err);
    } finally {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadScreen();
  }, [loadScreen]);

  if (!machine) return null;

  const handleSelectNR = async (consignmentId: string) => {
    const data = await assignNR(machine.MachineId, consignmentId);
    changeMachine(machine.MachineId, data);
    onClose?.();
  };

  const handleManualNR = async () => {
    const data = await manualNRSelect(machine.MachineId, manualNR || '_');
    changeMachine(machine.MachineId, data);
    onClose?.();
  };

  return (
    <Modal onClose={() => onClose?.()} width={600} height={400}>
      <div className="SP_MachineName">Asignar NR - {machine.Name}</div>

      <div
        id="GenericModalContainer"
        className="GenericModalContainer"
        style={{ height: 285, overflow: 'auto', width: '100%' }}
      >
        <div className="col-md-12">
          <table className="table">
            <thead className="thead-inverse">
              <tr className="text-center">
                <th className="col-md-2 text-center">NR</th>
                <th className="col-md-2 text-center">Fecha</th>
                <th className="col-md-3 text-center">Material</th>
                <th className="col-md-3 text-center">Proveedor</th>
                <th className="col-md-2 text-center">Stock</th>
              </tr>
            </thead>
            <tbody>
              {consignments.map(c => (
                <tr
                  key={c.ConsignmentId}
                  onClick={() => handleSelectNR(c.ConsignmentId)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ lineHeight: '34px' }}>{c.NrId}</td>
                  <td style={{ lineHeight: '34px' }}>{c.DateIn}</td>
                  <td style={{ lineHeight: '34px' }}>{c.Material?.Name}</td>
                  <td style={{ lineHeight: '34px' }}>{c.Supplier}</td>
                  <td style={{ lineHeight: '34px' }}>{c.Stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="SP_BottomBar"
        style={{
          marginTop: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          type="button"
          className="btn btn-primary"
          style={{ float: 'left', marginLeft: 10 }}
          onClick={() => handleSelectNR('_')}
        >
          Vaciar
        </button>

        <input
          className="form-control"
          style={{ display: 'inline-block', width: 300, height: 40 }}
          id="ManualNR"
          name="ManualNR"
          type="text"
          placeholder="Introduce número de registro"
          value={manualNR}
          onChange={e => setManualNR(e.target.value)}
        />

        <button
          type="button"
          className="btn btn-primary"
          style={{ float: 'right', marginRight: 10 }}
          onClick={handleManualNR}
        >
          Asignación Manual
        </button>
      </div>
    </Modal>
  );
};
