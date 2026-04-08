import { useState, useEffect } from 'react'
import { API_KEY, BASE_URL, IMG_URL } from '../config.js'
import MovieCard from '../components/MovieCard.jsx';
import SearchBar from '../components/SearchBar.jsx';

function Game(){
    const maxTime = 20;
    const [movie, setMovie] = useState(null);
    const [score, setScore] = useState(0);
    const [playedMovies, setPlayedMovies] = useState([]);
    const [timer, setTimer] = useState(maxTime);
    const [usedActors, setUsedActors] = useState({});
    const [usedDirectors, setUsedDirectors] = useState({});

    useEffect(() => {
        getRandomMovie();
    }, [])

    useEffect(()=> {
        if(timer == 0){
            //game over
            return;
        }
        const interval = setInterval(() => {
            setTimer(t=>t-1);
        }, 1000)
        return () => clearInterval(interval)
    }, [timer])

    function guessMovie(guessedMovie){
        fetch(`${BASE_URL}/movie/${guessedMovie.id}/credits?api_key=${API_KEY}`).then(r=>r.json()).then(castData => {
            const cast = castData.cast.map(a=>a.name);
            const sharedActors = cast.filter(a=> movie.castList.includes(a));
            const hasBannedActor = sharedActors.some(a => (usedActors[a] || 0) >= 3);
            
            const directors = castData.crew.filter(c => c.job === "Director").map(c => c.name);
            const sharedDirectors = directors.filter(d => movie.directors?.includes(d));
            const hasBannedDirector = sharedDirectors.some(d => (usedDirectors[d] || 0) >= 3);
            

            if(!hasBannedActor && !hasBannedDirector && (sharedActors.length > 0 || sharedDirectors.length > 0)){
                setScore(score + 1);
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
    function setMovieData(movie){
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
            setTimer(maxTime);
        })
    }
    function getRandomMovie(){
        const randomPage = Math.floor(Math.random() * 20) + 1;
        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${randomPage}&with_original_language=en&sort_by=vote_average.desc&vote_count.gte=2000&primary_release_date.gte=2000-01-01`).then(r=>r.json()).then(data => {
            const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
            setMovieData(randomMovie);
        })
    }

    if(!movie) return <p>Loading movie...</p>
    return (
        <div className="d-flex flex-column align-items-center" style={{marginTop:"150px"}}>
            <h1 style={{fontWeight:"bold", position:"absolute", top:"60px"}}>Score : {score}</h1>
            {timer > 0 && (
                 <h1 style={{fontSize: "50px", position:"absolute", right:"400px", top:"35%"}}>{timer}</h1>
            )}
           
            <div style={{position:"absolute", left:"20px", top:"60px"}}>
                <h1 style={{fontWeight:"bold"}}>Actors Banned</h1>
                <ul style={{listStyle:"none"}}>
                    {Object.entries(usedActors).filter(([name, count]) => count >= 3).map(([name, count]) => (
                        <li key={name}>{name}</li>
                    ))}
                </ul>
                <h1 style={{fontWeight:"bold"}}>Directors Banned</h1>
                <ul style={{listStyle:"none"}}>
                    {Object.entries(usedDirectors).filter(([name, count]) => count >= 3).map(([name, count]) => (
                        <li key={name}>{name}</li>
                    ))}
                </ul>
            </div>
           
           
            <MovieCard movie={movie}></MovieCard>
            {timer > 0 && (
                 <SearchBar onGuess={guessMovie} currentMovie={movie} playedMovies={playedMovies}></SearchBar>
            )}
        </div>
    )
}
export default Game;
