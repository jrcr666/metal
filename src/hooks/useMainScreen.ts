// src/hooks/useMainScreen.ts
import { useCallback } from 'react';
import $ from 'jquery';
import mainFramework, { ShowLoading } from '../legacy/MainFramework';
import { useUser } from '../store/userStore'; // tu hook para userManager

export const useMainScreen = () => {
  const { user } = useUser(); // accede al userManager desde el store

  // Inicia el mainScreen
  const start = useCallback(() => {
    const waitingProcess = $.Deferred();

    $('#TopBar').show();
    $('#RefreshButton').hide();
    $('.MAIN_Body').css({ top: '74px', bottom: '0px' });

    mainFramework.ShowTopBar(true);

    waitingProcess.resolve();
    return waitingProcess.promise();
  }, []);

  // Carga el menú desde el backend
  const loadMenu = useCallback(() => {
    const waitingProcess = $.Deferred();
    ShowLoading();

    const deviceId = user.DeviceId;

    const dataString = 'mobile.UserId=' + user.UserId + '&mobile.DeviceId=' + deviceId;
    const url = user.Protocol + user.Host + '/app/StationMenu/' + deviceId;

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: dataString,
    })
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        if (data.ItsOK === 'Y') {
          $('#Name_Zone').html(data.Title);
          $('#MENU_bodyFramework').html(data.Main);
        }
      })
      .catch(err => {
        console.error('Error al cargar menú:', err);
      })
      .finally(() => {
        mainFramework.HideLoading();
        waitingProcess.resolve();
      });

    return waitingProcess.promise();
  }, [user]);

  // Carga la pantalla principal
  const loadMain = useCallback(
    (relativeURL: string) => {
      ShowLoading();

      const deviceId = user.DeviceId || window.location.href.split('/').filter(Boolean).pop();
      const dataString = 'mobile.UserId=' + user.UserId + '&mobile.DeviceId=' + deviceId;
      const url = user.Protocol + user.Host + relativeURL;

      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      })
        .then(res => {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(data => {
          if (data.ItsOK === 'Y') {
            $('#TopBar').html(data.Title);
            $('#bodyFramework').html(data.Main);
            $('#bodyFramework').removeClass('FullHeight');
            $('.MAIN_Body').css({ top: '74px', bottom: '0px' });
            mainFramework.HideBottomBar();
            mainFramework.ResetScroll();
          } else {
            $('#Register_BadField').html(data.Error).show();
          }
        })
        .catch(err => {
          console.error('Error al cargar pantalla principal:', err);
        })
        .finally(() => {
          mainFramework.HideLoading();
        });
    },
    [user]
  );

  return {
    start,
    loadMenu,
    loadMain,
  };
};
