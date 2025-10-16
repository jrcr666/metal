// react/bridge/domBridge.ts
import $ from 'jquery';

export const hideKeyboard = () => {
  $('#mainFramework').after(
    '<input type="checkbox" id="focusable" style="height:0; margin-left:-200px; clear: both;" />'
  );
  $('#focusable').focus();
};
