import { useState, useEffect } from 'react';
import { API_KEY, BASE_URL, IMG_URL } from '../config.js';
import { Button} from 'react-bootstrap';
import MovieCard from '../components/MovieCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import CircleTimer from '../components/CircleTimer.jsx';
import Shop from './Shop.jsx';
import CoinSprite from '../assets/CoinSprite.png';

function Game(){
    const baseMaxTime = 20;
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

    useEffect(() => {
        getRandomMovie();
    }, [])

    useEffect(()=> {
        if(timer == 0){
            if(score > highScore){
                setHighScore(score);
                localStorage.setItem("highScore", score);
            }
            setGameOver(true);
            return;
        }
        const interval = setInterval(() => {
            setTimer(t=>t-1);
        }, 1000)
        return () => clearInterval(interval)
    }, [timer, openShop])

    function restart(){
        setGameOver(false);
        setScore(0);
        setUsedActors({});
        setUsedDirectors({});
        setPlayedMovies([]);
        setTimer(baseMaxTime);
        setMaxTime(baseMaxTime);
        setScoreBonus(0);
        getRandomMovie();
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
                setScore(s => s + 1 + scoreBonus);
                setMovieData(guessedMovie);

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
    function setMovieData(movie, resetTimer = true){
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
            setPlayedMovies([...playedMovies, movie]);

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
    timer={timer} maxTime={maxTime} setMaxTime={setMaxTime} onSkip={getRandomMovie} currentMovie={movie} setScoreBonus={setScoreBonus}></Shop>

    if(!movie) return <p>Loading movie...</p>

    return (
    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", height:"100vh", padding:"20px"}}>
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
            <div className="d-flex align-items-center gap-2">
                <img src={CoinSprite} width={64} height={64} />
                <h2 style={{margin:0, marginLeft:"12px", fontWeight:"bold"}}>{score}</h2>
            </div>
            <div style={{marginTop:"50px", display:"flex", flexDirection:"column", alignItems:"center"}}>
                <MovieCard movie={movie}/>
                {!gameOver && <SearchBar onGuess={guessMovie} currentMovie={movie} playedMovies={playedMovies}
                    bannedActors={Object.keys(usedActors).filter(a => usedActors[a] >= 3)}
                    bannedDirectors={Object.keys(usedDirectors).filter(a => usedDirectors[a] >= 3)}/>}
                {gameOver && <Button variant="success" size="lg" style={{marginTop:"60px"}} onClick={restart}>Play Again</Button>}
            </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="d-flex flex-column align-items-center" style={{paddingTop:"50px"}}>
            <h2 style={{fontWeight:"bold"}}>High Score : ${highScore}</h2>
            {!gameOver && <div className="d-flex flex-column align-items-center" style={{marginTop:"120px"}}>
                <CircleTimer timer={timer} maxTime={maxTime}/>
                <Button variant="warning" style={{marginTop:"80px", width:"120px", height:"120px", fontWeight:"bold", fontSize:"25px"}} onClick={() => setOpenShop(true)}>Shop</Button>
            </div>}
        </div>

    </div>
    )
}
export default Game;
