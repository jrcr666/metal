import { useMachinesStore } from '@store/machinesStore';
import React, { useEffect, useState } from 'react';
import { useRodCut } from '../../../hooks/screens/useRodCut';
import { useMainFramework } from '../../../hooks/useMainFramework';
import { useUserStore } from '../../../store/userStore';
import { Modal } from '../../../components/modals/Modal';

// Tipos de la línea y materiales
interface Material {
  MaterialId: number;
  Name: string;
}

interface Line {
  WRodCutId: number;
  RodCutLineId: number;
  Quantity: number;
  QuantityAux: number;
  Dimension: number;
  MaterialId: number;
}

interface SaveLineParams {
  machineId: string;
  orderId: number;
  lineId: number;
  quantity: number;
  extra: number;
  dimension: number;
  materialId: number;
}

type EditLineModalProps = {
  machineId: string;
  lineSelected: string;
  onClose?: () => void;
};

export const EditLineModal: React.FC<EditLineModalProps> = ({
  machineId,
  onClose,
  lineSelected,
}) => {
  const { updateMachine } = useMachinesStore();

  const { showLoading, hideLoading } = useMainFramework();
  const { saveLine } = useRodCut();
  const { user } = useUserStore();

  const [line, setLine] = useState<Line | null>(null);
  const [title, setTitle] = useState<string>('');
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    const fetchLine = async () => {
      showLoading();

      try {
        const dataString = `mobile.UserId=${user.UserId}&mobile.DeviceId=${user.DeviceId}`;
        const url = `${user.Protocol}${user.Host}/app/EditLine/${machineId}/${lineSelected}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: dataString }),
        });

        const data = await response.json();

        setLine(data.Line);
        setTitle(data.Title);
        setMaterials(data.Materials);
      } catch (error) {
        console.error(error);
      } finally {
        hideLoading();
      }
    };

    fetchLine();
  }, [machineId, lineSelected, user, showLoading, hideLoading]);

  const handleSave = async () => {
    if (!line) return;

    const data = await saveLine({
      machineId,
      orderId: line.WRodCutId,
      lineId: line.RodCutLineId,
      quantity: line.Quantity,
      extra: line.QuantityAux,
      dimension: line.Dimension,
      materialId: line.MaterialId,
    } as SaveLineParams);

    updateMachine(machineId, data);
    onClose?.();
  };

  if (!line) return null;

  return (
    <Modal onClose={onClose}>
      <div className="SP_MachineName">{title}</div>
      <input id="CB_OrderId" name="OrderId" type="hidden" value={line.WRodCutId} />
      <input id="CB_LineId" name="LineId" type="hidden" value={line.RodCutLineId} />

      <div>Nº de Varillas</div>
      <input
        className="form-control CB_Quantity"
        id="CB_Quantity"
        name="Quantity"
        type="number"
        placeholder="Introduce Numero de Varillas"
        value={line.Quantity}
        onChange={e => setLine({ ...line, Quantity: Number(e.target.value) || 0 })}
      />

      <div>Extra</div>
      <input
        className="form-control CB_Quantity"
        id="CB_Extra"
        name="QuantityAux"
        type="number"
        placeholder="Introduce Extra"
        value={line.QuantityAux}
        onChange={e => setLine({ ...line, QuantityAux: Number(e.target.value) || 0 })}
      />

      <div>Longitud</div>
      <input
        className="form-control CB_Quantity"
        id="CB_Dimension"
        name="Dimension"
        type="number"
        placeholder="Introduce Longitud"
        value={line.Dimension}
        onChange={e => setLine({ ...line, Dimension: Number(e.target.value) || 0 })}
      />

      <div>Material</div>
      <select
        className="form-control CB_Weight"
        id="CB_MaterialId"
        name="MaterialId"
        value={line.MaterialId}
        onChange={e => setLine({ ...line, MaterialId: Number(e.target.value) })}
      >
        {materials.map(material => (
          <option key={material.MaterialId} value={material.MaterialId}>
            {material.Name}
          </option>
        ))}
      </select>

      <button
        type="button"
        style={{ marginTop: '25px' }}
        className="btn btn-primary CB_BanquetteBtn"
        onClick={handleSave}
      >
        Guardar Cambios
      </button>
    </Modal>
  );
};
