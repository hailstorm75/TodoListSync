import {IStackTokens, Stack} from "@fluentui/react";
import MicrosoftTodo from "./MicrosoftTodo";
import GoogleTasks from "./GoogleTasks";
import {useState} from "react";
import ITask from "../interfaces/ITask";

const Body = () => {
  const numericalSpacingStackTokens: IStackTokens = {
    childrenGap: 10,
    padding: 10,
  };

  const [microsoftLoggedIn, setMicrosoftLoggedIn] = useState(false);
  const [googleLoggedIn, setGoogleLoggedIn] = useState(false);

  const [microsoftListSelected, setMicrosoftListSelected] = useState(false);
  const [googleListSelected, setGoogleListSelected] = useState(false);

  const [microsoftTasks, setMicrosoftTasks] = useState<ITask[]>([]);
  const [googleTasks, setGoogleTasks] = useState<ITask[]>([]);

  return (
    <Stack horizontal horizontalAlign="center" tokens={numericalSpacingStackTokens}>
      <Stack.Item align="start">
        {!microsoftLoggedIn &&
          <div>
              Please log-in to view Microsoft TODO entries
          </div>
        }
        {microsoftLoggedIn && !microsoftListSelected &&
          <div>
              Please select a list
          </div>
        }
        <MicrosoftTodo
          setIsLoggedIn={(args) => setMicrosoftLoggedIn(args)}
          setIsListSelected={(args) => setMicrosoftListSelected(args)}
          setTasks={(args) => setMicrosoftTasks(args)}
        />
      </Stack.Item>
      <Stack.Item align="start">
        {!googleLoggedIn &&
          <div>
              Please log-in to view Google Tasks entries
          </div>
        }
        {googleLoggedIn && !googleListSelected &&
          <div>
              Please select a list
          </div>
        }
        <GoogleTasks
          setIsLoggedIn={(args) => setGoogleLoggedIn(args)}
          setIsListSelected={(args) => setGoogleListSelected(args)}
          setTasks={(args) => setGoogleTasks(args)}
        />
      </Stack.Item>
    </Stack>
  );
}

export default Body;