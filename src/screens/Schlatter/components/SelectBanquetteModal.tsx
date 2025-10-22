import React, { useCallback, useEffect, useState } from 'react';
import type { InContainer, Machine } from '@app-types/machine.types';
import { useMainFramework } from '@hooks/useMainFramework';
import { useUserStore } from '@store/userStore';
import { Modal } from '@components/modals/Modal';
import { useWorks } from '@hooks/screens/useWorks';
import { useMachinesStore } from '@store/machinesStore';

interface Pallet {
  RCPackageId: string;
  BanquetteRef: string;
  Quantity: number;
  Dimension: string;
  Material?: { Name: string };
  NrId: string;
}

interface SelectBanquetteModalProps {
  machine: Machine;
  ic: InContainer;
  WithWorksIn: boolean;
  onClose?: VoidFunction;
  nrAct?: string;
}

export const SelectBanquetteModal: React.FC<SelectBanquetteModalProps> = ({
  machine,
  ic,
  WithWorksIn,
  onClose,
  nrAct = '',
}) => {
  const { updateMachine } = useMachinesStore();
  const { user } = useUserStore();
  const { selectWIPallet } = useWorks();
  const { loadModal, showLoading, hideLoading } = useMainFramework();

  const [manualFilter, setManualFilter] = useState('');
  const [loadingPage, setLoadingPage] = useState(true);
  const [pallets, setPallets] = useState<Pallet[]>([]);

  const loadData = useCallback(async () => {
    try {
      showLoading();

      const endpoint = WithWorksIn
        ? `/app/SelectWorkInSource/${machine.MachineId}/${ic.No}/${ic.WorkInId}/${ic.Type}/${ic.WorkId}/${ic.WLineId}/${nrAct}`
        : `/app/SelectWorkInSource/${machine.MachineId}/${ic.No}/MA/RC/_/_`;
      const url = `${user.Protocol}${user.Host}${endpoint}`;
      const body = {
        mobile: {
          UserId: user.UserId,
          DeviceId: user.DeviceId,
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      hideLoading();

      if (data.ItsOK === 'Y') {
        setPallets(data.Pallets || []);
      } else {
        console.error('Error desde servidor:', data.Msg);
      }
    } catch (err) {
      console.error('Error cargando banquetas:', err);
      hideLoading();
    } finally {
      setLoadingPage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSmartFilterChange = (value: string) => {
    const formatted = value.replace(/\./g, '-').replace(/,/g, '_').replace(/ /g, '');
    setManualFilter(formatted.toUpperCase());
  };

  const handleSelectPallet = (palletId: string, banquetteRef: string, nrId: string) => {
    const nrChange = nrId !== nrAct;
    console.log('Seleccionada:', {
      machineId: machine.MachineId,
      palletId,
      banquetteRef,
      nrId,
      nrChange,
    });
    // Aquí iría la llamada real a SelectWIPallet_select(...)
  };

  const handleReleasePallet = (palletId: string) => {
    if (window.confirm('¿Está seguro de liberar banqueta?')) {
      loadModal(
        'GenericModal',
        `/app/ReleaseInSource/${machine.MachineId}/${ic.No}/${ic.WorkInId}/${ic.Type}/${ic.WorkId}/${ic.WLineId}/${palletId}`
      );
    }
  };

  const handleManualSelect = async (type: 'none' | 'manual') => {
    const typeId = type === 'manual' ? 'MA' : '_';
    const workInId = WithWorksIn ? ic.WorkInId : 'MA';

    const data = await selectWIPallet(
      machine.MachineId,
      ic.No,
      workInId,
      typeId,
      '_',
      '_',
      manualFilter
    );
    updateMachine(machine.MachineId, data);
    onClose?.();
  };

  const filteredPallets = pallets.filter(p =>
    p.BanquetteRef?.toUpperCase().includes(manualFilter.toUpperCase())
  );

  if (loadingPage) return null;

  return (
    <Modal width={620} onClose={() => onClose?.()} padding={0}>
      <div className="SP_MachineName">Selecciona una banqueta (Actual: {nrAct || '-'})</div>

      <div className="GenericModalContainer" style={{ height: 285, overflow: 'auto' }}>
        <div className="col-md-12">
          <table className="table">
            <thead className="thead-inverse">
              <tr className="text-center">
                <th className="col-md-3">Nº Banqueta</th>
                <th className="col-md-2">Cantidad</th>
                <th className="col-md-2">Medida</th>
                <th className="col-md-4">Material</th>
                <th className="col-md-4">NR</th>
                <th className="col-md-1"></th>
              </tr>
            </thead>
            <tbody>
              {filteredPallets.map(pallet => {
                const nrChange = pallet.NrId !== nrAct;
                return (
                  <tr
                    key={pallet.RCPackageId}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      handleSelectPallet(pallet.RCPackageId, pallet.BanquetteRef, pallet.NrId)
                    }
                  >
                    <td style={{ lineHeight: '34px' }}>{pallet.BanquetteRef}</td>
                    <td style={{ lineHeight: '34px' }}>{pallet.Quantity}</td>
                    <td style={{ lineHeight: '34px' }}>{pallet.Dimension}</td>
                    <td style={{ lineHeight: '34px' }}>{pallet.Material?.Name ?? '-'}</td>
                    <td style={{ lineHeight: '34px' }}>
                      {!nrChange ? <b>{pallet.NrId}</b> : pallet.NrId}
                    </td>
                    <td style={{ lineHeight: '34px' }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ float: 'left', marginLeft: 10 }}
                        onClick={e => {
                          e.stopPropagation();
                          handleReleasePallet(pallet.RCPackageId);
                        }}
                      >
                        Liberar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="SP_BottomBar"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <button
          type="button"
          className="btn btn-primary"
          style={{ float: 'left', marginLeft: 10 }}
          onClick={() => handleManualSelect('none')}
        >
          Ninguno
        </button>

        <input
          id="ManualPallet"
          className="form-control SmartFilter"
          style={{
            textTransform: 'uppercase',
            display: 'inline-block',
            width: 300,
            height: 40,
          }}
          type="text"
          placeholder="Introduce referencia"
          value={manualFilter}
          onChange={e => handleSmartFilterChange(e.target.value)}
        />

        <button
          type="button"
          className="btn btn-primary"
          style={{ float: 'right', marginRight: 10 }}
          onClick={() => handleManualSelect('manual')}
        >
          Selección Manual
        </button>
      </div>
    </Modal>
  );
};
