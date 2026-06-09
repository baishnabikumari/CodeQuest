import { Brackets, Brain, Dot, Play, Quote, Repeat, SquareFunction, Variable } from "lucide-react"
import { useState } from "react"

const TOPICS = [
    {id: "variables and data type", label: "Variables", icon: Variable, accent: "#00ff88" },
    {id: "for loops and while loops", label: "Loops", icon: Repeat, accent: "#00d4ff"},
    {id: "functions and scope", label: "Functions", icon: SquareFunction, accent: "#ff6348" },
    {id: "arrays and array methods", label: "Arrays", icon: Brackets, accent: "#ffd93d"},
    {id: "string manipulation", label: "Strings", icon: Quote, accent: "#ff4da6"},
    {id: "basic algorithms", label: "Algorithms", icon: Brain, accent: "#a855f7"},
]

const DIFFS = [
    {label: "Easy", pts: 50, color: "#00ff88"},
    {label: "Medium", pts: 100, color: "#ffd93d"},
    {label: "Hard", pts: 200, color: "#ff4757"},
]

export default function Home({ onStart }){
    const [topic, setTopic] = useState(null)
    const [diff, setDiff] = useState("Easy")
    const sel = TOPICS.find(t => t.id === topic)

    return(
        <div className="home fade-in">
            <p className="tagline">Pick a Topic <Dot/> Solve Challenges <Dot/> Earn XP</p>

            <div className="section">
                <div className="sect-lbl">CHOOSE TOPIC</div>
                <div className="topic-grid">
                    {TOPICS.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTopic(t.id)}
                            className="topic-card"
                            style={{
                                borderColor: topic === t.id ? t.accent : "var(--border)",
                                background: topic === t.id ? t.accent + "14" : "var(--surface)",
                                boxShadow: topic === t.id ? `0 0 0 1px ${t.accent}` : "none",
                            }}
                        >
                            <t.icon size={26}/>
                            <span
                                className="topic-lbl"
                                style={{color: topic === t.id ? t.accent : "var(--text-mid)"}}
                            >
                                {t.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="section">
                <div className="sect-lbl">DIFFICULTY</div>
                <div className="diff-row">
                    {DIFFS.map(d => (
                        <button
                            key={d.label}
                            onClick={() => setDiff(d.label)}
                            className="diff-btn"
                            style={{
                                color: diff === d.label ? d.color : "var(--text-dim)",
                                borderColor: diff === d.label ? d.color : "var(--border)",
                                boxShadow: diff === d.label ? `0 0 0 1px ${d.color}, 0 0 14px ${d.color}22` : "none",
                            }}
                        >
                            <span className="diff-label">{d.label}</span>
                            <span className="diff-pts">+{d.pts}</span>
                        </button>
                    ))}
                </div>
            </div>
            <button
                onClick={() => topic && onStart(topic, diff)}
                className="start-btn"
                style={{ opacity: topic ? 1 : 0.3, cursor: topic ? "pointer" : "not-allowed"}}
            >
                <Play/> START CHALLENGE
            </button>
        </div>
    )
}