import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Terminal } from "xterm"
import { AttachAddon } from 'xterm-addon-attach'
import { FitAddon } from "xterm-addon-fit"
import { WebLinksAddon } from "xterm-addon-web-links"

import 'xterm/css/xterm.css'

export type TerminalComponentProps = {
    id: string
    url: string
    [other: string]: any
}

let TerminalComponent: React.FC<TerminalComponentProps> = (props: TerminalComponentProps, ref) => {

    const { id, url } = props

    const terminalContainerRef = useRef<HTMLDivElement>(null)
    const xtermRef = useRef<Terminal>()
    const fitAddonRef = useRef<FitAddon>()

    const [websocket, setWebsocket] = useState<WebSocket>()
    const [size, setSize] = useState<any>()

    useEffect(() => {
        const xterm = new Terminal({
            cursorStyle: 'underline',
            cursorBlink: true
        })
        xterm.onResize((e: any) => {
            setSize(e)
        })
        const fitAddon = new FitAddon()
        xterm.loadAddon(fitAddon)
        xterm.loadAddon(new WebLinksAddon((e, uri) => {
            console.log(e, uri)
        }))
        xterm.open(terminalContainerRef.current!)
        xterm?.focus()
        fitAddon.fit()
        resizeObserver.observe(terminalContainerRef.current!)
        fitAddonRef.current = fitAddon
        xtermRef.current = xterm
        return () => {
            fitAddonRef.current?.dispose()
            xtermRef.current?.dispose()
            websocket?.close()
        }
    }, [])

    useEffect(() => {
        if (url) {
            if (websocket) {
                websocket.close()
            }
            const ws = new WebSocket(url!)
            ws.onopen = onopen
            ws.onmessage = onmessage
            ws.onclose = onclose
            ws.onerror = onerror
            setWebsocket(ws)
        }
    }, [url])

    useEffect(() => {
        websocket && xtermRef.current?.loadAddon(new AttachAddon(websocket))
    }, [websocket])

    useEffect(() => {
        console.log(size)
    }, [size])

    useImperativeHandle(ref, () => ({
        hello: () => {
            console.log('hello')
            xtermRef.current?.reset()
        }
    }))

    const resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries) || !entries.length) {
            return;
        }
        setTimeout(() => {
            fitAddonRef.current?.fit()
        }, 50);
    })


    const onopen = () => {
        console.log('connect...')
    }

    const onmessage = (e: any) => {
        console.log('message ->', e)
    }

    const onclose = (e: any) => {
        console.log('close ->', e)
    }

    const onerror = (e: any) => {
        console.log('error ->', e)
    }

    return <div id={id} ref={terminalContainerRef} style={{ width: '100%', height: '100%' }}></div>
}

TerminalComponent = forwardRef(TerminalComponent as any)

export default TerminalComponent