import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useBackButton } from '../../hooks/useBackButton';
import { useDeviceEvents } from '../../hooks/useDeviceEvents';
import { useMainFramework } from '../../hooks/useMainFramework';
import { StationsList } from '../../screens/StationsList/StationsList';

import { SidebarMenu } from '@components/Sidebar';
import { useMenu } from '@hooks/useMenu';
import { useEffect, useState } from 'react';
import LoadingGif from '../../assets/img/loadingAnimation.gif';
import MenuIcon from '../../assets/img/Menu.png';
import { useAppContext } from '../../store/hooks/useAppStore';
import { DeviceDetails } from '../DeviceDetails';
import { HeaderContent } from '../HeaderContent';
import { OperatorModal } from '../modals/OperatorModal';
import './css/index.css';
import './css/MainScreen.css';
import './css/Menu.css';
import './css/StartSession.css';
import './css/stations.css';

const AppContent = () => {
  useDeviceEvents();
  useBackButton();

  const { start, packages, title: menuTitle } = useMenu();
  const { startFramework, endThird, hideModal } = useMainFramework();
  const { title, showOperatorModal, setShowOperatorModal } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleOpenMenu = async () => {
    setMenuOpen(true);
    await start();
  };

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
          onClick={() => handleOpenMenu()}
          alt="Menu"
        />

        <div className="MAIN_Body" id="ScrollContainer">
          <div className="MAIN_Scroll" id="bodyFramework">
            <Routes>
              <Route path="/" element={<StationsList />} />
              <Route path="/device/:id" element={<DeviceDetails />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>

        {/* <div id="MENU_Frame" onClick={() => endMenu()}>
          <div className="MENU_TopBar" id="MENU_TopBar" onClick={() => endMenu()}>
            <div className="Menu_Title" id="Name_Zone" onClick={() => startFramework()}>
              Menú
            </div>
            <img className="MainScreen_MenuIcon" src={MenuIcon} alt="Menu Icon" />
          </div>
          <div className="MENU_Body" id="MENU_ScrollContainer">
            <div className="MENU_Scroll" id="MENU_bodyFramework" />
          </div>
        </div> */}

        {/* Sidebar */}
        <SidebarMenu
          title={menuTitle}
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          onStartFramework={startFramework}
          packages={packages}
        />

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
        <div id="ModalBack" onClick={() => hideModal()}>
          <div id="ModalZone" />
        </div>
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
