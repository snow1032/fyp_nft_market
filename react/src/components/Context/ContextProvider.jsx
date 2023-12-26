import { createContext, useContext, useState, useEffect } from "react";

const StateContext = createContext({
    currentUser: null,
    token: null,
    //notification: null,
    setUser: () => { },
    setToken: () => { },
    //setNotification: () => { }
})

export const ContextProvider = ({ children }) => {

    // console.log(props);
    // const [currentUser, setCurrentUser] = useState([props]);
    // localStorage.setItem('ACCESS_TOKEN', JSON.stringify(currentUser));

    const [user, setUser] = useState({});
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    //const [token, _setToken] = useState('');
    console.log('token set');


    const setToken = (token) => {
        _setToken(token)
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
     
            window.location.href = "/home";
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
            // console.log(token);
        }
    }

    // useEffect(() => {
    //     // Update the document title using the browser API
    //     console.log('token set');
    //     setToken(props.token)
    // });

    return (
        <StateContext.Provider value={{
            user,
            setUser,
            setToken,
            token,
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)