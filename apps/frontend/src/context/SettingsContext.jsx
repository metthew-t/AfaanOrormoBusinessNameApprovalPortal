import { createContext, useContext, useState, useEffect } from 'react';
import { getSettings } from '../services/settingsService';

const SettingsContext = createContext({});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    setLoading(true);
    const res = await getSettings();
    if (res.success && res.data) {
      setSettings(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const getSetting = (key, fallback) => {
    return settings[key] || fallback;
  };

  return (
    <SettingsContext.Provider value={{ settings, getSetting, refreshSettings: fetchSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}
