import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useBackButton } from '../../hooks/useBackButton';
import { useDeviceEvents } from '../../hooks/useDeviceEvents';
import { useMainFramework } from '../../hooks/useMainFramework';
import { useMenu } from '../../hooks/useMenu';
import { StationsList } from '../../pages/StationsList/StationsList';

import { useEffect } from 'react';
import LoadingGif from '../../assets/img/loadingAnimation.gif';
import MenuIcon from '../../assets/img/Menu.png';
import { DeviceDetails } from '../DevideDetails';
import { HeaderContent } from '../HeaderContent';
import './css/index.css';
import './css/MainScreen.css';
import './css/Menu.css';
import './css/StartSession.css';
import './css/stations.css';
import { OperatorModal } from '../modals/OperatorModal';
import { useAppContext } from '../../store/appStore';

const AppContent = () => {
  useDeviceEvents();
  useBackButton();

  const { startMenu } = useMenu();
  const { endMenu, startFramework, endThird } = useMainFramework();
  const { title, showOperatorModal, setShowOperatorModal } = useAppContext();

  useEffect(() => {
    startFramework();
  }, [startFramework]);

  return (
    <Router>
      <div id="mainFramework">
        <div id="PopAnchor" />

        <div id="TopBar" style={{ display: 'block' }}>
          <HeaderContent />
        </div>

        <img
          style={{ display: 'block' }}
          className="MainScreen_Menu"
          id="MenuButton"
          src={MenuIcon}
          onClick={() => startMenu()}
          alt="Menu"
        />

        <div className="MAIN_Body" id="ScrollContainer">
          <div className="MAIN_Scroll" id="bodyFramework">
            {/* Aquí se renderizan las rutas */}
            <Routes>
              <Route path="/" element={<StationsList />} />
              <Route path="/device/:id" element={<DeviceDetails />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>

        {/* Resto del layout igual */}
        <div id="MENU_Frame" onClick={() => endMenu()}>
          <div className="MENU_TopBar" id="MENU_TopBar" onClick={() => endMenu()}>
            <div className="Menu_Title" id="Name_Zone" onClick={() => startFramework()}>
              Menú
            </div>
            <img className="MainScreen_MenuIcon" src={MenuIcon} alt="Menu Icon" />
          </div>
          <div className="MENU_Body" id="MENU_ScrollContainer">
            <div className="MENU_Scroll" id="MENU_bodyFramework" />
          </div>
        </div>

        <div id="THIRD_Frame">
          <div className="THIRD_TopBar" id="THIRD_TopBar">
            <div className="THIRD_Back" onClick={() => endThird()} />
            <div className="THIRD_Share" />
          </div>
          <div className="THIRD_Body" id="THIRD_ScrollContainer">
            <div className="THIRD_Scroll" id="THIRD_bodyFramework" />
          </div>
        </div>

        <div id="LANDSCAPE_Frame">
          <div className="LANDSCAPE_Body" id="LANDSCAPE_ScrollContainer">
            <div className="LANDSCAPE_Scroll" id="LANDSCAPE_bodyFramework" />
          </div>
        </div>

        <div id="BottomBar">
          <div
            className="OpcionMenu OpcionMenuEnabled"
            id="Bt_0"
            onClick={() => console.log('Goto 0')}
          >
            Reparto
          </div>
          <div className="OpcionMenu" id="Bt_1" onClick={() => console.log('Goto 1')}>
            Tesorería
          </div>
          <div className="BottomBarBottom">
            <div className="DotsZone">
              <div className="UnSelectedDot SelectedDot" id="Dt_0" />
              <div className="UnSelectedDot" id="Dt_1" />
            </div>
          </div>
        </div>

        <div id="SplashZone" />
        {/* <div id="ModalBack" onClick={() => hideModal()}>
          <div id="ModalZone" />
        </div> */}
        <div id="LoadingWait">
          <div id="LoadingBody">
            <div id="LoadingWaitText">Por favor, espere...</div>
            <img id="LoadingImg" src={LoadingGif} alt="Loading" />
          </div>
        </div>
        <div id="AppStatus">Loading</div>

        {showOperatorModal && title?.stationId && (
          <OperatorModal stationId={title?.stationId} onClose={() => setShowOperatorModal(false)} />
        )}
      </div>
    </Router>
  );
};

export { AppContent };
