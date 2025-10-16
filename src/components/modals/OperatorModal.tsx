import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../store/userStore';
import { useMainFramework } from '../../hooks/useMainFramework';
import { useServerManager } from '../../hooks/screens/useServerManager';

interface Operator {
  OperatorId: string;
  Alias: string;
  Name: string;
  Surname: string;
}

interface OperatorModalProps {
  stationId: string;
  onClose?: () => void;
}

export const OperatorModal: React.FC<OperatorModalProps> = ({ stationId, onClose }) => {
  const { user } = useUser();
  const { showLoading, hideLoading } = useMainFramework();

  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [password, setPassword] = useState('');
  const { checkPwOperator } = useServerManager();

  // 👉 Cargar lista de operadores
  const loadOperators = useCallback(async () => {
    try {
      showLoading();

      const url = `${user.Protocol}${user.Host}/app/SelectOperator/${stationId}`;
      const dataString = `mobile.UserId=${user.UserId}&mobile.DeviceId=${user.DeviceId}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: dataString }),
      });

      const data = await response.json();
      hideLoading();

      if (data.ItsOK === 'Y') {
        setOperators(data.Operators);
      }
    } catch (err) {
      console.error('Error cargando operadores:', err);
      hideLoading();
    }
  }, [stationId, user, showLoading, hideLoading]);

  useEffect(() => {
    loadOperators();
  }, [loadOperators]);

  // 👉 Cuando se selecciona un operador
  const handleSelectOperator = (operator: Operator) => {
    setSelectedOperator(operator);
  };

  // 👉 Cuando se introduce contraseña
  const handleCheckPassword = () => {
    checkPwOperator(stationId, selectedOperator?.OperatorId, password);
  };

  console.log('selectedOperator', selectedOperator);
  console.log('operators', operators);

  return (
    <div
      id="ModalBack"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: 10,
        zIndex: 1000,
      }}
    >
      <div
        id="ModalZone"
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 8,
          width: 640,
          height: 385,
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {!selectedOperator ? (
          <>
            {/* Título */}
            <div className="SP_MachineName">Seleccionar Operador</div>

            {/* Lista de operadores */}
            <div
              className="GenericModalContainer"
              id="GenericModalContainer"
              style={{ height: 300, overflow: 'auto' }}
            >
              <div className="col-md-12">
                <table className="table">
                  <thead className="thead-inverse">
                    <tr className="text-center">
                      <th className="col-md-2 text-center">Alias</th>
                      <th className="col-md-10 text-center">Nombre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {operators.length > 0 &&
                      operators.map(op => (
                        <tr
                          key={op.OperatorId}
                          onClick={() => handleSelectOperator(op)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td style={{ lineHeight: '34px' }}>{op.Alias}</td>
                          <td style={{ lineHeight: '34px' }}>
                            {op.Name} {op.Surname}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Segunda vista: contraseña */}
            <div className="SP_MachineName">
              Contraseña {selectedOperator.Name} {selectedOperator.Surname}
            </div>

            <input type="hidden" id="OP_StationId" value={stationId} />
            <input type="hidden" id="OP_OperatorId" value={selectedOperator.OperatorId} />

            <input
              className="form-control NB_AdminPw"
              id="OpPw"
              name="OpPw"
              type="password"
              placeholder="Introduce contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ margin: '20px auto', width: '80%' }}
            />

            <button
              type="button"
              className="btn btn-primary NB_BanquetteBtn"
              onClick={handleCheckPassword}
              style={{ alignSelf: 'center' }}
            >
              Entrar
            </button>
          </>
        )}
      </div>
    </div>
  );
};
