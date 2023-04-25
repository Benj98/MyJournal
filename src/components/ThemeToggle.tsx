
type ThemeToggleProps = {
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
};

const ThemeToggle = ({ darkMode, setDarkMode }: ThemeToggleProps) => {
    return (
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            { darkMode ? 'Light' : 'Dark' }
        </button>
    );
}

export default ThemeToggle