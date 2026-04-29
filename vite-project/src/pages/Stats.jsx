import StatCard from "../components/StatCard";

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

                <StatCard value={"$"+highScore} label={"High Score"}></StatCard>
                <StatCard value={"$"+totalScore} label={"Total Coins"}></StatCard>
                <StatCard value={"$"+avgScore} label={"Average Coins"}></StatCard>
                <StatCard value={totalGames} label={"Total Games Played"}></StatCard>
                <StatCard value={totalMovies} label={"Total Movies Played"}></StatCard>
                <StatCard value={favMovie} label={"Favorite Movie"}></StatCard>
                <StatCard value={favGenre} label={"Favorite Genre"}></StatCard>
                <StatCard value={favDirector} label={"Favorite Director"}></StatCard>
                
            </div>
        </div>
    )
}
export default Stats;