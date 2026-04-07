import { useState, useEffect, useEffectEvent } from 'react'
import { API_KEY, BASE_URL, IMG_URL } from '../config.js'

function Game(){
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        getRandomMovie();
    }, [])

    function getRandomMovie(){
        const randomPage = Math.floor(Math.random() * 20) + 1;

        fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${randomPage}`).then(r=>r.json()).then(data => {
            const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
            fetch(`${BASE_URL}/movie/${randomMovie.id}/credits?api_key=${API_KEY}`).then(r=>r.json()).then(castData => {
                setMovie({
                    title: randomMovie.title,
                    poster: `${IMG_URL}${randomMovie.poster_path}`,
                    cast: castData.cast.slice(0, 4).map(a=>a.name).join(', '),
                    director: castData.crew.find(c => c.job === 'Director')?.name
                })
            })
        })
    }
    if(!movie) return <p>Loading movie...</p>
    return (
        <div className="d-flex flex-column align-items-center mt-4">
            <img src={movie.poster} alt={movie.title} width={300}></img>
            <h2 style={{fontWeight:"bold"}}>{movie.title}</h2>
            <h4>Directed by : {movie.director}</h4>
            <h4>Starring : {movie.cast}</h4>
        </div>
    )
}
export default Game;
