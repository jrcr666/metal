import { AssignNRModal } from '@components/modals/AssignNRModal';
import { CloseBanquetteModal } from '@components/modals/CloseBanquetteModal';
import { CloseLineModal } from '@components/modals/CloseLine';
import { EditLineModal } from '@components/modals/EditLineModal.js';
import { NewBanquetteModal } from '@components/modals/NewBanquetteModal';
import { WorkModal } from '@components/modals/WorkSelector';
import { useRodCut } from '@hooks/screens/useRodCut';
import { useSelectOrder } from '@hooks/screens/useSelectOrder.js';
import { useMachinesStore } from '@store/machinesStore';
import React, { useState, useRef } from 'react';

type RodCutProps = {
  stationId: string;
};

export const RodCut: React.FC<RodCutProps> = () => {
  const { pauseMachine, resumeMachine } = useRodCut();
  const { selectOrderLine } = useSelectOrder();
  const { machines, updateMachine } = useMachinesStore();

  const [machineIdSelected, setMachineIdSelected] = useState('');
  const [lineSelected, setLineSelected] = useState('');
  const [banquetteRef, setBanquetteRef] = useState('');

  const [modalType, setModalType] = useState<
    'work' | 'closeLine' | 'closeBanquette' | 'newBanquette' | 'assignNR' | 'editLine' | null
  >(null);

  // Ref para detectar doble toque en pantallas táctiles
  const lastTapRef = useRef<number | null>(null);

  // ------------------ Acciones ------------------
  const handleAssignNR = (machineId: string) => {
    setMachineIdSelected(machineId);
    setModalType('assignNR');
  };

  const handleNewBanquette = (machineId: string) => {
    setMachineIdSelected(machineId);
    setModalType('newBanquette');
  };

  const handleCloseBanquette = (machineId: string, banquette: string) => {
    setMachineIdSelected(machineId);
    setBanquetteRef(banquette);
    setModalType('closeBanquette');
  };

  const handlePause = async (machineId: string) => {
    const data = await pauseMachine(machineId);
    updateMachine(machineId, data);
  };

  const handleResume = async (machineId: string) => {
    const data = await resumeMachine(machineId);
    updateMachine(machineId, data);
  };

  const handleOpenWork = (machineId: string) => {
    setMachineIdSelected(machineId);
    setModalType('work');
  };

  const handleSelectLine = async (
    machineId: string,
    rodCutLineId: string,
    rodCutOLineId: string
  ) => {
    const data = await selectOrderLine(machineId, rodCutLineId, rodCutOLineId);
    updateMachine(machineId, data);
  };

  const handleEditLine = (machineId: string, rodCutLineId: string) => {
    setMachineIdSelected(machineId);
    setLineSelected(rodCutLineId);
    setModalType('editLine');
  };

  const handleCloseLine = (machineId: string, rodCutLineId: string) => {
    setMachineIdSelected(machineId);
    setLineSelected(rodCutLineId);
    setModalType('closeLine');
  };

  // 🔹 Detección de doble toque (tablet/móvil)
  const handleTouchEdit = (machineId: string, rodCutLineId: string) => {
    const now = Date.now();
    if (lastTapRef.current && now - lastTapRef.current < 300) {
      // Segundo toque rápido → doble toque
      handleEditLine(machineId, rodCutLineId);
    }
    lastTapRef.current = now;
  };

  // ------------------ Render ------------------
  return (
    <div id="CorteBody" className="CorteBody">
      {machines.map(({ Machine, NrAlert, ClientMaterial, Finished }) => (
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
              <div
                className="Corte_Machine_NR btn btn-default"
                onClick={() => handleAssignNR(Machine.MachineId)}
              >
                Nuevo NR
              </div>
            )}

            {!Finished &&
              ((Machine.NrId !== '' || ClientMaterial === 'Y') && Machine.LineId !== '' ? (
                Machine.OutContainer1 === '' ? (
                  <div
                    className="Corte_Machine_NewBanqueta btn btn-primary"
                    onClick={() => handleNewBanquette(Machine.MachineId)}
                  >
                    Nueva Banqueta
                  </div>
                ) : (
                  <>
                    <div className="Corte_Machine_OutContainer">{Machine.OutContainer1}</div>
                    <div
                      className="Corte_Machine_NewBanqueta btn btn-gold"
                      onClick={() => handleCloseBanquette(Machine.MachineId, Machine.OutContainer1)}
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
                <div
                  className="Corte_Machine_Pause btn btn-danger"
                  onClick={() => handleResume(Machine.MachineId)}
                >
                  Reanudar
                </div>
              ) : (
                <div
                  className="Corte_Machine_Pause btn btn-warning"
                  onClick={() => handlePause(Machine.MachineId)}
                >
                  Pausar
                </div>
              ))}

            <div
              className="Corte_Machine_OpenWork btn btn-green"
              onClick={() => handleOpenWork(Machine.MachineId)}
            >
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
                    onClick={() =>
                      isAvailable &&
                      handleSelectLine(Machine.MachineId, line.RodCutLineId, line.OLineId)
                    }
                    onDoubleClick={() => handleEditLine(Machine.MachineId, line.RodCutLineId)}
                    onTouchEnd={() => handleTouchEdit(Machine.MachineId, line.RodCutLineId)}
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
                        onClick={() => handleCloseLine(Machine.MachineId, line.RodCutLineId)}
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
      ))}

      {/* ------------------ MODALES ------------------ */}
      {modalType === 'work' && (
        <WorkModal deviceId={machineIdSelected} onClose={() => setModalType(null)} />
      )}
      {modalType === 'closeLine' && (
        <CloseLineModal machineId={machineIdSelected} onClose={() => setModalType(null)} />
      )}
      {modalType === 'closeBanquette' && (
        <CloseBanquetteModal
          machineId={machineIdSelected}
          banquetteRef={banquetteRef}
          onClose={() => setModalType(null)}
        />
      )}
      {modalType === 'newBanquette' && (
        <NewBanquetteModal machineId={machineIdSelected} onClose={() => setModalType(null)} />
      )}
      {modalType === 'assignNR' && (
        <AssignNRModal machineId={machineIdSelected} onClose={() => setModalType(null)} />
      )}
      {modalType === 'editLine' && (
        <EditLineModal
          lineSelected={lineSelected}
          machineId={machineIdSelected}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
};
