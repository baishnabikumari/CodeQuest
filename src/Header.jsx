export default function Header({ xp, streak}){
    return(
        <header className="header">
            <span className="logo">CODE QUEST</span>
            <div className="header-right">
                {streak >= 2 &&(
                    <span className="badge" style={{color: "var(--orange)", borderColor: "#ff634844"}}>
                        🔥{streak}x
                    </span>
                )}
                <span className="badge" style={{color: "var(--green", borderColor: "#00ff8844"}}>
                    {xp} XP
                </span>
            </div>
        </header>
    )
}