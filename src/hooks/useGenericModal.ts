import { useCallback, useRef } from 'react';
import { useUserStore } from '../store/userStore';
import mainFramework from '../legacy/MainFramework';
import { useMainScreen } from '../hooks/useMainScreen';

export function useGenericModal() {
  // const zoom = useRef(0);
  // const currentAlias = useRef('');
  // const scroll = useRef<any>(0);
  const parametro1 = useRef('');
  const { user } = useUserStore();
  const { start } = useMainScreen();

  // 👉 Inicia el modal
  const startModal = useCallback((param1: string) => {
    parametro1.current = param1;
    loadScreen(param1);
  }, []);

  // 👉 Carga el contenido remoto
  const loadScreen = useCallback(
    async (param1: string) => {
      try {
        const dataString = `mobile.UserId=${user.UserId}&mobile.DeviceId=${user.DeviceId}`;
        const url = `${user.Protocol}${user.Host}/${param1}`;
        mainFramework.ShowLoading();

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: dataString }),
        });

        const data = await response.json();

        if (data.ItsOK === 'Y') {
          mainFramework.LockModal = data.LockModal === 'Y';

          const modalBack = document.getElementById('ModalBack');
          const modalZone = document.getElementById('ModalZone');
          if (!modalBack || !modalZone) return;

          let ModalHeight = modalBack.offsetHeight * 0.8;
          let ModalWidth = modalBack.offsetWidth * 0.9;

          if (parseInt(data.Height, 10) > 0) ModalHeight = parseInt(data.Height, 10);
          if (parseInt(data.Width, 10) > 0) ModalWidth = parseInt(data.Width, 10);

          if (parseInt(data.Top, 10) > 0) {
            Object.assign(modalZone.style, {
              top: `${data.Top}px`,
              marginTop: '0px',
              height: `${ModalHeight}px`,
              left: '50%',
              marginLeft: `-${ModalWidth / 2}px`,
              width: `${ModalWidth}px`,
            });
          } else {
            Object.assign(modalZone.style, {
              top: '50%',
              marginTop: `-${ModalHeight / 2}px`,
              height: `${ModalHeight}px`,
              left: '50%',
              marginLeft: `-${ModalWidth / 2}px`,
              width: `${ModalWidth}px`,
            });
          }

          modalZone.innerHTML = data.Main;
          modalZone.onclick = e => e.preventDefault();

          mainFramework.ShowModal();
        } else {
          mainFramework.HideModal();
        }
      } catch (err) {
        console.error('Error cargando modal:', err);
        mainFramework.HideModal();
      } finally {
        mainFramework.HideLoading();
      }
    },
    [user]
  );

  // 👉 Reinicia el scroll
  // const resetScroll = useCallback(() => {
  //   if (scroll.current) {
  //     scroll.current.scrollTo(0, 0);
  //     scroll.current.destroy();
  //     scroll.current = 0;
  //   }

  //   // Si usas IScroll, lo puedes inicializar aquí sobre #GenericModalContainer
  // }, []);

  // 👉 Cierra el modal
  const close = useCallback(() => {
    const p = parametro1.current;
    mainFramework.LockModal = false;
    mainFramework.HideModal();

    if (['Mensaje', 'Reclamo', 'Llamada'].includes(p)) {
      start();
    }
  }, [start]);

  return {
    startModal,
    loadScreen,
    //resetScroll,
    close,
  };
}
