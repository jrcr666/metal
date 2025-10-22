import type { InContainer, MachineBody } from '@app-types/machine.types';
import { useSchlatter } from '@hooks/screens/useSchlatter';
import { useSelectOrder } from '@hooks/screens/useSelectOrder';
import { useMachine } from '@hooks/useMachine';
import { useMainFramework } from '@hooks/useMainFramework';
import { useMachinesStore } from '@store/machinesStore';
import React, { useRef, useState } from 'react';
import { WorkModal } from '../RodCut/components/WorkSelector';
import { CloseLineModal } from './components/CloseLineModal';
import { ClosePaletModal } from './components/ClosePaletModal';
import { SelectBanquetteModal } from './components/SelectBanquetteModal';

type SchlatterProps = {
  machine: MachineBody;
};

export const Schlatter: React.FC<SchlatterProps> = ({ machine }) => {
  const { updateMachine } = useMachinesStore();
  const { newPaletNoPrint, verifyPalet } = useSchlatter();
  const { selectOrderLine } = useSelectOrder();
  const { loadModal } = useMainFramework();
  const { pauseMachine, resumeMachine } = useMachine();
  const { Machine, WithWorksIn, InContainers, Finished } = machine;
  const [modalType, setModalType] = useState<
    'closePalet' | 'selectBanquette' | 'work' | 'closeLine' | null
  >(null);
  const [icSelected, setIcSelected] = useState<InContainer | null>(null);
  const [nrAct, setNrAct] = useState('');

  // Ref para detectar doble toque en pantallas táctiles
  const lastTapRef = useRef<number | null>(null);

  const handleEditLine = (machineId: string, lineId: string) => {
    loadModal('GenericModal', `/app/EditLine/${machineId}/${lineId}`);
  };

  const handleVerifyPalet = async () => {
    const data = await verifyPalet(Machine.MachineId, Machine.OutContainer1!);
    updateMachine(Machine.MachineId, data);
  };

  const handleNewPalet = async () => {
    const data = await newPaletNoPrint(Machine.MachineId);
    updateMachine(Machine.MachineId, data);
  };

  const handlePause = async () => {
    const data = await pauseMachine(Machine.MachineId);
    updateMachine(Machine.MachineId, data);
  };

  const handleResume = async () => {
    const data = await resumeMachine(Machine.MachineId);
    updateMachine(Machine.MachineId, data);
  };

  const handleTouchEdit = (lineId: string) => {
    const now = Date.now();
    if (lastTapRef.current && now - lastTapRef.current < 300) {
      handleEditLine(Machine.MachineId, lineId);
    }
    lastTapRef.current = now;
  };

  const handleSelectLine = async (
    machineId: string,
    rodCutLineId: string,
    rodCutOLineId: string
  ) => {
    const data = await selectOrderLine(machineId, rodCutLineId, rodCutOLineId);
    updateMachine(machineId, data);
  };

  const formatDateTime = (datetime?: string | null) => {
    if (!datetime) return { date: '-', time: '-' };
    const d = new Date(datetime);
    return {
      date: d.toLocaleDateString('es-ES'),
      time: d.toLocaleTimeString('es-ES'),
    };
  };

  const openBaquetteHandler = (ic: InContainer, nrAct: string = '') => {
    setIcSelected(ic);
    setNrAct(nrAct);
    setModalType('selectBanquette');
  };

  return (
    <>
      {/* LEFT PANEL */}
      <div className="Schlatter_MachineLeft">
        <div className="Schlatter_MachineName">{Machine?.Name}</div>
        <div className="Schlatter_Machine_OrderId">{Machine?.Order?.OrderRef}</div>

        {!Finished && Machine.LineId && (
          <>
            {!Machine.OutContainer1 && (
              <div className="Schlatter_Machine_NewPallet btn btn-primary" onClick={handleNewPalet}>
                Nuevo Palet
              </div>
            )}

            {Machine.LineId && !Machine.actualPaletVerified && Machine.OutContainer1 && (
              <>
                <div className="Schlatter_Machine_OutContainer">
                  {Machine.OutContainer1}
                  <br />
                  <sup>Pend.Verificar</sup>
                </div>
                <div
                  className="Schlatter_Machine_NewPallet btn btn-gold"
                  onClick={handleVerifyPalet}
                >
                  Verificar Palet
                </div>
              </>
            )}

            {Machine.actualPaletVerified && (
              <>
                <div className="Schlatter_Machine_OutContainer">
                  {Machine.OutContainer1}
                  <span style={{ color: 'green' }}>
                    <b>
                      <i>&check;</i>
                    </b>
                  </span>
                  <br />
                  <sup>
                    <small>
                      {formatDateTime(Machine.actualPaletVerified).date}{' '}
                      {formatDateTime(Machine.actualPaletVerified).time}
                    </small>
                  </sup>
                </div>
                <div
                  className="Schlatter_Machine_NewPallet btn btn-default"
                  onClick={() => setModalType('closePalet')}
                >
                  Cerrar Palet
                </div>
              </>
            )}
          </>
        )}
      </div>
      {/* IN PALLETS */}
      <div className="Schlatter_InPallets">
        <div className="Schlatter_InPallet">
          <div style={{ float: 'left', width: '100%', marginLeft: 400, marginBottom: -40 }}>
            {WithWorksIn
              ? InContainers.map(ic => {
                  const nrAct = ic.NR && ic.NR !== '?' ? ic.NR.replace('/', '-') : '-';
                  return (
                    <div
                      key={ic.No}
                      className="Schlatter_PalletsBody"
                      style={{ float: 'left', width: 300 }}
                    >
                      <div style={{ float: 'left', width: '100%' }}>{ic.Label}</div>
                      <div
                        style={{
                          float: 'left',
                          width: '100%',
                          height: 40,
                          fontSize: 30,
                          fontWeight: 'bold',
                        }}
                      >
                        {ic.Name}{' '}
                        <small>
                          <small>
                            <sup>NR: {ic.NR}</sup>
                          </small>
                        </small>
                      </div>
                      <div style={{ float: 'left', width: '100%' }}>
                        {/* TERMINAR ESTE */}
                        <button
                          className="btn btn-default btn-ExtrCreate"
                          type="button"
                          onClick={() => openBaquetteHandler(ic, nrAct)}
                        >
                          Abrir Banqueta
                        </button>
                      </div>
                    </div>
                  );
                })
              : InContainers.map(ic => (
                  <div
                    key={ic.No}
                    className="Schlatter_PalletsBody"
                    style={{ float: 'left', width: 300 }}
                  >
                    <div style={{ float: 'left', width: '100%' }}>{ic.Label}</div>
                    <div
                      style={{
                        float: 'left',
                        width: '100%',
                        height: 40,
                        fontSize: 30,
                        fontWeight: 'bold',
                      }}
                    >
                      {ic.Name}
                    </div>
                    <div style={{ float: 'left', width: '100%' }}>
                      <button
                        className="btn btn-default btn-ExtrCreate"
                        type="button"
                        onClick={() => openBaquetteHandler(ic)}
                      >
                        Abrir Banqueta
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
      {/* TABLE */}
      <div className="Schlatter_Machine_Tabla">
        <div className="Schlatter_MachineHeader">
          <div className="Schlatter_MachineHead">Nº Mallas</div>
          <div className="Schlatter_MachineHead">Restantes</div>
          <div className="Schlatter_MachineHead">Modelo</div>
          <div className="Schlatter_MachineHead" style={{ width: 330 }} />
          <div className="Schlatter_MachineHead" style={{ width: 100 }}>
            Verif.NR
          </div>

          {!Finished && (
            <>
              {Machine.StatusId === 'P' ? (
                <div className="Schlatter_Machine_Pause btn btn-danger" onClick={handleResume}>
                  Reanudar
                </div>
              ) : (
                <div className="Schlatter_Machine_Pause btn btn-warning" onClick={handlePause}>
                  Pausar
                </div>
              )}
            </>
          )}
          <div
            className="Schlatter_Machine_OpenWork btn btn-green"
            onClick={() => setModalType('work')}
          >
            Abrir Trabajo
          </div>
        </div>

        <div
          className="Schlatter_Machine_Tabla"
          style={{ paddingBottom: 50 }}
          id={`RCB_${Machine.MachineId}`}
        >
          {!Finished ? (
            Machine.Lines.map(line => {
              const isSelected = Machine.LineId === line.SchlatterLineId && line.Left > 0;
              const isAvailable = line.Left > 0;

              const { date, time } = formatDateTime(line.Verified_NR);
              return (
                <div
                  key={line.SchlatterLineId}
                  id={`RCL_${line.SchlatterLineId}`}
                  className={`Schlatter_MachineRow ${isSelected ? 'Schlatter_MachineRow-selected' : ''}`}
                  style={!isAvailable && line.Left <= 0 ? { opacity: 0.3 } : undefined}
                  onDoubleClick={() => handleEditLine(Machine.MachineId, line.SchlatterLineId)}
                  onClick={() =>
                    isAvailable &&
                    handleSelectLine(Machine.MachineId, line.SchlatterLineId, line.OLineId)
                  }
                  onTouchEnd={() => handleTouchEdit(line.SchlatterLineId)}
                >
                  <div className="Schlatter_MachineColumn">
                    {line.Quantity}
                    <div className="Schlatter_Extra">{line.QuantityAux}</div>
                  </div>
                  <div className="Schlatter_MachineColumn">{line.Left}</div>
                  <div className="Schlatter_MachineColumn">{line.ModelRef}</div>
                  <div className="Schlatter_MachineColumn" style={{ width: 330 }} />
                  <div className="Schlatter_MachineColumn" style={{ width: 100, marginTop: -20 }}>
                    {line.Verified_NR ? (
                      <>
                        <sub>{date}</sub>
                        <br />
                        <sup>{time}</sup>
                      </>
                    ) : (
                      <small>Pendiente</small>
                    )}
                  </div>

                  {Machine.OutContainer1 && (
                    <div
                      className="Schlatter_MachineRowButton btn btn-default"
                      onClick={e => {
                        e.stopPropagation();

                        setModalType('closeLine');
                      }}
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
      {/* ---- MODALS ---- */}
      {modalType === 'work' && (
        <WorkModal deviceId={Machine.MachineId} onClose={() => setModalType(null)} />
      )}
      {modalType === 'closePalet' && (
        <ClosePaletModal machine={Machine} onClose={() => setModalType(null)} />
      )}
      {modalType === 'closeLine' && (
        <CloseLineModal machineId={Machine.MachineId} onClose={() => setModalType(null)} />
      )}
      {modalType === 'selectBanquette' && icSelected && (
        <SelectBanquetteModal
          machine={Machine}
          ic={icSelected}
          nrAct={nrAct}
          WithWorksIn={false}
          onClose={() => {
            setModalType(null);
            setIcSelected(null);
            setNrAct('');
          }}
        />
      )}
    </>
  );
};
