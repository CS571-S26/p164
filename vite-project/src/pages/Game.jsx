import { useState, useEffect } from 'react';
import { API_KEY, BASE_URL, IMG_URL, GENRE_MAP } from '../config.js';
import { Button} from 'react-bootstrap';
import MovieCard from '../components/MovieCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import CircleTimer from '../components/CircleTimer.jsx';
import Shop from './Shop.jsx';
import CoinDisplay from '../components/CoinDisplay.jsx';
import ShopButton from '../assets/ShopButton.png'
import ShopButtonAlt from '../assets/ShopButtonAlt.png'
import ImageButton from '../components/ImageButton.jsx';
import PlayAgainButton from '../assets/PlayAgainButton.png';
import PlayAgainButtonAlt from '../assets/PlayAgainButtonAlt.png';
import PlayButton from '../assets/PlayButton.png';
import PlayButtonAlt from '../assets/PlayButtonAlt.png';

function Game(){
    const baseMaxTime = 15;
    const [maxTime, setMaxTime] = useState(baseMaxTime);
    const [timer, setTimer] = useState(baseMaxTime);

    const [movie, setMovie] = useState(null);
    const [score, setScore] = useState(0);
    const [scoreBonus, setScoreBonus] = useState(0);

    const [playedMovies, setPlayedMovies] = useState([]);
    
    const [usedActors, setUsedActors] = useState({});
    const [usedDirectors, setUsedDirectors] = useState({});
    const [highScore, setHighScore] = useState(() => {
        return parseInt(localStorage.getItem("highScore")) || 0;
    })
    const [gameOver, setGameOver] = useState(false);
    const [openShop, setOpenShop] = useState(false);
    const [inventory, setInventory] = useState({});
    const [gamble, setGamble] = useState(false);

    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        getRandomMovie()
    }, [])

    useEffect(()=> {
        if(!gameStarted) return;
        if(timer == 0){
            if(score > highScore){
                setHighScore(score);
                localStorage.setItem("highScore", score);
            }
            saveStats(score);
            setGameOver(true);
            return;
        }
        const interval = setInterval(() => {
            setTimer(t=>t-1);
        }, 1000)
        return () => clearInterval(interval)
    }, [timer, gameStarted])

    function restart(){
        setGameOver(false);
        setScore(0);
        setUsedActors({});
        setUsedDirectors({});
        setPlayedMovies([]);
        setTimer(baseMaxTime);
        setMaxTime(baseMaxTime);
        setInventory({});
        setScoreBonus(0);
        getRandomMovie();
        setGamble(false);
    }

    function saveStats(finalScore){
        const totalGames = parseInt(localStorage.getItem("totalGames") || 0) + 1;
        const totalScore = parseInt(localStorage.getItem("totalScore") || 0) + finalScore;
        const totalMovies = parseInt(localStorage.getItem("totalMovies") || 0) + playedMovies.length;
        localStorage.setItem("totalGames", totalGames);
        localStorage.setItem("totalScore", totalScore);
        localStorage.setItem("totalMovies", totalMovies);
    }

    function guessMovie(guessedMovie){
        fetch(`${BASE_URL}/movie/${guessedMovie.id}/credits?api_key=${API_KEY}`).then(r=>r.json()).then(castData => {
            const cast = castData.cast.map(a=>a.name);
            const sharedActors = cast.filter(a=> movie.castList.includes(a));
            const hasBannedActor = sharedActors.some(a => (usedActors[a] || 0) >= 3);
            
            const directors = castData.crew.filter(c => c.job === "Director").map(c => c.name);
            const sharedDirectors = directors.filter(d => movie.directors?.includes(d));
            const hasBannedDirector = sharedDirectors.some(d => (usedDirectors[d] || 0) >= 3);
            

            if(!hasBannedActor && !hasBannedDirector && (sharedActors.length > 0 || sharedDirectors.length > 0)){
                if(gamble){
                    if(Math.random() < 0.5)
                        setScore(s => s * 2)
                    else
                        setScore(0);
                    setGamble(false);
                }
                else
                    setScore(s => s + 1 + scoreBonus);
                
                setMovieData(guessedMovie, true, true);

                if(sharedActors.length > 0){
                    const newUsedActors = {...usedActors}
                    sharedActors.forEach(name => {
                        newUsedActors[name] = (newUsedActors[name] || 0) + 1;
                    })
                    setUsedActors(newUsedActors);
                }
                if(sharedDirectors.length > 0){
                    const newUsedDirectors = {...usedDirectors};
                    sharedDirectors.forEach(name => {
                        newUsedDirectors[name] = (newUsedDirectors[name] || 0) + 1;
                    })
                    setUsedDirectors(newUsedDirectors);
                }     
            }else{
                //incorrect guess 
            }
        })
    }
    function setMovieData(movie, resetTimer = true, addToStats = false){
        fetch(`${BASE_URL}/movie/${movie.id}/credits?api_key=${API_KEY}`).then(r=>r.json()).then(castData => {
            setMovie({
                id: movie.id,
                title: movie.title,
                poster: `${IMG_URL}${movie.poster_path}`,
                castString: castData.cast.slice(0, 4).map(a=>a.name).join(", "),
                castList: castData.cast.filter(a => !castData.crew.find(c => c.job === "Director" && c.name === a.name)).map(a=>a.name),
                directors: castData.crew.filter(c => c.job === "Director").map(c => c.name),
                year: movie.release_date.slice(0, 4)
            })
            
            if(addToStats){
                const updatedMovies = [...playedMovies, movie];
                setPlayedMovies(updatedMovies);
                const movieCounts = JSON.parse(localStorage.getItem("movieCounts") || "{}");
                movieCounts[movie.title] = (movieCounts[movie.title] || 0) + 1;
                localStorage.setItem("movieCounts", JSON.stringify(movieCounts));

                const genreCounts = JSON.parse(localStorage.getItem("genreCounts") || "{}");
                movie.genre_ids?.forEach(id => {
                    const name = GENRE_MAP[id]
                    if(name) genreCounts[name] = (genreCounts[name] || 0) + 1
                })
                localStorage.setItem("genreCounts", JSON.stringify(genreCounts));

                const directorCounts = JSON.parse(localStorage.getItem("directorCounts") || "{}");
                castData.crew.filter(c => c.job === "Director").forEach(d => {
                    directorCounts[d.name] = (directorCounts[d.name] || 0) + 1
                })
                localStorage.setItem("directorCounts", JSON.stringify(directorCounts));
            }
            if(resetTimer){
                setTimer(baseMaxTime);
                setMaxTime(baseMaxTime);
            }
        })
    }
    function getRandomMovie(){
        const randomPage = Math.floor(Math.random() * 20) + 1;
        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${randomPage}&with_original_language=en&sort_by=vote_average.desc&vote_count.gte=2000&primary_release_date.gte=2000-01-01`).then(r=>r.json()).then(data => {
            const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
            setMovieData(randomMovie, false);
        })
    }

    if(openShop) return <Shop score={score} setScore={setScore} setOpenShop={setOpenShop} inventory={inventory} setInventory={setInventory} setTimer={setTimer} 
    timer={timer} maxTime={maxTime} setMaxTime={setMaxTime} onSkip={getRandomMovie} currentMovie={movie} setScoreBonus={setScoreBonus} setGamble={setGamble}></Shop>
    if(!movie) return (
        <p>Movie loading..</p>
    )
    return (
    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", height:"100vh", padding:"20px"}}>
        <img src={PlayAgainButton} style={{display:"none"}} alt=""/>
        <img src={PlayAgainButtonAlt} style={{display:"none"}} alt=""/>
        {/* LEFT SIDE */}
        <div style={{padding:"20px", paddingTop:"50px"}}>
            <h4 style={{fontWeight:"bold"}}>Actors Banned</h4>
            <ul style={{listStyle:"none", padding:0}}>
                {Object.entries(usedActors).filter(([name, count]) => count >= 3).map(([name, count]) => (
                    <li key={name}>{name}</li>
                ))}
            </ul>
            <h4 style={{fontWeight:"bold"}}>Directors Banned</h4>
            <ul style={{listStyle:"none", padding:0}}>
                {Object.entries(usedDirectors).filter(([name, count]) => count >= 3).map(([name, count]) => (
                    <li key={name}>{name}</li>
                ))}
            </ul>
        </div>
        {/* MIDDLE */}
        <div className="d-flex flex-column align-items-center" style={{paddingTop:"50px"}}>
            <CoinDisplay score={score}></CoinDisplay>
            <div style={{marginTop:"50px", display:"flex", flexDirection:"column", alignItems:"center"}}>
                <MovieCard movie={movie}/>
                {!gameOver && gameStarted && <SearchBar onGuess={guessMovie} currentMovie={movie} playedMovies={playedMovies}
                    bannedActors={Object.keys(usedActors).filter(a => usedActors[a] >= 3)}
                    bannedDirectors={Object.keys(usedDirectors).filter(a => usedDirectors[a] >= 3)}/>}

                    {!gameStarted && 
                        <ImageButton img = {PlayButton} hoveredImg={PlayButtonAlt} onClick={() => setGameStarted(true)} altText="A button to start the game"></ImageButton>}
                    {gameOver && 
                        <ImageButton img={PlayAgainButton} hoveredImg={PlayAgainButtonAlt} onClick={restart} altText="A button to play again"></ImageButton>}

            </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="d-flex flex-column align-items-center" style={{paddingTop:"50px"}}>
            <h2 style={{fontWeight:"bold"}}>High Score : ${highScore}</h2>
            {!gameOver && <div className="d-flex flex-column align-items-center" style={{marginTop:"120px"}}>
                <CircleTimer timer={timer} maxTime={maxTime}/>

                <div style={{marginTop:"50px"}}>
                    <ImageButton img={ShopButton} hoveredImg={ShopButtonAlt} onClick={() => setOpenShop(true)} altText="A button for the shop"></ImageButton>
                </div>

            </div>}
        </div>

    </div>
    )
}
export default Game;
