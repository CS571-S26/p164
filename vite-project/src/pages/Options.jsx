import {useState} from 'react'
import { DEFAULT_MAX_TIME } from '../config.js';

function Options(){
    const [maxTime, setMaxTime] = useState(() => parseInt(localStorage.getItem("OptMaxTime")) || DEFAULT_MAX_TIME);
    const [maxBans, setMaxBans] = useState(() => parseInt(localStorage.getItem("OptMaxBans")) || 3);

    function updateMaxTime(value){
        setMaxTime(value);
        localStorage.setItem("OptMaxTime", value);
    }
    function updateMaxBans(value){
        setMaxBans(value);
        localStorage.setItem("OptMaxBans", value);
    }

    return (
        <div className="d-flex flex-column align-items-center" style={{marginTop:"75px"}}>
            <h1 style={{fontWeight:"bold"}}>OPTIONS</h1>
            <div style={{marginTop:"30px", display:"flex", flexDirection:"column", gap:"20px", width:"300px"}}>
                
                <div>
                    <label>Max Timer : <strong>{maxTime}s</strong></label>
                    <input type="range" min={5} max={60} value={maxTime} 
                        onChange={e => updateMaxTime(e.target.value)}
                        className="form-range"/>
                </div>
                <div>
                    <label>Number of connections before ban : <strong>{maxBans}</strong></label>
                    <input type="range" min={1} max={10} value={maxBans} 
                        onChange={e => updateMaxBans(e.target.value)}
                        className="form-range"/>
                </div>
            </div>
        </div>
    )
}
export default Options;