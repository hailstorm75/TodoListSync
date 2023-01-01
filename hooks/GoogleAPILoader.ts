import {useEffect, useState} from 'react';
import { IGoogleAPI } from "../interfaces/IGoogleAPI";

type GsiScriptState = {
  isOAuthClientLoaded: boolean;
  gsi: IGoogleAPI | null | undefined;
};

export function useLoadGsiScript(): GsiScriptState {
  const [isOAuthClientLoaded, setIsOAuthClientLoaded] = useState(false);
  const [gsi, setGsi] = useState<IGoogleAPI | null | undefined>(undefined);

  useEffect(() => {
    const scriptTag = document.createElement('script');

    scriptTag.src = 'https://accounts.google.com/gsi/client';
    scriptTag.async = true;
    scriptTag.defer = true;

    scriptTag.onload = () => {
      console.log("Google API script loaded successfully")
      setIsOAuthClientLoaded(true);

      const windowProxy: any = window;
      setGsi(windowProxy.google);
    };

    scriptTag.onerror = (ev: Event | string) => {
      console.error(`Failed to load Google API script: ${ev.toString()}`)
      setIsOAuthClientLoaded(false);
      setGsi(null);
    };

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return {
    isOAuthClientLoaded,
    gsi
  };
}