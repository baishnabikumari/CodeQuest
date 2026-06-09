export default function Loading(){
    return(
        <div className="load-wrap">
            <div className="load-dots">
                <span className="dot" style={{ animationDelay: "0ms" }} />
                <span className="dot" style={{ animationDelay: "150" }} />
                <span className="dot" style={{ animationDelay: "300ms"}} />
            </div>
            <span className="load-txt">Generating challenge...</span>
        </div>
    )
}