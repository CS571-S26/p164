import { Card } from "react-bootstrap";

function MovieCard({movie}){
    return (
        <Card bg="dark" text="white" style={{width:500, borderRadius:"12px", border:"2px solid rgba(255,255,255,0.3)"}}>
            <Card.Body>
                <img src={movie.poster} alt={movie.title} width={200} style={{borderRadius:"6px", marginBottom:"10px"}}></img>
                <Card.Title style={{ fontWeight: "bold" }}>{movie.title} <span style={{ fontWeight: "normal" }}>({movie.year})</span></Card.Title>
                <Card.Subtitle>Directed by : {movie.directors.join(", ")}</Card.Subtitle>
                <Card.Text>Starring : {movie.castString}</Card.Text>
            </Card.Body>
        </Card>
    )
}
export default MovieCard;