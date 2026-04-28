import { useState } from "react";
import { Button} from 'react-bootstrap';

function ImageButton({img, hoveredImg, onClick, altText}){
    const [hovered, setHovered] = useState(false);
    return (
        <Button className='border-0' style={{outline:"none", boxShadow:"none", backgroundColor:"transparent"}}
        onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}> 
            <img src={hovered ? hoveredImg : img} width={"120px"} alt={altText}></img>
        </Button>
    )
}
export default ImageButton;