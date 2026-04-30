import {useState} from 'react'
import { DEFAULT_MAX_TIME } from '../config.js';

function Options(){
    const [maxTime, setMaxTime] = useState(() => parseInt(localStorage.getItem("OptMaxTime")) || DEFAULT_MAX_TIME);

    return (
        <div className="d-flex flex-column align-items-center" style={{marginTop:"75px"}}>
            <h1 style={{fontWeight:"bold"}}>OPTIONS</h1>
            <div style={{marginTop:"30px", display:"flex", flexDirection:"column", gap:"20px", width:"300px"}}>
                
                <div>
                    <label>Max Timer (seconds): {maxTime}s</label>
                    <input type="range" min={5} max={60} value={maxTime} 
                        onChange={e => setMaxTime(parseInt(e.target.value))}
                        className="form-range"/>
                </div>

            </div>
        </div>
    )
}
export default Options;