import { useState } from "react"
import "./style.css"
import Header from "./Header"

export default function App(){
    const [screen, setScreen] = useState("home")
    const [apiKey, setApiKey] = useState("")
    const [topic, setTopic] = useState(null)
    const [diff, setDiff] = useState("Easy")
    const [challenge, setChallenge] = useState(null)
    const [xp, setXp] = useState(0)
    const [streak, setStreak] = useState(0)

    return(
        <div className="app">
            <Header xp={xp} streak={streak}/>
            <div className="body">
                {screen === "home" && <div className="placeholder">Home Screen</div>}
                {screen === "loading" && <div className="place">Loading</div>}
                {screen === "challenge" && <div className="placeholder">challenge</div>}
            </div>
        </div>
    )
}