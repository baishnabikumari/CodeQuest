import { motion, AnimatePresence} from "framer-motion"
import { Brackets, Brain, CheckCheck, Dot, Icon, Play, Quote, Repeat, Shuffle, SquareFunction, Ticket, Variable } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

const TOPICS = [
    {id: "variables and data type", label: "Variables", Icon: Variable, accent: "#E35336", times: { Easy: "2 min", Medium: "4 min", Hard: "7 min" }},
    {id: "for loops and while loops", label: "Loops", Icon: Repeat, accent: "#F4A460", times: { Easy: "3 min", Medium: "5 min", Hard: "9 min" }},
    {id: "functions and scope", label: "Functions", Icon: SquareFunction, accent: "#A0522D", times: { Easy: "4 min", Medium: "6 min", Hard: "10 min"}},
    {id: "arrays and array methods", label: "Arrays", Icon: Brackets, accent: "#E35336", times: { Easy: "4 min", Medium: "7 min", Hard: "12 min"}},
    {id: "string manipulation", label: "Strings", Icon: Quote, accent: "#F4A460", times: { Easy: "3 min", Medium: "5 min", Hard: "9 min"}},
    {id: "basic algorithms", label: "Algorithms", Icon: Brain, accent: "#A0522D", times: { Easy: "6 min", Medium: "9 min", Hard: "15 min"}},
]

const DIFFS = [
    {label: "Easy", pts: 50, color: "#00ff88"},
    {label: "Medium", pts: 100, color: "#ffd93d"},
    {label: "Hard", pts: 200, color: "#ff4757"},
]

function BinaryRain(){
    const chars = useMemo(() =>
        Array.from({ length: 55 }, (_, i) => ({
            id: i,
            x: Math.floor(Math.random() * 94),
            val: Math.random() > 0.5 ? "1" : "0",
            delay: parseFloat((Math.random() * 3).toFixed(1)),
            dur: parseFloat((1.2 + Math.random() * 2).toFixed(1)),
        })), []
    )
    return (
        <div className="binary-rain">
            {chars.map(c => (
                <span key={c.id} className="bin-char" style={{
                    left: `${c.x}%`,
                    animationDuration: `${c.dur}s`,
                    animationDelay: `${c.delay}s`,
                }}>{c.val}</span>
            ))}
        </div>
    )
}

// card animation
function cardAnim(pos){
    const abs = Math.abs(pos)
    return {
        x: pos * 215,
        scale: abs === 0 ? 1.05 : abs === 1 ? 0.88 : 0.72,
        filter: abs === 2 ? "blur(3px)" : "blur(0px)",
        opacity: abs === 2 ? 0.45 : 1,
        zIndex: 5 - abs,
    }
}

