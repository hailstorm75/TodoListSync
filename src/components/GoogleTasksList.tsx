import React, { useState, useEffect } from 'react';
import IGoogleAuth from "../interfaces/IGoogleAuth";
import IGoogleList from "../interfaces/IGoogleList";

function TodoList(auth: IGoogleAuth) {
    const [todoLists, setTodoLists] = useState<IGoogleList[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        async function fetchTodoLists() {
            try {
                // Make an API call to Google Tasks to retrieve the list of TODO lists
                const response = await fetch('https://www.googleapis.com/tasks/v1/users/@me/lists', {
                    headers: {
                        Authorization: `Bearer ${auth.access_token}`,
                    },
                });
                const data = await response.json();
                setTodoLists(data.items);
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        }

        fetchTodoLists();
    }, [auth]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div>
            {todoLists.map((todoList) => (
                <div key={todoList.id}>
                    <h3>{todoList.title}</h3>
                    <ul>
                        {todoList.items.map((todo) => (
                            <li key={todo.id}>{todo.title}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default TodoList;
