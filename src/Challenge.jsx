import { Lightbulb, X } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const TOPIC_ACCENTS = {
    "variables and data type": "#00ff88",
    "for loops and while loops": "#00d4ff",
    "functions and scope": "#ffd93d",
    "arrays and array methods": "#ff6348",
    "string manipulation": "#ff4da6",
    "basic algorithms": "#a855f7",
}

const DIFF_COLORS = {
    Easy: "#00ff88",
    Medium: "#ffd93d",
    Hard: "#ff4757",
}

const DIFF_XP = {
    Easy: 50,
    Medium: 100,
    Hard: 200,
}

const PAIRS = { "{": "}", "(": ")", "[": "]", '"': '"', "'": "'", "`": "`" }
const CLOSERS = new Set(["}", ")", "]", '"', "'", "`"])
const EMPTY_PAIRS = new Set(["()", "[]", "{}", '""', "''", "``"])

function renderDesc(text) {
    if (!text) return null
    return text.split(/`([^`]+)`/).map((p, i) =>
        i % 2 === 1
            ? <code key={i} className="inline-code">{p}</code>
            : p
    )
}

function fmt(s) {
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
}

export default function Challenge({ challenge, topic, diff, onSolve, onBack, onNew, getHint, getReview }) {
    const [code, setCode] = useState(challenge?.starterCode || "")
    const [tab, setTab] = useState("editor")
    const [results, setResults] = useState(null)
    const [solved, setSolved] = useState(false)
    const [hint, setHint] = useState("")
    const [hintBusy, setHintBusy] = useState(false)
    const [hintOpen, setHintOpen] = useState(false)
    const [review, setReview] = useState("")
    const [reviewBusy, setReviewBusy] = useState(false)
    const [running, setRunning] = useState(false)
    const [cursor, setCursor] = useState({ ln: 1, col: 1 })
    const [secs, setSecs] = useState(0)
    const taRef = useRef(null)
    const lineNumRef = useRef(null)

    useEffect(() => {
        const t = setInterval(() => setSecs(s => s + 1), 1000)
        return () => clearInterval(t)
    }, [])

    // useLayoutEffect(() => {
    //     if (cursorRef.current !== null && taRef.current) {
    //         const ta = taRef.current
    //         ta.selectionStart = ta.selectionEnd = cursorRef.current
    //         cursorRef.current = null

    //         const lineH = 13 * 1.65
    //         const padTop = 16
    //         const lineIdx = ta.value.slice(0, ta.selectionStart).split("\n").length - 1
    //         const cursorY = lineIdx * lineH + padTop
    //         const top = ta.scrollTop
    //         const bot = top + ta.clientHeight

    //         if (cursorY < top + padTop || cursorY > bot - lineH * 2){
    //             ta.scrollTop = Math.max(0, cursorY - ta.clientHeight / 2)
    //         }

    //         if (lineNumRef.current) lineNumRef.current.scrollTop = ta.scrollTop
    //     }
    // }, [code])

    function syncScroll(e) {
        if (lineNumRef.current) lineNumRef.current.scrollTop = e.target.scrollTop
    }

    function trackCursor(e) {
        const before = e.target.value.slice(0, e.target.selectionStart)
        const lines = before.split("\n")
        setCursor({ ln: lines.length, col: lines[lines.length - 1].length + 1 })
    }

    function handleKeyDown(e) {
        const ta = taRef.current
        const s = ta.selectionStart
        const end = ta.selectionEnd
        const val = ta.value
        const before = val.slice(0, s)
        const after = val.slice(end)
        const nextCh = val[s]

        function apply(newVal, pos){
            ta.value = newVal
            ta.selectionStart = ta.selectionEnd = pos
            setCode(newVal)
        }

        if (e.key === "Tab") {
            e.preventDefault()
            apply(val.slice(0, s) + "  " + val.slice(end))
            return
        }
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault()
            runTests()
            return
        }
        if (e.key === "Enter") {
            e.preventDefault()
            const lineStart = before.lastIndexOf("\n") + 1
            const curLine = before.slice(lineStart)
            const indent = curLine.match(/^(\s*)/)[1]
            const lastCh = before.trimEnd().slice(-1)

            if (["{", "(", "["].includes(lastCh)) {
                const closer = PAIRS[lastCh]
                if (nextCh === closer) {
                    const ins = "\n" + indent + "  " + "\n" + indent
                    apply(before + ins + after, s + indent.length + 3)
                } else {
                    const ins = "\n" + indent + "  "
                    apply(before + ins + after, s + ins.length)
                }
            } else {
                const ins = "\n" + indent
                apply(before + ins + after, s + ins.length)
            }
            return
        }

        if (CLOSERS.has(e.key) && nextCh === e.key && s === end) {
            e.preventDefault()
            ta.selectionStart = ta.selectionEnd = s + 1
            return
        }

        if (PAIRS[e.key] && s === end) {
            e.preventDefault()
            apply(before + e.key + PAIRS[e.key] + after, s + 1)
            return
        }

        if (e.key === "Backspace" && s === end && s > 0) {
            const pair = val.slice(s - 1, s + 1)
            if (EMPTY_PAIRS.has(pair)) {
                e.preventDefault()
                apply(val.slice(0, s - 1) + val.slice(s + 1), s - 1)
            }
        }
    }

    function runTests() {
        if (!challenge || running) return
        setRunning(true)

        setTimeout(() => {
            const res = challenge.testCases.map(tc => {
                try {
                    const fn = new Function(`${code}\nreturn solution(...${JSON.stringify(tc.args)});`)
                    const got = fn()
                    const ok = JSON.stringify(got) === JSON.stringify(tc.expected)
                    return { ok, args: tc.args, got, expected: tc.expected }
                } catch (err) {
                    return { ok: false, args: tc.args, got: `Error: ${err.message}`, expected: tc.expected }
                }
            })
            setResults(res)
            setTab("results")
            setRunning(false)
            const pass = res.every(r => r.ok)
            setSolved(pass)
            if (pass) onSolve()
        }, 120)
    }

    async function handleHint() {
        if (hintBusy) return
        setHintOpen(true)
        if (hint) return
        setHintBusy(true)
        await getHint(challenge.description, code, txt => setHint(txt))
        setHintBusy(false)
    }

    async function handleReview() {
        if (reviewBusy) return
        setReviewBusy(true)
        setTab("review")
        await getReview(challenge.description, code, txt => setReview(txt))
        setReviewBusy(false)
    }

    const accent = TOPIC_ACCENTS[topic] || "var(--green)"
    const diffColor = DIFF_COLORS[diff] || "var(--green)"
    const lines = code.split("\n")
    const passCount = results ? results.filter(r => r.ok).length : 0

    return (
        <div className="chal-wrap fade-in">

            {/* top bar */}
            <div className="chal-bar">
                <button onClick={onBack} className="ghost-btn">Home</button>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span className="pill" style={{ color: accent, borderColor: accent + "44" }}>{topic}</span>
                    <span className="pill" style={{ color: diffColor, borderColor: diffColor + "44" }}>{diff}</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span className="chal-timer">{fmt(secs)}</span>
                    <button onClick={onNew} className="ghost-btn">NEW</button>
                </div>
            </div>

            {/* split */}
            <div className="chal-split">

                {/* left panel - problem */}
                <div className="chal-left">

                    <div className="chal-head">
                        <div className="chal-title">{challenge.title}</div>
                        <span className="chal-xp" style={{ color: diffColor }}>
                            +{DIFF_XP[diff] || 50} XP
                        </span>
                    </div>

                    <div className="prob-section desc-section">
                        <span className="prob-lbl">DESCRIPTION</span>
                        <div className="chal-desc">{renderDesc(challenge.description)}</div>
                    </div>

                    <div className="prob-section">
                        <div className="hint-row">
                            <button className="hint-btn" onClick={handleHint} disabled={hintBusy}>
                                <Lightbulb size={13} />
                                {hintBusy ? "Thinking..." : hintOpen ? "Hint" : "Get Hint"}
                            </button>
                            {hintOpen && (
                                <button className="hint-close" onClick={() => setHintOpen(false)}>
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        {hintOpen && hint && <div className="hint-box">{hint}</div>}
                    </div>

                    {challenge.funFact && (
                        <div className="tv-wrap">
                            <img src="/tv-removed-bg.png" className="tv-img" alt="" />
                            <div className="tv-screen">
                                <span className="tv-lbl">FUN FACT</span>
                                <p className="tv-text">
                                    {challenge.funFact || "javaScript was created in just 10 days only by Brendan Eich in 1995!"}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* <div className="prob-section hint-section">
                        <button className="hint-btn" onClick={handleHint} disabled={hintBusy}>
                            <Lightbulb size={13} />
                            {hintBusy ? "Thinking..." : hintOpen ? "HInt" : "Get Hint"}
                        </button>
                        {hintOpen && hint && <div className="hint-box">{hint}</div>}
                    </div> */}
                </div>

                {/* right pane - editor */}
                <div className="chal-right">

                    <div className="tab-bar">
                        <div style={{ display: "flex" }}>
                            {["editor", "results", "review"].map(tabName => (
                                <button
                                    key={tabName}
                                    className="tab-btn"
                                    onClick={() => setTab(tabName)}
                                    style={{
                                        color: tab === tabName ? accent : "var(--text-dim)",
                                        borderBottom: `2px solid ${tab === tabName ? accent : "transparent"}`,
                                    }}
                                >
                                    {tabName === "results"
                                        ? `Results${results ? ` ${passCount}/${results.length}` : ""}` : tabName.charAt(0).toUpperCase() + tabName.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: 8, padding: "0 12px", alignItems: "center" }}>
                            <span className="lang-badge">JS</span>
                            {solved && (
                                <button onClick={handleReview} disabled={reviewBusy} className="review-btn">
                                    {reviewBusy ? "..." : "Review"}
                                </button>
                            )}
                            <button onClick={runTests} disabled={running} className="run-btn">
                                {running ? "..." : "Run"}
                            </button>
                        </div>
                    </div>

                    {tab === "editor" && (
                        <div className="editor-wrap">
                            <div className="line-nums" ref={lineNumRef}>
                                {lines.map((_, i) => <span key={i}>{i + 1}</span>)}
                            </div>
                            <textarea
                                ref={taRef}
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onScroll={syncScroll}
                                onClick={trackCursor}
                                onKeyUp={trackCursor}
                                className="code-editor"
                                spellCheck={false}
                                autoCapitalize="none"
                                autoCorrect="off"
                            />
                        </div>
                    )}
                    {tab === "results" && (
                        <div className="tab-content">
                            {!results ? (
                                <div className="empty-msg">Run your code to see the results</div>
                            ) : (
                                <>
                                    {results.map((r, i) => (
                                        <div key={i} className={`test-row ${r.ok ? "test-pass" : "test-fail"}`}>
                                            <span className="test-icon">{r.ok ? "✔︎" : "x"}</span>
                                            <div className="test-cols">
                                                <div className="test-col">
                                                    <span className="test-col-lbl">INPUT</span>
                                                    <code>{r.args.map(a => JSON.stringify(a)).join(", ")}</code>
                                                </div>
                                                <div className="test-col">
                                                    <span className="test-col-lbl">GOT</span>
                                                    <code className={r.ok ? "got-ok" : "got-fail"}>
                                                        {JSON.stringify(r.got)}
                                                    </code>
                                                </div>
                                                <div className="test-col">
                                                    <span className="test-col-lbl">EXPECTED</span>
                                                    <code className="got-ok">{JSON.stringify(r.expected)}</code>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {solved && (
                                        <div className="solved-banner">
                                            <span>✔︎ All Tests are passed!</span>
                                            <button onClick={onNew} className="next-btn">Next Challenge ➤</button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {tab === "review" && (
                        <div className="tab-content">
                            {!review ? (
                                <div className="empty-msg">
                                    {solved ? "Well Done - Please wait..." : "Please...Solve the challenge first!"}
                                </div>
                            ) : (
                                <div className="review-box">{review}</div>
                            )}
                        </div>
                    )}
                    {tab === "editor" && (
                        <div className="status-bar">
                            <span>Ln {cursor.ln} Col {cursor.col}</span>
                            <span>JavaScript</span>
                            <span className="status-hint">Ctrl+Enter to Run</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}