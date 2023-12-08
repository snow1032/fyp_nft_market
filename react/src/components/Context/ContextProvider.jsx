import { createContext, useContext, useState, useEffect } from "react";

const StateContext = createContext({
    currentUser: null,
    token: null,
    notification: null,
    setUser: () => { },
    setToken: () => { },
    setNotification: () => { }
})

export function ContextProvider(props) {
    // console.log('token set');
    // console.log(props);
    // console.log('token set');


    const [user, setUser] = useState('');
    //const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [token, _setToken] = useState('');
    console.log('token set');

    const setToken = (token) => {
        _setToken(token)
        console.log('token set');

        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
            // console.log(token);
        }
    }

    useEffect(() => {
        // Update the document title using the browser API
        console.log('token set');
        setToken(props.token)
    });

    return (
        <StateContext.Provider value={{
            user,
            setUser,
            _setToken,
            token,
        }}>
            {props}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)