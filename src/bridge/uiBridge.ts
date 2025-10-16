// react/bridge/uiBridge.ts
import $ from 'jquery';

export const showTopBar = (menuVisible: boolean) => {
  $('#TopBar').show();
  if (menuVisible) {
    $('#BackButton').hide();
    $('#MenuButton').show();
  } else {
    $('#BackButton').hide();
    $('#MenuButton').hide();
  }
};

export const hideTopBar = () => $('#TopBar').hide();
export const showBottomBar = (inicioVisible: boolean) => {
  $('#BottomBar').show();
  inicioVisible ? $('#InicioButton').show() : $('#InicioButton').hide();
};
export const hideBottomBar = () => $('#BottomBar').hide();
export const showModal = () => $('#ModalBack').show();
export const hideModal = () => $('#ModalBack').hide();
export const hideKeyboard = () => {
  $('#mainFramework').after(
    '<input type="checkbox" id="focusable" style="height:0; margin-left:-200px; clear: both;" />'
  );
  $('#focusable').focus();
};
