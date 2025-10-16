import { useEffect } from 'react';
//import mainFramework from '../legacy/MainFramework';
import { useDevice } from '../store/deviceStore';

export const useDeviceEvents = () => {
  const { setState } = useDevice();

  useEffect(() => {
    const handleDeviceReady = () => {
      setState(prev => ({ ...prev, IamDevice: true }));

      // if (window.StatusBar) {
      //   StatusBar.overlaysWebView(false);
      //   StatusBar.backgroundColorByHexString('#000000');
      //   StatusBar.styleLightContent();
      // }

      // window.requestFileSystem(
      //   LocalFileSystem.PERSISTENT,
      //   0,
      //   fs => {
      //     const path =
      //       fs.root.fullPath !== '/'
      //         ? fs.root.fullPath + '/MetalMalla/'
      //         : fs.root.toURL() + '/MetalMalla/';
      //     mainFramework.StorePath = path;
      //   },
      //   e => console.log('FileSystem error', e)
      // );

      const platform =
        navigator.userAgent.match(/iPad/i) != null
          ? 'iPad_'
          : navigator.userAgent.match(/iPhone/i) != null
            ? 'iPhone_'
            : navigator.userAgent.match(/Android/i) != null
              ? 'Android'
              : navigator.userAgent.match(/BlackBerry/i) != null
                ? 'BlackBerry'
                : 'null';

      setState(prev => ({ ...prev, devicePlatform: platform }));
    };

    document.addEventListener('deviceready', handleDeviceReady, false);

    return () => {
      document.removeEventListener('deviceready', handleDeviceReady);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
