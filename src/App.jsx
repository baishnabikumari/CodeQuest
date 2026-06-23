import { useEffect, useState } from "react"
import "./style.css"
import Header from "./Header"
import Home from "./Home"
import Loading from "./Loading"
import Challenge from "./Challenge"
import { genChallenge, getHint, getReview } from "./gemini"

export default function App() {
    const [screen, setScreen] = useState("home")
    const [topic, setTopic] = useState(null)
    const [diff, setDiff] = useState("Easy")
    const [challenge, setChallenge] = useState(null)
    const [xp, setXp] = useState(() => {
        const saved = localStorage.getItem("cq-xp")
        return saved ? parseInt(saved, 10) : 0
    })
    const [streak, setStreak] = useState(() => {
        const saved = localStorage.getItem("cq-streak")
        return saved ? parseInt(saved, 10) : 0
    })

    useEffect(() => {
        localStorage.setItem("cq-xp", xp)
    }, [xp])

    useEffect(() => {
        localStorage.setItem("cq-streak", streak)
    }, [streak])

    const DIFF_PTS = { Easy: 50, Medium: 100, Hard: 200 }
    async function startChallenge(t, d) {
        setTopic(t)
        setDiff(d)
        setScreen("loading")
        const ch = await genChallenge(t, d)
        setChallenge(ch)
        setScreen("challenge")
    }

    function onSolve() {
        setXp(x => x + (DIFF_PTS[diff] || 50))
        setStreak(s => s + 1)
    }

    async function newChallenge() {
        setScreen("loading")
        const ch = await genChallenge(topic, diff)
        setChallenge(ch)
        setScreen("challenge")
    }

    return (
        <div className="app">
            <Header xp={xp} streak={streak} />
            <div className="body">
                {screen === "home" && (
                    <Home onStart={startChallenge} xp={xp} />
                )}
                {screen === "loading" && <Loading />}
                {screen === "challenge" && challenge && (
                    <Challenge
                        challenge={challenge}
                        topic={topic}
                        diff={diff}
                        onSolve={onSolve}
                        onBack={() => setScreen("home")}
                        onNew={newChallenge}
                        getHint={getHint}
                        getReview={getReview}
                    />
                )}
            </div>
        </div>
    )
}