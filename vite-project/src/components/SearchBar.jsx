import { useRef, useState } from "react";
import { Form, Button, ListGroup } from 'react-bootstrap'
import { BASE_URL, API_KEY } from '../config.js'

function SearchBar({onGuess, currentMovie, playedMovies}){
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState([])

    function handleInput(e){
        const value = e.target.value;
        setInput(value);
        if (value.length < 1) {
            setSuggestions([]);
            return
        }
        fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${value}`).then(r=>r.json()).then(d=>{
            setSuggestions(d.results.filter(m=>m.release_date && m.id != currentMovie.id && !playedMovies.find(p=>p.id == m.id)).splice(0,5));
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
                        }}>
                            {s.title} ({s.release_date?.slice(0, 4)})
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    )
}
export default SearchBar;