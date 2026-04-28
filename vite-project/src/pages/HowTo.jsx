import MovieScreenshot from '../assets/MovieScreenshot.png';
import ShopScreenshot from '../assets/ShopScreenshot.png'

[MovieScreenshot, ShopScreenshot].forEach(src => {
    const img = new Image()
    img.src = src
})

function HowTo(){
    return (
        <div className="d-flex flex-column align-items-center" style={{marginTop:"75px"}}>
            <h1 style={{fontWeight:"bold"}}>HOW TO PLAY</h1>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"40px", maxWidth:"1500px", marginTop:"30px"}}>
                <ul style={{lineHeight:"2"}}>
                    <li>A random movie is shown, type a movie into the search bar.</li>
                    <li>The movie must share at least one actor or director with the current movie.</li>
                    <li>If your guess is valid, the new movie becomes the current movie. Your coins increases and the timer resets.</li>
                    <li>Visit the shop to spend coins on upgrades</li>
                    <li>If you fail to guess a movie before the timer hits 0 you lose.</li>
                    <li>Each actor or director can only be used as a connection 3 times before they are banned.</li>
                    <li>Any movie with a banned actor or director can no longer be played.</li>
                    <li>The same movie cannot be guessed twice.</li>
                    <li>Try to get the most coins possible!</li>
                </ul>
                <div className="d-flex align-items-center justify-content-center">
                    <img src={MovieScreenshot} width={"300px"} alt="A screenshot of the movie card"/>
                    <img src={ShopScreenshot} width={"300px"} alt="A sceenshot of the shop"/>
                </div>
            </div>
        </div>
    )
}
export default HowTo;
/**
 * Cannot play the same movie twice
 * timer for each movie
 * 
 */