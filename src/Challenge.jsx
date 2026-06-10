import { Lightbulb } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const TOPIC_ACCENTS = {
    "variables and data types": "#00ff88",
    "for loops and while loops": "#00d4ff",
    "functions and scope": "#ffd93d",
    "array and array methods": "#ff6348",
    "string manipulation": "#ff4da6",
    "basic algorithm": "#a855f7",
}

const DIFF_COLORS = {
    Easy: "#00ff88",
    Medium: "#ffd93d",
    Hard: "#ff4757",
}

export default function Challenge({ challenge, topic, diff, onSolve, onBack, onNew, getHint, getReview }) {
    const [code, setCode] = useState(challenge?.starterCode || "")
    const [activeTab, setActiveTab] = useState("editor")
    const [results, setResults] = useState(null)
    const [solved, setSolved] = useState(false)
    const [hint, setHint] = useState("")
    const [hintBusy, setHintBusy] = useState(false)
    const [review, setReview] = useState("")
    const [reviewBusy, setReviewBusy] = useState(false)
    const taRef = useRef(null)
    const cursorRef = useRef(null)

    useEffect(() => {
        if (cursorRef.current !== null && taRef.current) {
            taRef.current.selectionStart = taRef.current.selectionEnd = cursorRef.current
            cursorRef.current = null
        }
    })

    function handleTab(e) {
        if (e.key !== "Tab") return
        e.preventDefault()
        const s = e.target.selectionStart
        setCode(v => v.slice(0, s) + "  " + v.slice(e.target.selectionEnd))
        cursorRef.current = s + 2
    }

    function runTests() {
        if (!challenge) return
        const res = challenge.testCases.map(tc => {
            try {
                const fn = new Function(`${code}\nreturn solution(...${JSON.stringify(tc.args)});`)
                const got = fn()
                const ok = JSON.stringify(got) === JSON.stringify(tc.expected)
                return { ok, args: tc.args, got, expected: tc.expected }
            } catch (e) {
                return { ok: false, args: tc.args, got: `Error: ${e.message}`, expected: tc.expected }
            }
        })
        setResults(res)
        setActiveTab("results")
        const pass = res.every(r => r.ok)
        setSolved(pass)
        if (pass) onSolve()
    }

    async function handleHint() {
        if (hintBusy) return
        setHintBusy(true)
        const txt = await getHint(challenge.description, code)
        setHint(txt)
        setHintBusy(false)
    }

    async function handleReview() {
        if (reviewBusy) return
        setReviewBusy(true)
        const txt = await getReview(challenge.description, code)
        setReview(txt)
        setActiveTab("review")
        setReviewBusy(false)
    }

    const accent = TOPIC_ACCENTS[topic] || "#00ff88"
    const diffColor = DIFF_COLORS[diff] || "#00ff88"

    return (
        <div className="chal-wrap fade-in">

            {/* top bar */}
            <div className="chal-bar">
                <button onClick={onBack} className="ghost-btn">Home</button>
                <div style={{ display: "flex", gap: 8 }}>
                    <span className="pill" style={{ color: accent, borderColor: accent + "55" }}>{topic}</span>
                    <span className="pill" style={{ color: diffColor, borderColor: diffColor + "55" }}>{diff}</span>
                </div>
                <button onClick={onNew} className="ghost-btn">New</button>
            </div>

            {/* split */}
            <div className="chal-split">

                {/* left panel - problem */}
                <div className="chal-left">
                    <div className="chal-title">{challenge.title}</div>
                    <div className="chal-desc">{challenge.description}</div>

                    {challenge.funFact && (
                        <div className="fact-box">
                            <span style={{ color: "var(--cyan)" }}><Lightbulb /></span> {challenge.funFact}
                        </div>
                    )}
                    <div className="hint-wrap">
                        <button onClick={handleHint} disabled={hintBusy} className="hint-btn">
                            {hintBusy ? "Thinking..." : "Get Hint"}
                        </button>
                        {hint && <div className="hint-box">{hint}</div>}
                    </div>
                </div>

                {/* right pane - editor */}
                <div className="chal-right">

                    <div className="tab-bar">
                        <div style={{ display: "flex" }}>
                            {["editor", "results", "review"].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className="tab-btn"
                                    style={{
                                        color: activeTab === tab ? "var(--green)" : "var(--text-dim)",
                                        borderBottom: `2px solid ${activeTab === tab ? "var(--green)" : "transparent"}`,
                                    }}
                                >
                                    {tab === "results"
                                        ? `Results${results ? ` ${results.filter(r => r.ok).length}/${results.length}` : ""}` : tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: 8, padding: "0 12px" }}>
                            {solved && (
                                <button onClick={handleReview} disabled={reviewBusy} className="review-btn">
                                    {reviewBusy ? "..." : "Review"}
                                </button>
                            )}
                            <button onClick={runTests} className="run-btn"> Run</button>
                        </div>
                    </div>

                    {activeTab === "editor" && (
                        <textarea
                            ref={taRef}
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            onKeyDown={handleTab}
                            className="code-editor"
                        />
                    )}
                    {activeTab === "results" && (
                        <div className="tab-content">
                            {!results
                                ? <div className="empty-msg">Run Your Code to See Results</div>
                                : <>
                                    {results.map((res, i) => (
                                        <div key={i} className="test-row" style={{
                                            background: res.ok ? "#00ff8808" : "#ff475708",
                                            borderColor: res.ok ? "#00ff8828" : "#ff475728",
                                        }}>
                                            <span style={{ color: res.ok ? "var(--green)" : "var(--red)", fontSize: 18 }}>
                                                {res.ok ? "✓" : "X"}
                                            </span>
                                            <div className="test-meta">
                                                <span style={{ color: "#777" }}>
                                                    solution({res.args.map(a => JSON.stringify(a)).join(", ")})
                                                </span>
                                                <span style={{ color: "#555" }}> → </span>
                                                <span style={{ color: res.ok ? "var(--green)" : "var(--red)" }}>
                                                    {JSON.stringify(res.got)}
                                                </span>
                                                {!res.ok && (
                                                    <span style={{ color: "#444", fontSize: 11 }}>
                                                        {"  "}(expected: {JSON.stringify(res.expected)})
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {solved && (
                                        <div className="solved-banner">
                                            <span>All Tests Passed!</span>
                                            <button onClick={onNew} className="next-btn">Next </button>
                                        </div>
                                    )}
                                </>
                            }
                        </div>
                    )}

                    {activeTab === "review" && (
                        <div className="tab-content">
                            {!review
                                ? <div className="empty-msg">
                                    {solved ? "Click Review for AI feedback" : "Solve the challenge first!"}
                                    </div>
                                : <div className="review-box">{review}</div>
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}