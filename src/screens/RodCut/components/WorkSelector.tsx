import type { Machine } from '@app-types/machine.types';
import { useWorks } from '@hooks/screens/useWorks';
import { useMainFramework } from '@hooks/useMainFramework';
import { useMachinesStore } from '@store/machinesStore';
import { useUserStore } from '@store/userStore';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from '@components/modals/Modal';

interface Work {
  WRodCutId?: string;
  WSchlatterId?: string;
  OrderRef: string;
  WorkDate: string;
  Comments: string;
  Status: string;
}

interface Material {
  MaterialId: string;
  Name: string;
}

interface WorkModalProps {
  deviceId: string;
  onClose?: () => void;
}

interface ManualRefInputProps {
  onManualWork: (ref: string) => void;
}

const ManualRefInput = memo(({ onManualWork }: ManualRefInputProps) => {
  const [localValue, setLocalValue] = useState('');

  const handleChange = (value: string) => {
    const formatted = value.replace(/\./g, '-').replace(/,/g, '_').replace(/ /g, '').toUpperCase();
    setLocalValue(formatted);
  };

  const handleManualWork = useCallback(() => {
    onManualWork(localValue);
  }, [localValue, onManualWork]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <input
        className="form-control"
        style={{ width: 300, height: 40 }}
        type="text"
        placeholder="Introduce referencia"
        value={localValue}
        onChange={e => handleChange(e.target.value)}
      />
      <button type="button" className="btn btn-primary" onClick={handleManualWork}>
        Apertura Manual
      </button>
    </div>
  );
});
ManualRefInput.displayName = 'ManualRefInput';

const WorkTable = memo(
  ({
    works,
    onSelect,
    idKey,
  }: {
    works: Work[];
    onSelect: (id: string) => void;
    idKey: 'WRodCutId' | 'WSchlatterId';
  }) => (
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
          {works.map(work => {
            const id = work[idKey];
            if (!id) return null;
            return (
              <tr key={id} onClick={() => onSelect(id)} style={{ cursor: 'pointer' }}>
                <td style={{ lineHeight: '34px' }}>{work.OrderRef}</td>
                <td style={{ lineHeight: '34px' }}>{work.WorkDate}</td>
                <td style={{ lineHeight: '34px' }}>{work.Comments}</td>
                <td style={{ lineHeight: '34px' }}>{work.Status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
);
WorkTable.displayName = 'WorkTable';

export const WorkModal: React.FC<WorkModalProps> = ({ deviceId, onClose }) => {
  const { updateMachine } = useMachinesStore();
  const { user } = useUserStore();
  const { showLoading, hideLoading } = useMainFramework();
  const { selectWork, manualWorkSelect, manualWorkCreate } = useWorks();

  const [machine, setMachine] = useState<Machine | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [manualLines, setManualLines] = useState<number[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [manualTitle, setManualTitle] = useState<string>('');
  const [manualRef, setManualRef] = useState<string>('');

  const formRef = useRef<HTMLFormElement | null>(null);

  const idKey = useMemo<'WRodCutId' | 'WSchlatterId'>(() => {
    if (
      machine?.TypeId?.toLowerCase().includes('schlatter') ||
      machine?.Name?.includes('Schlatter')
    ) {
      return 'WSchlatterId';
    }
    return 'WRodCutId';
  }, [machine]);

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

  const handleSelectWork = async (workId: string) => {
    const data = await selectWork(machine.MachineId, workId);
    updateMachine(machine.MachineId, data);
    onClose?.();
  };

  const handleManualWork = async (ref: string) => {
    setManualRef(ref);
    const data = await manualWorkSelect(machine.MachineId, ref || '_');
    if (data) {
      if (data.Machine) {
        updateMachine(machine.MachineId, data.Machine);
        return onClose?.();
      }
      setManualLines(data.Lines || []);
      setMaterials(data.Materials || []);
      setManualTitle(data.Title || 'Trabajo manual');
    }
  };

  const handleCreate = async () => {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const fields: Record<string, string> = {};
    formData.forEach((value, key) => {
      fields[key] = String(value);
    });

    const ref = manualRef || '_';
    const data = await manualWorkCreate(machine.MachineId, ref, fields);
    if (data) {
      updateMachine(machine.MachineId, data);
      onClose?.();
    }
  };

  const showingManual = manualLines.length > 0;

  return (
    <Modal width={600} onClose={onClose}>
      {!showingManual ? (
        <>
          <div className="SP_MachineName">Cargar un trabajo - {machine.Name} -</div>

          <div
            className="GenericModalContainer"
            style={{ height: 285, overflow: 'auto', marginTop: 10 }}
          >
            <WorkTable works={works} onSelect={handleSelectWork} idKey={idKey} />
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
            <button type="button" className="btn btn-primary" onClick={() => handleSelectWork('_')}>
              Reposo
            </button>

            <ManualRefInput onManualWork={handleManualWork} />
          </div>
        </>
      ) : (
        <>
          <div className="SP_MachineName">{manualTitle}</div>

          <div className="GenericModalContainer" style={{ height: 285, overflow: 'auto' }}>
            <div className="col-md-12">
              <form ref={formRef} id="ManualWorkForm">
                <table className="table">
                  <thead className="thead-inverse">
                    <tr className="text-center">
                      <th className="col-md-2 text-center">Cantidad</th>
                      <th className="col-md-2 text-center">Extra</th>
                      <th className="col-md-2 text-center">Longitud</th>
                      <th className="col-md-4 text-center">Material</th>
                    </tr>
                  </thead>
                  <tbody>
                    {manualLines.map(line => (
                      <tr key={line}>
                        <td>
                          <input
                            className="form-control"
                            name={`${line}Quantity`}
                            type="number"
                            placeholder="Cantidad"
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            name={`${line}Extra`}
                            type="number"
                            placeholder="Extra"
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            name={`${line}Dimension`}
                            type="number"
                            placeholder="Longitud"
                          />
                        </td>
                        <td>
                          <select name={`${line}MaterialId`} className="form-control">
                            {materials.map(material => (
                              <option key={material.MaterialId} value={material.MaterialId}>
                                {material.Name}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </form>
            </div>
          </div>

          <button type="button" className="btn btn-primary" onClick={handleCreate}>
            Crear
          </button>
        </>
      )}
    </Modal>
  );
};
