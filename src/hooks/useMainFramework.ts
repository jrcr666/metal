import $ from 'jquery';
import { useCallback, useRef } from 'react';
import { useUserStore } from '../store/userStore';
import { useGenericModal } from './useGenericModal';
import { useMainScreen } from './useMainScreen';

export function useMainFramework() {
  const { user } = useUserStore();
  const { start } = useMainScreen();
  const { startModal } = useGenericModal();

  // Variables internas del framework
  //const version = useRef('1503.01');
  // const scroll = useRef<number>(0);
  // const menuScroll = useRef<number>(0);
  // const thirdScroll = useRef<number>(0);
  //const modalScroll = useRef<number>(0);
  const isModal = useRef(false);
  //const isMenu = useRef(false);
  const isThird = useRef(false);
  const isLandscape = useRef(false);
  const lockModal = useRef(false);
  const lockExit = useRef(false);

  const init = useCallback(() => {
    const today = new Date();
    console.log('[MainFramework] init:', today.toISOString());
    const waitingProcess = $.Deferred();

    //const isTouchScreen = 'createTouch' in document;
    //(window as any).isTouchScreen = isTouchScreen;

    waitingProcess.resolve();
    return waitingProcess.promise();
  }, []);

  // ----------------------
  // Métodos base del framework
  // ----------------------

  const startFramework = useCallback(() => {
    $('#FirstLoading').hide();

    changeBackground();
    start();
    $('#Name_Zone').html(`${user?.Name ?? ''} ${user?.Surname ?? ''}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const changeBackground = useCallback(() => {
    $('#mainFramework').css('background-image', 'none');
  }, []);

  const showTopBar = useCallback((menuVisible = true) => {
    $('#TopBar').show();
    if (menuVisible) {
      $('#BackButton').hide();
      $('#MenuButton').show();
      lockExit.current = true;
    } else {
      $('#BackButton').hide();
      $('#MenuButton').hide();
      lockExit.current = false;
    }
  }, []);

  const hideTopBar = useCallback(() => $('#TopBar').hide(), []);
  const showBottomBar = useCallback((inicioVisible = true) => {
    $('#BottomBar').show();
    if (inicioVisible) {
      $('#InicioButton').show();
    } else {
      $('#InicioButton').hide();
    }
  }, []);
  const hideBottomBar = useCallback(() => $('#BottomBar').hide(), []);

  // ----------------------
  // Menú / Modal
  // ----------------------

  // const showMenu = useCallback(() => {
  //   if (!$('#MenuBack').is(':visible')) $('#MenuBack').show();
  // }, []);

  // const hideMenu = useCallback(() => {
  //   if ($('#MenuBack').is(':visible')) $('#MenuBack').hide();
  // }, []);

  const loadModal = useCallback((modal: string, path: string) => {
    isModal.current = true;
    lockModal.current = false;
    if (modal == 'GenericModal') startModal(path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showModal = useCallback(() => {
    if (!$('#ModalBack').is(':visible')) $('#ModalBack').show();
  }, []);

  const hideModal = useCallback(() => {
    isModal.current = false;
    if (!lockModal.current) {
      $('#ModalZone').html(' ');
      if ($('#ModalBack').is(':visible')) $('#ModalBack').hide();
    }
  }, []);

  // ----------------------
  // Loading
  // ----------------------

  const showLoading = useCallback(() => $('#LoadingWait').fadeIn(350), []);
  const hideLoading = useCallback(() => $('#LoadingWait').fadeOut(200), []);

  // ----------------------
  // Capas (Third / Landscape)
  // ----------------------

  const startThird = useCallback(() => {
    isThird.current = true;
    const width = $('#ScrollContainer').width();
    $('#THIRD_ScrollContainer').removeAttr('class');
    $('#THIRD_Frame').hide();
    $('#THIRD_Frame').css({ left: `${width}px`, width: `${width}px` });
    $('#THIRD_Frame').show();
    $('#THIRD_Frame').animate({ left: '0px' }, 350);
  }, []);

  const endThird = useCallback(() => {
    isThird.current = false;
    const width = $('#ScrollContainer').width();
    $('#THIRD_Frame').animate({ left: `${width}px` }, 350, function () {
      $('#THIRD_Frame').hide();
    });
  }, []);

  const startLandscape = useCallback(() => {
    isLandscape.current = true;
    $('#LANDSCAPE_ScrollContainer').removeAttr('class');
    $('#LANDSCAPE_Frame').hide();
    $('#LANDSCAPE_bodyFramework').css({
      left: '0px',
      top: '0px',
      right: '0px',
      bottom: '0px',
    });
    $('#LANDSCAPE_Frame').show();
  }, []);

  const endLandscape = useCallback(() => {
    $('#LANDSCAPE_Frame').hide();
    $('#LANDSCAPE_ScrollContainer').removeAttr('class');
    isLandscape.current = false;
  }, []);

  // ----------------------
  // Scrolls
  // ----------------------

  // const resetScroll = useCallback(() => {
  //   if (scroll.current) scroll.current.destroy();
  //   const options = {
  //     momentum: true,
  //     preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|X-WIDGET)$/ },
  //     click: 'createTouch' in document,
  //   };
  //   scroll.current = new (window as any).IScroll('#ScrollContainer', options);
  // }, []);

  // const resetMenuScroll = useCallback(() => {
  //   if (menuScroll.current) menuScroll.current.destroy();
  //   const options = {
  //     momentum: true,
  //     preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|X-WIDGET)$/ },
  //     click: 'createTouch' in document,
  //   };
  //   menuScroll.current = new (window as any).IScroll('#MENU_ScrollContainer', options);
  // }, []);

  // const resetThirdScroll = useCallback(() => {
  //   if (thirdScroll.current) thirdScroll.current.destroy();
  //   const options = {
  //     momentum: true,
  //     preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|X-WIDGET)$/ },
  //     click: 'createTouch' in document,
  //   };
  //   thirdScroll.current = new (window as any).IScroll('#THIRD_ScrollContainer', options);
  // }, []);

  // ----------------------
  // Sesión
  // ----------------------

  const closeSession = useCallback(() => {
    //endMenu();
    const confirmed = window.confirm('¿Está seguro de cerrar la sesión?');
    if (confirmed) {
      console.log('[MainFramework] Sesión cerrada.');
    }
  }, []);

  // ----------------------
  // API pública del hook
  // ----------------------

  return {
    init,
    startFramework,
    showTopBar,
    hideTopBar,
    showBottomBar,
    hideBottomBar,
    // showMenu,
    // hideMenu,
    loadModal,
    showModal,
    hideModal,
    showLoading,
    hideLoading,
    startThird,
    endThird,
    startLandscape,
    endLandscape,
    // resetScroll,
    // resetMenuScroll,
    // resetThirdScroll,
    closeSession,
    changeBackground,
    lockModal,
  };
}
