import { useState } from "react"
import "./style.css"

export default function App(){
    const [screen, setScreen] = useState("setup")
    const [apiKey, setApiKey] = useState("")
    const [topic, setTopic] = useState(null)
    const [diff, setDiff] = useState("Easy")
    const [challenge, setChallenge] = useState(null)
    const [xp, setXp] = useState(0)
    const [streak, setStreak] = useState(0)

    return(
        <div className="app">
            <div className="header-placeholder">
                Code Quest &nbsp;|&nbsp; ⚡ {xp} XP
            </div>
            <div className="body">
                {screen === "setup" && <div className="placeholder">Setup Screen</div>}
                {screen === "home" && <div className="placeholder">Home Screen</div>}
                {screen === "loading" && <div className="place">Loading</div>}
                {screen === "challenge" && <div className="placeholder">challenge</div>}
            </div>
        </div>
    )
}