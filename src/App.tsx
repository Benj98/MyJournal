import { useState } from 'react';
import Pages from './components/Pages';
import ThemeToggle from './components/ThemeToggle';
import './App.css';


function App() {
  const [ darkMode, setDarkMode ] = useState<boolean>(false);
  
  return (
    <>
      <div className={`App${darkMode ? ' dark-mode' : ''}`}>
        <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        <Pages />
      </div>
    </>
  )
}

export default App
