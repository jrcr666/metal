import React, { useState } from 'react';
import { useRodCut } from '../../hooks/screens/useRodCut';
import { useMainFramework } from '../../hooks/useMainFramework';
import { CloseLineModal } from '../modals/CloseLine';
import { WorkModal } from '../modals/WorkSelector';

// 🔹 Tipos
type Material = {
  Name: string;
};

type Line = {
  RodCutLineId: string;
  OLineId: string;
  Quantity: number;
  QuantityAux?: number;
  Left: number;
  Dimension: string;
  Material: Material;
  MaterialId: string;
  Weight: number;
};

type Machine = {
  MachineId: string;
  Name: string;
  NrId: string;
  MaterialId: string;
  OutContainer1: string;
  StatusId: string;
  LineId: string;
  Lines: Line[];
  Order?: { OrderRef: string };
};

interface MachineBody {
  Machine: Machine;
  NrAlert: boolean;
  ClientMaterial: 'Y' | 'N';
  Finished: boolean;
}

type RodCutProps = {
  machines: MachineBody[];
  setMachines: React.Dispatch<React.SetStateAction<MachineBody[]>>;
  stationId: string;
};
export const RodCut: React.FC<RodCutProps> = ({ machines, setMachines }) => {
  const { loadModal } = useMainFramework();
  const { pauseMachine, resumeMachine } = useRodCut();
  const [machineIdSelected, setMachineIdSelected] = useState('');
  const [, setLineSelected] = useState('');
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [showCloseLineModal, setShowCloseLineModal] = useState(false);

  const setMachinesHandler = (machineId: string, data: MachineBody) => {
    setMachines(prev =>
      prev.map(m =>
        m.Machine.MachineId === machineId
          ? {
              ...m,
              Machine: { ...data.Machine },
              NrAlert: data.NrAlert,
              Finished: data.Finished,
              ClientMaterial: data.ClientMaterial,
            }
          : m
      )
    );
  };

  const handleAssignNR = (machineId: string) =>
    loadModal('GenericModal', `/app/AssignNR/${machineId}`);

  const handleNewBanquette = (machineId: string) =>
    loadModal('GenericModal', `/app/RodCut/NewBanquette/${machineId}`);

  const handleCloseBanquette = (machineId: string, outContainer: string) =>
    loadModal('GenericModal', `/app/RodCut/CloseBanquette/${machineId}/${outContainer}`);

  const handlePause = async (machineId: string) => {
    console.log(`PauseMachine('${machineId}')`);
    const data = await pauseMachine(machineId);

    setMachinesHandler(machineId, data);
  };

  const handleResume = async (machineId: string) => {
    console.log(`ResumeMachine('${machineId}')`);
    const data = await resumeMachine(machineId);

    setMachines(prev =>
      prev.map(m =>
        m.Machine.MachineId === machineId
          ? {
              ...m,
              Machine: { ...data.Machine },
              NrAlert: data.NrAlert,
              Finished: data.Finished,
              ClientMaterial: data.ClientMaterial,
            }
          : m
      )
    );
  };

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Abre la ventana de seleccion de trabajo para la maquina
   * con el id especificado.
   *
   * @param {string} machineId - El id de la maquina
   */
  /*******  6648fe44-f076-405d-aefc-78f3b2ab283a  *******/
  const handleOpenWork = (machineId: string) => {
    setMachineIdSelected(machineId);
    setShowWorkModal(true);
    // loadModal('GenericModal', `/app/SelectOrder/${machineId}`); // TEST DE HTML
  };

  const handleSelectLine = (machineId: string, rodCutLineId: string) => {
    console.log(`SelectOrder_selectLine('${machineId}', '${rodCutLineId}')`);
  };
  const handleEditLine = (machineId: string, rodCutLineId: string) => {
    loadModal('GenericModal', `/app/EditLine/${machineId}/${rodCutLineId}`);
  };
  const handleCloseLine = (machineId: string, rodCutLineId: string) => {
    //  loadModal('GenericModal', `/app/CloseLine/${machineId}/${rodCutLineId}`);
    setMachineIdSelected(machineId);
    setLineSelected(rodCutLineId);
    setShowCloseLineModal(true);
  };

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
                      isAvailable && handleSelectLine(Machine.MachineId, line.RodCutLineId)
                    }
                    onDoubleClick={() => handleEditLine(Machine.MachineId, line.RodCutLineId)}
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

      {showWorkModal && (
        <WorkModal
          changeMachine={setMachinesHandler}
          deviceId={machineIdSelected}
          onClose={() => setShowWorkModal(false)}
        />
      )}

      {showCloseLineModal && (
        <CloseLineModal
          machineId={machineIdSelected}
          changeMachine={setMachinesHandler}
          onClose={() => setShowCloseLineModal(false)}
        />
      )}
    </div>
  );
};
