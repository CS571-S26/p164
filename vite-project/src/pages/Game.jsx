import { useState, useEffect, useRef } from 'react';
import { API_KEY, BASE_URL, IMG_URL, GENRE_MAP, DEFAULT_MAX_TIME } from '../config.js';
import { Button } from 'react-bootstrap';
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
import Options from './Options.jsx';

function Game() {
    const defaultMaxTime = parseInt(localStorage.getItem("optMaxTime")) || DEFAULT_MAX_TIME;
    const [baseMaxTime, setBaseMaxTime] = useState(defaultMaxTime);
    const [maxTime, setMaxTime] = useState(defaultMaxTime);
    const [timer, setTimer] = useState(defaultMaxTime);

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
    const chainRef = useRef(null)

    useEffect(() => {
        if (chainRef.current) {
            chainRef.current.scrollLeft = chainRef.current.scrollWidth
        }
    }, [playedMovies])

    useEffect(() => {
        getRandomMovie()
    }, [])

    useEffect(() => {
        if (!gameStarted) return;
        if (timer == 0) {
            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem("highScore", score);
            }
            saveStats(score);
            setGameOver(true);
            return;
        }
        const interval = setInterval(() => {
            setTimer(t => t - 1);
        }, 1000)
        return () => clearInterval(interval)
    }, [timer, gameStarted])

    function restart() {
        setGameOver(false);
        setScore(0);
        setUsedActors({});
        setUsedDirectors({});
        setPlayedMovies([]);
        setBaseMaxTime(defaultMaxTime);
        setTimer(defaultMaxTime);
        setMaxTime(defaultMaxTime);
        setInventory({});
        setScoreBonus(0);
        getRandomMovie();
        setGamble(false);
    }

    function saveStats(finalScore) {
        const totalGames = parseInt(localStorage.getItem("totalGames") || 0) + 1;
        const totalScore = parseInt(localStorage.getItem("totalScore") || 0) + finalScore;
        const totalMovies = parseInt(localStorage.getItem("totalMovies") || 0) + playedMovies.length;
        localStorage.setItem("totalGames", totalGames);
        localStorage.setItem("totalScore", totalScore);
        localStorage.setItem("totalMovies", totalMovies);
    }

    function guessMovie(guessedMovie) {
        fetch(`${BASE_URL}/movie/${guessedMovie.id}/credits?api_key=${API_KEY}`).then(r => r.json()).then(castData => {
            const cast = castData.cast.map(a => a.name);
            const directors = castData.crew.filter(c => c.job === "Director").map(c => c.name);


            const allGuessedNames = [...new Set([...cast, ...directors])];
            const allCurrentNames = [...new Set([...movie.castList, ...movie.directors])];

            const sharedNames = allGuessedNames.filter(n => allCurrentNames.includes(n));
            const hasBannedName = sharedNames.some(n => (usedActors[n] || 0) >= 3 || (usedDirectors[n] || 0) >= 3);

            if (!hasBannedName && sharedNames.length > 0) {
                if (gamble) {
                    if (Math.random() < 0.5) setScore(s => s * 2)
                    else setScore(0);
                    setGamble(false);
                } else {
                    setScore(s => s + 1 + scoreBonus);
                }
                setMovieData(guessedMovie, true, true);

                const newUsedActors = { ...usedActors }
                const newUsedDirectors = { ...usedDirectors }
                sharedNames.forEach(name => {
                    const isDirector = directors.includes(name) || movie.directors.includes(name)
                    if (isDirector) {
                        newUsedDirectors[name] = (newUsedDirectors[name] || 0) + 1
                    } else {
                        newUsedActors[name] = (newUsedActors[name] || 0) + 1
                    }
                })
                setUsedActors(newUsedActors)
                setUsedDirectors(newUsedDirectors)
            }
        })
    }
    function setMovieData(movie, resetTimer = true, addToStats = false) {
        fetch(`${BASE_URL}/movie/${movie.id}/credits?api_key=${API_KEY}`).then(r => r.json()).then(castData => {
            setMovie({
                id: movie.id,
                title: movie.title,
                poster: `${IMG_URL}${movie.poster_path}`,
                castString: castData.cast.slice(0, 4).map(a => a.name).join(", "),
                castList: castData.cast.filter(a => !castData.crew.find(c => c.job === "Director" && c.name === a.name)).map(a => a.name),
                directors: castData.crew.filter(c => c.job === "Director").map(c => c.name),
                year: movie.release_date.slice(0, 4)
            })

            if (addToStats) {
                const updatedMovies = [...playedMovies, movie];
                setPlayedMovies(updatedMovies);
                const movieCounts = JSON.parse(localStorage.getItem("movieCounts") || "{}");
                movieCounts[movie.title] = (movieCounts[movie.title] || 0) + 1;
                localStorage.setItem("movieCounts", JSON.stringify(movieCounts));

                const genreCounts = JSON.parse(localStorage.getItem("genreCounts") || "{}");
                movie.genre_ids?.forEach(id => {
                    const name = GENRE_MAP[id]
                    if (name) genreCounts[name] = (genreCounts[name] || 0) + 1
                })
                localStorage.setItem("genreCounts", JSON.stringify(genreCounts));

                const directorCounts = JSON.parse(localStorage.getItem("directorCounts") || "{}");
                castData.crew.filter(c => c.job === "Director").forEach(d => {
                    directorCounts[d.name] = (directorCounts[d.name] || 0) + 1
                })
                localStorage.setItem("directorCounts", JSON.stringify(directorCounts));
            }
            if (resetTimer) {
                setTimer(baseMaxTime);
                setMaxTime(baseMaxTime);
            }
        })
    }
    function getRandomMovie() {
        const randomPage = Math.floor(Math.random() * 20) + 1;
        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${randomPage}&with_original_language=en&sort_by=vote_average.desc&vote_count.gte=2000&primary_release_date.gte=2000-01-01`).then(r => r.json()).then(data => {
            const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
            setMovieData(randomMovie, false);
        })
    }

    if (openShop) return <Shop score={score} setScore={setScore} setOpenShop={setOpenShop} inventory={inventory} setInventory={setInventory} setTimer={setTimer}
        timer={timer} maxTime={maxTime} setMaxTime={setMaxTime} onSkip={getRandomMovie} currentMovie={movie} setScoreBonus={setScoreBonus} setGamble={setGamble} setBaseMaxTime={setBaseMaxTime}></Shop>
    if (!movie) return (
        <p>Movie loading..</p>
    )
    return (
        <div className="container-fluid">
            <img src={PlayAgainButton} style={{ display: "none" }} alt="" />
            <img src={PlayAgainButtonAlt} style={{ display: "none" }} alt="" />
            <div className="row">
                {/* LEFT SIDE */}
                <div className="col-12 col-md-3" style={{ padding: "20px", paddingTop: "40px" }}>
                    <h4 style={{ fontWeight: "bold" }}>Actors Banned : </h4>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {Object.entries(usedActors).filter(([name, count]) => count >= 3).map(([name, count]) => (
                            <li key={name}>{name}</li>
                        ))}
                    </ul>
                    <h4 style={{ fontWeight: "bold" }}>Directors Banned : </h4>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {Object.entries(usedDirectors).filter(([name, count]) => count >= 3).map(([name, count]) => (
                            <li key={name}>{name}</li>
                        ))}
                    </ul>
                </div>
                {/* MIDDLE */}
                <div className="col-12 col-md-6 d-flex flex-column align-items-center" style={{ paddingTop: "40px" }}>
                    <div className="d-flex align-items-center gap-4">
                        <div className="d-flex flex-column align-items-center">
                            {movie && <MovieCard movie={movie} />}
                            {!gameOver && gameStarted && movie && <SearchBar onGuess={guessMovie} currentMovie={movie} playedMovies={playedMovies}
                                bannedActors={Object.keys(usedActors).filter(a => usedActors[a] >= 3)}
                                bannedDirectors={Object.keys(usedDirectors).filter(a => usedDirectors[a] >= 3)} />}
                            {!gameStarted &&
                                <ImageButton img={PlayButton} hoveredImg={PlayButtonAlt} onClick={() => setGameStarted(true)} altText="A button to start the game" />}
                            {gameOver &&
                                <ImageButton img={PlayAgainButton} hoveredImg={PlayAgainButtonAlt} onClick={restart} altText="A button to play again" />}
                        </div>
                        {<div style={{ alignSelf: "flex-start", marginTop: "20px" }}>
                            <CircleTimer timer={timer} maxTime={maxTime} />
                        </div>}
                    </div>

                </div>
                {/* RIGHT SIDE */}
                <div className="col-12 col-md-3 d-flex flex-column align-items-center" style={{ paddingTop: "60px" }}>
                    {<div className="d-flex flex-column align-items-center" style={{ marginTop: "20px", gap: "30px" }}>
                        <CoinDisplay score={score}></CoinDisplay>
                        <ImageButton img={ShopButton} hoveredImg={ShopButtonAlt} onClick={() => setOpenShop(true)} altText="A button for the shop" />
                    </div>}
                </div>
            </div>

            {playedMovies.length > 0 && (
                <div ref={chainRef} style={{ position: "fixed", bottom: "20px", left: 0, right: 0, overflow: "hidden", padding: "0 10px" }}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "nowrap" }}>
                        {playedMovies.map((m, i) => (
                            <span key={m.id} style={{ background: "rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: "20px", whiteSpace: "nowrap", flexShrink: 0 }}>
                                {i > 0 && "→ "}{m.title}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
export default Game;
