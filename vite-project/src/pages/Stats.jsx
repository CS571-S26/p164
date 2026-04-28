
function Stats(){
    const totalGames = parseInt(localStorage.getItem("totalGames")) || 0;
    const totalMovies = parseInt(localStorage.getItem("totalMovies")) || 0;
    const totalScore = parseInt(localStorage.getItem("totalScore")) || 0;
    const avgScore = totalGames > 0 ? (totalScore / totalGames).toFixed(1) : 0;
    const highScore = parseInt(localStorage.getItem("highScore")) || 0;

    const movieCounts = JSON.parse(localStorage.getItem("movieCounts") || "{}");
    const sorted = Object.entries(movieCounts).sort((a, b) => b[1] - a[1]);
    const favMovie = sorted[0]?.[1] > 1 ? sorted[0][0] : "None";

    const genreCounts = JSON.parse(localStorage.getItem("genreCounts") || "{}")
    const favGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"

    const directorCounts = JSON.parse(localStorage.getItem("directorCounts") || "{}")
    const favDirector = Object.entries(directorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"

    return (
        <div className="d-flex flex-column align-items-center" style={{marginTop:"75px"}}>
            <h1 style={{fontWeight:"bold"}}>LIFETIME STATISTICS</h1>
            <div style={{marginTop:"30px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px", maxWidth:"600px"}}>
                <div style={{borderRadius:"12px", padding:"20px", textAlign:"center"}}>
                    <h2 style={{fontWeight:"bold"}}>{totalGames}</h2>
                    <p>Total Games Played</p>
                </div>
                <div style={{borderRadius:"12px", padding:"20px", textAlign:"center"}}>
                    <h2 style={{fontWeight:"bold"}}>{totalScore}</h2>
                    <p>Total Score</p>
                </div>
                <div style={{borderRadius:"12px", padding:"20px", textAlign:"center"}}>
                    <h2 style={{fontWeight:"bold"}}>{highScore}</h2>
                    <p>High Score</p>
                </div>
                <div style={{borderRadius:"12px", padding:"20px", textAlign:"center"}}>
                    <h2 style={{fontWeight:"bold"}}>{avgScore}</h2>
                    <p>Average Score</p>
                </div>
                <div style={{borderRadius:"12px", padding:"20px", textAlign:"center"}}>
                    <h2 style={{fontWeight:"bold"}}>{totalMovies}</h2>
                    <p>Total Movies Played</p>
                </div>
                <div style={{borderRadius:"12px", padding:"20px", textAlign:"center"}}>
                    <h2 style={{fontWeight:"bold"}}>{favMovie}</h2>
                    <p>Favorite Movie</p>
                </div>
                <div style={{borderRadius:"12px", padding:"20px", textAlign:"center"}}>
                    <h2 style={{fontWeight:"bold"}}>{favGenre}</h2>
                    <p>Favorite Genre</p>
                </div>
                <div style={{borderRadius:"12px", padding:"20px", textAlign:"center"}}>
                    <h2 style={{fontWeight:"bold"}}>{favDirector}</h2>
                    <p>Favorite Director</p>
                </div>
            </div>
        </div>
    )
}
export default Stats;