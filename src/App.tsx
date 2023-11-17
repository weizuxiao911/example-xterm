import React, { useRef, useState } from 'react';
import './App.css';
import TerminalComponent from './components/TerminalComponent';
import MyDiv from './components/MyDiv';
import Terminal from './components/terminal';

function App() {

  const inputRef = useRef<HTMLInputElement>(null)

  const xterm = useRef<any>(null)

  const [url, setUrl] = useState<string>('')

  const onClick = () => {
    setUrl(inputRef?.current?.value ?? '')
  }

  return <div style={{ width: '100vw', height: '100vh', display: 'flex', flexFlow: 'column', alignItems: 'center', alignContent: 'center' }}>
    <div style={{ width: '100%', height: '80px', borderBottom: '3px solid red' }} onMouseDown={(e) => {
      console.log(e)
    }}>
      <input ref={inputRef} /><button onClick={onClick}>连接</button>
      <MyDiv>
        <h1>xxx</h1>
      </MyDiv>
    </div>
    <div style={{ width: '100%', height: '100%', margin: '20px' }}>
      <Terminal ref={xterm} id="xterm1" url={url} />
    </div>

  </div>
}

export default App;
