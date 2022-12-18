import {ActionButton, Stack, Image, Text} from "@fluentui/react";
import React from "react";

function Header()
{
    const itemStyles: React.CSSProperties = {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
    };

    return (
        <header className="App-header">
            <Stack horizontal>
                <Image style={itemStyles}/>
                <Text variant={"xLarge"} style={itemStyles}>TodoListSync</Text>
                <ActionButton allowDisabledFocus style={itemStyles} >
                    New sync
                </ActionButton>
            </Stack>
        </header>
    );
}

export default Header;