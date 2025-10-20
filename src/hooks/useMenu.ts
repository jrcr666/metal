import { useUserStore } from '@store/userStore';
import { useCallback, useState, useEffect } from 'react';
import { useMainFramework } from './useMainFramework';

export const useMenu = () => {
  const { user } = useUserStore();
  const { showLoading, hideLoading } = useMainFramework();

  const [title, setTitle] = useState('');
  const [ready, setReady] = useState(false);
  const [packages, setPackages] = useState([]);

  // Detectamos cuando DeviceId está disponible
  useEffect(() => {
    if (user.DeviceId) setReady(true);
  }, [user.DeviceId]);

  const loadMenu = useCallback(async () => {
    if (!user.DeviceId) return;
    showLoading();

    try {
      const deviceId = user.DeviceId;
      const dataString = `mobile.UserId=${user.UserId}&mobile.DeviceId=${deviceId}`;
      const url = `${user.Protocol}${user.Host}/app/StationMenu/${deviceId}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataString,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.ItsOK === 'Y') {
        setTitle(data.Title);
        setPackages(data.Packages);
      }
    } catch (err) {
      console.error('Error cargando menú:', err);
    } finally {
      hideLoading();
    }
  }, [user, hideLoading, showLoading]);

  const start = useCallback(async () => {
    if (!ready) return console.warn('Esperando DeviceId...');
    await loadMenu();
  }, [loadMenu, ready]);

  return { start, packages, title };
};
