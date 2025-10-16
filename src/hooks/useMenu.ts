import { useCallback } from 'react';
import $ from 'jquery';
import mainFramework from '../legacy/MainFramework';
import { useMainScreen } from './useMainScreen';

export const useMenu = () => {
  const { loadMenu } = useMainScreen(); // usa el hook de mainScreen

  const startMenu = useCallback(() => {
    $('#MENU_TopBar').show();
    $('#MENU_Frame').hide();
    $('#MENU_FullScreen').hide();

    mainFramework.StartMenu();

    loadMenu().done(() => {
      // Añade efectos táctiles a los items del menú
      $('.MenuItem_Title').on('touchstart', e => {
        $(e.currentTarget).addClass('MenuItem_Title-active');
      });
      $('.MenuItem_Title').on('touchend', e => {
        $(e.currentTarget).removeClass('MenuItem_Title-active');
      });
      $('.MenuItem').on('touchstart', e => {
        $(e.currentTarget).addClass('MenuItem-active');
      });
      $('.MenuItem').on('touchend', e => {
        $(e.currentTarget).removeClass('MenuItem-active');
      });

      //   console.log(mainFramework.ResetMenuScroll);
      //   mainFramework.ResetMenuScroll(); // ??????
    });
  }, [loadMenu]);

  return {
    startMenu,
  };
};