export default function Home({ onStart }){
    const [mode, setMode] = useState("choose")
    const [activeIdx, setActiveIdx] = useState(0)
    const [tickerIdx, setTickerIdx] = useState(0)
    const [overlay, setOverlay] = useState(false)
    const [diff, setDiff] = useState("Easy")
    const [shuffling, setShuffling] = useState(false)
    const [toast, setToast] = useState(false)

    useEffect(() => {
        const t = setInterval(() => setTickerIdx(i => (i + 1) % 3), 1000)
        return () => clearInterval(t)
    }, [])

    useEffect(() => {
        function onKey(e){
            if(overlay){
                if (e.key === "Escape") setOverlay(false)
                return
            }
            if(shuffling) return
            if(mode === "shuffle") return
            if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A")
                setActiveIdx(i => (i - 1 + 6) % 6)
            if (e.key === "ArrowRight" || e.key === "d" || e.key === "D")
                setActiveIdx(i => (i + 1) % 6)
            if (e.key === "Enter" || e.key === " ")
                setOverlay(true)
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [overlay, shuffling, mode])

    function handleShuffle(){
        if(shuffling) return
        setShuffling(true)
        setOverlay(false)
        setToast(false)
        let count = 0
        const t = setInterval(() => {
            setActiveIdx(Math. floor(Math.random() * 6))
            count++
            if (count >= 14) { 
                clearInterval(t);
                setShuffling(false) 
                setToast(true)
                setTimeout(() => setToast(false), 2000)
                setTimeout(() => setOverlay(true), 400)
            }
        }, 110)
    }

    const getPos = idx => {
       let p = (idx - activeIdx + 6) % 6
       return p > 3 ? p - 6 : p
    }
    const tickerDiff = DIFFS[tickerIdx]

    return (
        <div className="home-v2 fade-in">
            <div className={`home-bg ${overlay ? "is-blurred" : ""}`}>
                <div className="mode-toggle">
                    <button
                        className={`mode-btn ${mode === "choose" ? "mode-active" : ""}`}
                        onClick={() => setMode("choose")}
                    >
                        Choose
                    </button>
                    <button
                        disabled={shuffling}
                        className={`mode-btn ${mode === "shuffle" ? "mode-active" : ""} ${shuffling ? "shuffling" : ""}`}
                        onClick={() => { setMode("shuffle"); if(mode !== "shuffle") handleShuffle() }}
                    >
                        Gen-do
                    </button>
                </div>
                <p className="kbd-hint">A · D → to navigate · Enter to Select</p>
            </div>
            <AnimatePresence>
                {overlay && (
                    <motion.div
                        className="rain-layer"
                        initial={{ opacity:0 }}
                        animate={{ opacity:1 }}
                        exit={{ opacity:0 }}
                        transition={{ duration:0.2 }}
                    >
                        <BinaryRain />
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="carousel-wrap">
                {TOPICS.map((t, idx) => {
                     const pos = getPos(idx)
                     const visible = Math.abs(pos) <= 2
                     const anim = cardAnim(pos)
                     const isCenter = pos === 0
                     const expanded = isCenter && overlay

                     return (
                        <motion.div
                            key={t.id}
                            className="card-v2"
                            style={{ position: "absolute", overflow: "hidden" }}
                            animate={{
                                ...anim,
                                x: visible ? anim.x : pos > 0 ? 660 : -660,
                                scale: expanded ? 1.8 : anim.scale,
                                filter: expanded ? "blur(0px)" : overlay ? "blur(5px)" : (visible ? anim.filter : "blur(0px)"),
                                opacity: expanded ? 1 : overlay ? 0 : (visible ? anim.opacity : 0),
                                zIndex: expanded ? 50 : anim.zIndex,
                                pointerEvents: expanded ? "auto" : overlay ? "none" : (visible ? "auto" : "none"),
                            }}
                            transition={{ type: "spring", stiffness: 280, damping: 28 }}
                            onClick={() => {
                                if(overlay) return
                                if(shuffling) return
                                if(mode === "shuffle" && !isCenter) return
                                if(isCenter) setOverlay(true)
                                    else if(visible) setActiveIdx(idx)
                            }}
                        >
                            {!expanded && (
                                <>
                                    <div className="card-icon-area" style={{ background: t.accent + "22" }}>
                                        <t.Icon size={52} color={t.accent} strokeWidth={1.5} />
                                    </div>

                                    <div className="card-xp"> 50-200 XP</div>
                                    <div className="card-name" style={{ color: isCenter ? t.accent : "var(--text-mid)" }}>
                                        {t.label}
                                    </div>

                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={tickerIdx}
                                            className="card-ticker"
                                            initial={{ opacity:0, y:5 }}
                                            animate={{ opacity:1, y:0 }}
                                            exit={{ opacity:0, y:-5 }}
                                            transition={{ duration: 0.18 }}
                                        >
                                            <span style={{ color: tickerDiff.color, fontWeight: 600}}>{tickerDiff.label}</span>
                                            <span className="ticker-dot"> · </span>
                                            <span>{t.times[tickerDiff.label]}</span>
                                        </motion.div>
                                    </AnimatePresence>
                                </>
                            )}

                            {expanded && (
                                <div className="expand-content">
                                    <div className="expand-icon" style={{ background: t.accent + "22" }}>
                                        <t.Icon size={32} color={t.accent} strokeWidth={1.5}/>
                                    </div>
                                    <div className="expand-name" style={{ color: t.accent }}>{t.label}</div>

                                    <div className="overlay-diffs">
                                        {DIFFS.map(d => (
                                            <button
                                                key={d.label}
                                                className="overlay-diff-btn"
                                                style={{
                                                    borderColor: diff === d.label ? d.color : "#4D2E1A",
                                                    color: diff === d.label ? d.color : "var(--text-mid)",
                                                    background: diff === d.label ? d.color + "18" : "#2A1810",
                                                }}
                                                onClick={() => setDiff(d.label)}
                                            >
                                                <span className="odiff-label">{d.label}</span>
                                                <span className="odiff-pts">+{d.pts} XP</span>
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        className="overlay-start"
                                        style={{ background: t.accent }}
                                        onClick={() => onStart(t.id, diff)}
                                    >
                                        Start
                                    </button>
                                    <button className="overlay-cancel" onClick={() => setOverlay(false)}>
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </motion.div>
                     )
                })}
            </div>

            <AnimatePresence mode="wait">
                {!overlay && (
                    <motion.p
                        key={activeIdx}
                        className="active-label"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                    >
                        {TOPICS[activeIdx].label}
                    </motion.p>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {toast && (
                    <motion.div
                        className="gen-toast"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25 }}
                    >
                        <CheckCheck/> Gen-Do picked this!
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {mode === "shuffle" && !shuffling && !overlay &&(
                    <motion.button
                        className="shuffle-again-btn"
                        onClick={handleShuffle}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.25 }}
                    >
                       <Shuffle/> Shuffle Again
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    )
}