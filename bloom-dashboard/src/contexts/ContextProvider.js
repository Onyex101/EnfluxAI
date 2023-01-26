import React, { createContext, useContext, useState } from 'react'

const StateContext = createContext()

const initialState = {
    chat: false,
    cart: false,
    userProfile: false,
    notification: false,
}

export const ContextProvider = ({ children }) => {
    const [screenSize, setScreenSize] = useState(undefined);
    const [currentColor, setCurrentColor] = useState('#F8983A');
    const [currentMode, setCurrentMode] = useState('Light');
    const [themeSettings, setThemeSettings] = useState(false);
    const [activeMenu, setActiveMenu] = useState(true);
    const [isClicked, setIsClicked] = useState(initialState);
    const [limeLoading, setLimeLoading] = useState(false);
    const [limeText, setLimeText] = useState(undefined);
    const [prediction, setPrediction] = useState({});
    const [questionID, setQuestionID] = useState(null);

    const setMode = (mode) => {
        setCurrentMode(mode);
        localStorage.setItem('themeMode', mode);
    };

    const setColor = (color) => {
        setCurrentColor(color);
        localStorage.setItem('colorMode', color);
    };

    const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true });

    return (
        <StateContext.Provider value={{ currentColor, currentMode, activeMenu, screenSize, setScreenSize, handleClick, isClicked, initialState, limeLoading, limeText, prediction, themeSettings, questionID, setLimeText, setLimeLoading, setIsClicked, setActiveMenu, setCurrentColor, setCurrentMode, setMode, setColor, setThemeSettings, setPrediction, setQuestionID }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext)
