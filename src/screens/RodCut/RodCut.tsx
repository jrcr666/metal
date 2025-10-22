import type { MachineBody } from '@app-types/machine.types';
import { useSelectOrder } from '@hooks/screens/useSelectOrder.js';
import { useMachine } from '@hooks/useMachine.js';
import { useMachinesStore } from '@store/machinesStore';
import React, { useRef, useState } from 'react';
import { AssignNRModal } from './components/AssignNRModal';
import { CloseBanquetteModal } from './components/CloseBanquetteModal';
import { CloseLineModal } from './components/CloseLine';
import { EditLineModal } from './components/EditLineModal.js';
import { NewBanquetteModal } from './components/NewBanquetteModal';
import { WorkModal } from './components/WorkSelector';

type RodCutProps = {
  machine: MachineBody;
};

export const RodCut: React.FC<RodCutProps> = ({ machine }) => {
  const { selectOrderLine } = useSelectOrder();
  const { updateMachine } = useMachinesStore();
  const { pauseMachine, resumeMachine } = useMachine();

  const [lineSelected, setLineSelected] = useState('');
  const [banquetteRef, setBanquetteRef] = useState('');

  const { Machine, NrAlert, ClientMaterial, Finished } = machine;

  const [modalType, setModalType] = useState<
    'work' | 'closeLine' | 'closeBanquette' | 'newBanquette' | 'assignNR' | 'editLine' | null
  >(null);

  // Ref para detectar doble toque en pantallas táctiles
  const lastTapRef = useRef<number | null>(null);

  // ------------------ Acciones ------------------
  const handleAssignNR = () => {
    setModalType('assignNR');
  };

  const handleNewBanquette = () => {
    setModalType('newBanquette');
  };

  const handleCloseBanquette = (banquette: string) => {
    setBanquetteRef(banquette);
    setModalType('closeBanquette');
  };

  const handlePause = async () => {
    const data = await pauseMachine(Machine.MachineId);
    updateMachine(Machine.MachineId, data);
  };

  const handleResume = async () => {
    const data = await resumeMachine(Machine.MachineId);
    updateMachine(Machine.MachineId, data);
  };

  const handleOpenWork = () => {
    setModalType('work');
  };

  const handleSelectLine = async (rodCutLineId: string, rodCutOLineId: string) => {
    const data = await selectOrderLine(Machine.MachineId, rodCutLineId, rodCutOLineId);
    updateMachine(Machine.MachineId, data);
  };

  const handleEditLine = (rodCutLineId: string) => {
    setLineSelected(rodCutLineId);
    setModalType('editLine');
  };

  const handleCloseLine = (rodCutLineId: string) => {
    setLineSelected(rodCutLineId);
    setModalType('closeLine');
  };

  // 🔹 Detección de doble toque (tablet/móvil)
  const handleTouchEdit = (rodCutLineId: string) => {
    const now = Date.now();
    if (lastTapRef.current && now - lastTapRef.current < 300) {
      // Segundo toque rápido → doble toque
      handleEditLine(rodCutLineId);
    }
    lastTapRef.current = now;
  };

  // ------------------ Render ------------------
  return (
    <>
      <div
        key={Machine.MachineId}
        className="Corte_Machine noselect"
        id={`MachineZone_${Machine.MachineId}`}
      >
        {/* ---- HEADER IZQUIERDA ---- */}
        <div className="Corte_MachineLeft" style={NrAlert ? { background: '#f00' } : {}}>
          <div className="Corte_MachineName">{Machine.Name}</div>
          <div className="Corte_Machine_NrId">{Machine.NrId}</div>
          <div className="Corte_Machine_MaterialId" id={`${Machine.MachineId}_MaterialId`}>
            {Machine.MaterialId}
          </div>
          <div className="Corte_Machine_OrderId">{Machine.Order?.OrderRef ?? '-'}</div>

          {ClientMaterial === 'Y' ? (
            <div className="Corte_Machine_MC">Material del Cliente</div>
          ) : (
            <div className="Corte_Machine_NR btn btn-default" onClick={() => handleAssignNR()}>
              Nuevo NR
            </div>
          )}

          {!Finished &&
            ((Machine.NrId !== '' || ClientMaterial === 'Y') && Machine.LineId !== '' ? (
              Machine.OutContainer1 === '' ? (
                <div
                  className="Corte_Machine_NewBanqueta btn btn-primary"
                  onClick={() => handleNewBanquette()}
                >
                  Nueva Banqueta
                </div>
              ) : (
                <>
                  <div className="Corte_Machine_OutContainer">{Machine.OutContainer1}</div>
                  <div
                    className="Corte_Machine_NewBanqueta btn btn-gold"
                    onClick={() => handleCloseBanquette(Machine.OutContainer1)}
                  >
                    Cerrar Banqueta
                  </div>
                </>
              )
            ) : null)}
        </div>

        {/* ---- HEADER SUPERIOR ---- */}
        <div className="Corte_MachineHeader">
          <div className="Corte_MachineHead">Nº Varillas</div>
          <div className="Corte_MachineHead">Restantes</div>
          <div className="Corte_MachineHead">Medida</div>
          <div className="Corte_MachineHead" style={{ width: 200 }}>
            Tipo Varilla
          </div>
          <div className="Corte_MachineHead">Peso</div>

          {!Finished &&
            (Machine.StatusId === 'P' ? (
              <div className="Corte_Machine_Pause btn btn-danger" onClick={() => handleResume()}>
                Reanudar
              </div>
            ) : (
              <div className="Corte_Machine_Pause btn btn-warning" onClick={() => handlePause()}>
                Pausar
              </div>
            ))}

          <div className="Corte_Machine_OpenWork btn btn-green" onClick={() => handleOpenWork()}>
            Abrir Trabajo
          </div>
        </div>

        {/* ---- TABLA ---- */}
        <div
          className="Corte_Machine_Tabla"
          id={`RCB_${Machine.MachineId}`}
          style={{ paddingBottom: 50 }}
        >
          {!Finished ? (
            Machine.Lines.map(line => {
              const isSelected = Machine.LineId === line.RodCutLineId && line.Left > 0;
              const isAvailable = line.Left > 0;

              return (
                <div
                  key={line.RodCutLineId}
                  id={`RCL_${line.RodCutLineId}`}
                  className={`Corte_MachineRow ${isSelected ? 'Corte_MachineRow-selected' : ''}`}
                  style={!isAvailable ? { opacity: 0.3 } : undefined}
                  onClick={() => isAvailable && handleSelectLine(line.RodCutLineId, line.OLineId)}
                  onDoubleClick={() => handleEditLine(line.RodCutLineId)}
                  onTouchEnd={() => handleTouchEdit(line.RodCutLineId)}
                >
                  <div className="Corte_MachineColumn">
                    {line.Quantity}
                    {line.QuantityAux && <div className="Corte_Extra">{line.QuantityAux}</div>}
                  </div>
                  <div className="Corte_MachineColumn">{line.Left}</div>
                  <div className="Corte_MachineColumn">{line.Dimension}</div>
                  <div className="Corte_MachineColumn" style={{ width: 200 }}>
                    {line.Material?.Name ?? '-'}
                  </div>
                  <div className="Corte_MachineColumn">{line.Weight}</div>
                  {Machine.OutContainer1 && (
                    <div
                      className="Corte_MachineRowButton btn btn-default"
                      onClick={() => handleCloseLine(line.RodCutLineId)}
                    >
                      Cerrar Línea
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="Reposo">PEDIDO FINALIZADO</div>
          )}

          {!Finished && Machine.StatusId === 'P' && (
            <div className="Paused_Machine">MAQUINA PAUSADA</div>
          )}
        </div>
      </div>

      {/* ------------------ MODALES ------------------ */}
      {modalType === 'work' && (
        <WorkModal deviceId={Machine.MachineId} onClose={() => setModalType(null)} />
      )}
      {modalType === 'closeLine' && (
        <CloseLineModal machineId={Machine.MachineId} onClose={() => setModalType(null)} />
      )}
      {modalType === 'closeBanquette' && (
        <CloseBanquetteModal
          machineId={Machine.MachineId}
          banquetteRef={banquetteRef}
          onClose={() => setModalType(null)}
        />
      )}
      {modalType === 'newBanquette' && (
        <NewBanquetteModal machineId={Machine.MachineId} onClose={() => setModalType(null)} />
      )}
      {modalType === 'assignNR' && (
        <AssignNRModal machineId={Machine.MachineId} onClose={() => setModalType(null)} />
      )}
      {modalType === 'editLine' && (
        <EditLineModal
          lineSelected={lineSelected}
          machineId={Machine.MachineId}
          onClose={() => setModalType(null)}
        />
      )}
    </>
  );
};
