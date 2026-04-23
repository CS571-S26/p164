import { useRef, useState } from "react";
import { Form, Button, ListGroup } from 'react-bootstrap'
import { BASE_URL, API_KEY } from '../config.js'

function SearchBar({onGuess, currentMovie, playedMovies, bannedActors, bannedDirectors}){
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [bannedSuggestions, setBannedSuggestions] = useState({});
    
    function handleInput(e){
        const value = e.target.value;
        setInput(value);
        if (value.length < 1) {
            setSuggestions([]);
            return
        }
        fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${value}`).then(r=>r.json()).then(d=>{
            const filtered = d.results.filter(m=>m.release_date && m.id != currentMovie.id && !playedMovies.find(p=>p.id == m.id)).slice(0,4)
            setSuggestions(filtered);
            filtered.forEach((m) => {
                fetch(`${BASE_URL}/movie/${m.id}/credits?api_key=${API_KEY}`).then(r=>r.json()).then(castData => {
                    const cast = castData.cast.map(a => a.name);
                    const directors = castData.crew.filter(c => c.job === "Director").map(c => c.name);
                    const isBanned = cast.some(a=> bannedActors.includes(a)) || directors.some(d=>bannedDirectors.includes(d));
                    setBannedSuggestions(prev => ({...prev, [m.id]: isBanned}));
                })
            })
        })

    }

    return (
        <div style={{width:500, marginTop: '50px'}}>
            <Form.Control type="text" placeholder="Enter a movie" value={input} onChange={handleInput}></Form.Control>
            {suggestions.length > 0 && (
                <ListGroup>
                    {suggestions.map(s => (
                        <ListGroup.Item key={s.id} variant="dark" action onClick={() => {
                            onGuess(s);
                            setInput("");
                            setSuggestions([]);
                            setBannedSuggestions({});
                        }} style={{backgroundColor: bannedSuggestions[s.id] ? "#963f3f" : ""}}>
                            {s.title} ({s.release_date?.slice(0, 4)})
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    )
}
export default SearchBar;