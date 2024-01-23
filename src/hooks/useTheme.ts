import useDarkMode from 'use-dark-mode'
import { useState, useEffect } from 'react'

const lightTheme = 'light-mode'
const darkTheme = 'dark-mode'

 const useTheme = () => {
    const darkMode = useDarkMode();
    const [theme, setTheme] = useState(darkTheme);
    useEffect(() => {
        setTheme(darkMode?.value ? darkTheme : lightTheme);
    }, [darkMode.value]);

    return theme;
};

export default useTheme