import React, { useRef } from 'react';
import Operator from '../assets/img/operator.png';
import { IamDevice } from '../constants';
import { useServerManager } from '../hooks/screens/useServerManager';
import { useAppContext } from '../store/appStore';

const TAPHOLD_DURATION = 800;

export const HeaderContent: React.FC = () => {
  const { activeOperator: handleActiveOperator, closeOperator } = useServerManager();
  const { title, setShowOperatorModal } = useAppContext();
  const tapholdRefs = useRef<{ [key: string]: NodeJS.Timeout | null }>({});

  if (!title) return null;

  const { text, onClick, operators, assignOperator, activeOperator, stationId } = title;

  const handleMouseDown = (OperatorId: string) => {
    if (!IamDevice) return;
    tapholdRefs.current[OperatorId] = setTimeout(() => {
      closeOperator(stationId, OperatorId);
    }, TAPHOLD_DURATION);
  };

  const handleMouseUp = (OperatorId: string) => {
    if (!IamDevice) return;
    if (tapholdRefs.current[OperatorId]) {
      clearTimeout(tapholdRefs.current[OperatorId]!);
      tapholdRefs.current[OperatorId] = null;
    }
  };

  return (
    <div className="header-content">
      <div id="StationName" onClick={onClick}>
        {text}
      </div>

      {(operators || []).map(op => {
        const isActive = op.OperatorId === activeOperator;
        const nameStyle = {
          fontWeight: isActive ? 'bold' : 'normal',
          color: isActive ? '#FFFF00' : 'inherit',
        };

        return (
          <div key={op.OperatorId} className="operator-container">
            <div
              className="OperatorName noselect"
              style={nameStyle}
              onClick={() => handleActiveOperator(stationId, op.OperatorId)}
              onDoubleClick={() => !IamDevice && closeOperator(stationId, op.OperatorId)}
              onMouseDown={() => handleMouseDown(op.OperatorId)}
              onMouseUp={() => handleMouseUp(op.OperatorId)}
              onMouseLeave={() => handleMouseUp(op.OperatorId)}
            >
              {op.Name}
            </div>
            <img
              className="OperatorImg noselect"
              src={Operator}
              alt={op.Name}
              onClick={() => handleActiveOperator(stationId, op.OperatorId)}
              onDoubleClick={() => !IamDevice && closeOperator(stationId, op.OperatorId)}
              onMouseDown={() => handleMouseDown(op.OperatorId)}
              onMouseUp={() => handleMouseUp(op.OperatorId)}
              onMouseLeave={() => handleMouseUp(op.OperatorId)}
            />
          </div>
        );
      })}

      {assignOperator && (
        <button
          className="btn btn-green"
          // onClick={() => loadModal('GenericModal', `/app/SelectOperator/${stationId}`)}
          onClick={() => setShowOperatorModal(true)}
        >
          Asignar Operador
        </button>
      )}
    </div>
  );
};
