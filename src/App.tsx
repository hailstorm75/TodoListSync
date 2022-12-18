import React from 'react';
import './App.css';
import {ActionButton, Image, Text, Stack} from '@fluentui/react';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Stack horizontal>
                    <Image/>
                    <Text variant={"xLarge"}>TodoListSync</Text>
                    <ActionButton allowDisabledFocus >
                        New sync
                    </ActionButton>
                </Stack>
            </header>
            <body>

            </body>
        </div>
    );
}

export default App;
