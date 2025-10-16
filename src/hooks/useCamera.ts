import { useState } from 'react';
import { hideKeyboard } from '../src/bridge/domBridge';
import mainFramework from '../legacy/MainFramework';
import { IamDevice } from '../constants';

export const useCamera = () => {
  const [cameraBusy, setCameraBusy] = useState(false);

  const getPhoto = () => {
    if (!cameraBusy) {
      setCameraBusy(true);
      sessionStorage.removeItem('imagepath');
      navigator.camera.getPicture(getPhotoonSuccess, getPhotoonFail, {
        quality: 80,
        targetWidth: 1024,
        destinationType: Camera.DestinationType.FILE_URI,
      });
    }
  };

  const getPhotoonSuccess = (imageURI: string) => {
    setCameraBusy(false);
    mainFramework.SendPhoto(imageURI); // aquí seguimos usando legacy
  };

  const getPhotoonFail = (message: string) => {
    setCameraBusy(false);
    console.warn('Camera failed:', message);
  };

  const hideKeyboardWrapper = () => {
    if (IamDevice) {
      //window.KeyBoard.hideKeyBoard();
    }
    hideKeyboard(); // llama al bridge jQuery
  };

  return { cameraBusy, getPhoto, hideKeyboardWrapper };
};
