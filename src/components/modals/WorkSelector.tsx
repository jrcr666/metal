import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../store/userStore';
import { useMainFramework } from '../../hooks/useMainFramework';
import { useWorks } from '../../hooks/screens/useWorks';
import type { Machine } from '../../types';
import { Modal } from './Modal';

// 🔹 Tipos
interface Work {
  WRodCutId: string;
  OrderRef: string;
  WorkDate: string;
  Comments: string;
  Status: string;
}

interface WorkModalProps {
  deviceId: string;
  onClose?: () => void;
  changeMachine: (machineId: string, data: Machine) => void;
}

export const WorkModal: React.FC<WorkModalProps> = ({ deviceId, onClose, changeMachine }) => {
  const { user } = useUser();
  const { showLoading, hideLoading } = useMainFramework();
  const { selectWork, manualWorkSelect } = useWorks();

  const [machine, setMachine] = useState<Machine | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [manualRef, setManualRef] = useState('');

  // 👉 Carga datos de la modal
  const loadScreen = useCallback(async () => {
    try {
      showLoading();
      const dataString = `mobile.UserId=${user.UserId}&mobile.DeviceId=${user.DeviceId}`;
      const url = `${user.Protocol}${user.Host}/app/SelectOrder/${deviceId}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: dataString }),
      });

      const data = await response.json();
      hideLoading();

      if (data.ItsOK === 'Y') {
        setMachine(data.Machine);
        setWorks(data.Works);
      }
    } catch (err) {
      console.error('Error cargando modal:', err);
      hideLoading();
    }
  }, [deviceId, user, showLoading, hideLoading]);

  useEffect(() => {
    loadScreen();
  }, [loadScreen]);

  if (!machine) return null;

  // 👉 Handlers
  const handleSelectWork = async (workId: string) => {
    //console.log(`SelectWork_select('${machine.MachineId}','${workId}')`);
    const data = await selectWork(machine.MachineId, workId);

    changeMachine(machine.MachineId, data);
    onClose?.();
  };

  const handleManualWork = async () => {
    //console.log(`ManualWork_select('${machine.MachineId}','${manualRef || '_'}')`);

    const data = await manualWorkSelect(machine.MachineId, manualRef || '_');
    changeMachine(machine.MachineId, data);
    onClose?.();
  };

  return (
    <Modal onClose={() => onClose?.()}>
      <div className="SP_MachineName">Cargar un trabajo - {machine.Name} -</div>
      {/* Tabla */}
      <div
        className="GenericModalContainer"
        id="GenericModalContainer"
        style={{ height: 285, overflow: 'auto', marginTop: 10 }}
      >
        <div className="col-md-12">
          <table className="table">
            <thead className="thead-inverse">
              <tr className="text-center">
                <th className="col-md-3 text-center">Nº Trabajo</th>
                <th className="col-md-2 text-center">Fecha</th>
                <th className="col-md-4 text-center">Comentarios</th>
                <th className="col-md-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {works.map(work => (
                <tr
                  key={work.WRodCutId}
                  onClick={() => handleSelectWork(work.WRodCutId)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ lineHeight: '34px' }}>{work.OrderRef}</td>
                  <td style={{ lineHeight: '34px' }}>{work.WorkDate}</td>
                  <td style={{ lineHeight: '34px' }}>{work.Comments}</td>
                  <td style={{ lineHeight: '34px' }}>{work.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Barra inferior */}
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
          onClick={() => handleSelectWork('_')}
        >
          Reposo
        </button>

        <input
          className="form-control"
          style={{ display: 'inline-block', width: 300, height: 40 }}
          id="ManualWork"
          name="ManualWork"
          type="text"
          placeholder="Introduce referencia"
          value={manualRef}
          onChange={e => setManualRef(e.target.value)}
        />

        <button
          type="button"
          className="btn btn-primary"
          style={{ float: 'right', marginRight: 10 }}
          onClick={handleManualWork}
        >
          Apertura Manual
        </button>
      </div>
    </Modal>
  );
};

// SelectWork_select('RodCut13','5bd08d68b7763') CADA FILA
// SelectWork_select('RodCut13','_') REPOSO
// ManualWork_select('RodCut13','_') APERTURA MANUAL
