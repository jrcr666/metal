import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMainFramework } from '../../hooks/useMainFramework';
import { useUserStore } from '../../store/userStore';
import './StationsList.css';
import { useAppContext } from '../../store/hooks/useAppStore';

interface Station {
  StationId: number;
  Name: string;
  OnClick?: string;
}

export const StationsList: React.FC = () => {
  const navigate = useNavigate();

  const { user } = useUserStore();
  const { loadModal, showLoading, hideLoading } = useMainFramework();
  const [stations, setStations] = useState<Station[]>([]);
  const { setTitle } = useAppContext();

  useEffect(() => {
    const getDevices = async () => {
      showLoading();
      try {
        const response = await fetch(`${user.Protocol}${user.Host}/app/StationsList`);
        const data = await response.json();

        setStations(data.stations);
        setTitle(data.title);
      } catch (error) {
        console.error('Error fetching device details:', error);
      } finally {
        hideLoading();
      }
    };

    getDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeServer = () => {
    loadModal('GenericModal', '/app/ChangeServer');
  };

  const handleStationClick = (station: Station) => {
    navigate(`/device/${station.StationId}`, { replace: true });
  };

  return (
    <div id="StationsList">
      {stations.length > 0 && (
        <>
          <div
            className="StationsList_Station btn btn-primary"
            style={{ float: 'left', margin: 15 }}
            onClick={handleChangeServer}
          >
            Cambiar servidor
          </div>

          {stations.map(station => (
            <button
              key={station.StationId + station.Name}
              className="StationsList_Station btn btn-primary"
              style={{ float: 'left', margin: 15 }}
              onClick={() => handleStationClick(station as unknown as Station)}
            >
              {station.Name}
            </button>
          ))}
        </>
      )}
    </div>
  );
};
