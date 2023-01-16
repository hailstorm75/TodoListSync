import {useEffect} from "react";

export default function TodoistCallback() {
  useEffect(() => {
    window.addEventListener("message", (event: MessageEvent) => {
      console.group("AuthWindow");
      console.log("Got a message");
      console.log(event);
      console.log(event.data);
      if (event.data !== 'TODOIST_CALLBACK')
        return;

      console.log("sending message");
      event.source?.postMessage({type: event.data, url: window.location.href})

      console.groupEnd();
    })
  }, [])

  return (
    <p>
      Returning from Todoist...
    </p>
  )
}
