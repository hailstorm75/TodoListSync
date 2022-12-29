import {useEffect} from "react";

export const useScript = (url: string, onLoad: (((this: GlobalEventHandlers, ev: Event) => any) | null)) => {
  useEffect(() => {
    let script = document.createElement("script");
    script.src = url;
    script.onload = onLoad;

    document.head.appendChild(script);

    return () => { document.head.removeChild(script) };
  }, [url, onLoad])
}
