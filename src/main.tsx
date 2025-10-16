import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './assets/libs/css/bootstrap.min.css';
import './assets/libs/css/bootstrap-theme.min.css';
import './assets/libs/css/my-custom-theme.css';
import './assets/libs/css/jquery-ui-1.10.4.custom.css';
import './assets/libs/css/jquery.mobile.custom.structure.min.css';
import './assets/libs/css/jquery.mobile.datepicker.css';
import './assets/libs/css/jquery.mobile.icons.min.css';
import './assets/libs/css/jquery.ptTimeSelect.css';

import './assets/libs/datetimepicker/jquery.datetimepicker.css';
import './assets/libs/iscroll-5/jquery.mobile.iscrollview-pull.css';
import './assets/libs/iscroll-5/jquery.mobile.iscrollview.css';

import './assets/css/Packaging.css';
import './assets/css/Varo.css';
import './assets/css/Stock.css';
import './assets/css/Press.css';
import './assets/css/PlatencutPress.css';
import './assets/css/Bevelling.css';
import './assets/css/PlatenCut.css';
import './assets/css/PressBrake.css';
import './assets/css/Schlatter.css';
import './assets/css/Reception.css';
import './assets/css/SelectOrder.css';
import './assets/css/RodCut.css';

import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
