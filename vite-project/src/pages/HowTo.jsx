import MovieScreenshot from '../assets/MovieScreenshot.png';
import ShopScreenshot from '../assets/ShopScreenshot.png';
import SearchBarScreenshot from '../assets/SearchBarScreenshot.png';
import BanScreenshot from '../assets/BanScreenshot.png';

[MovieScreenshot, ShopScreenshot].forEach(src => {
    const img = new Image()
    img.src = src
})

function HowTo(){
    return (
        <div className="d-flex justify-content-center">
         <div style={{maxWidth:"800px", width:"100%", padding:"40px 20px", textAlign:"center"}}>
            <h1 style={{fontWeight:"bold", marginBottom:"30px", textAlign:"center"}}>HOW TO PLAY</h1>

            <h4 style={{fontWeight:"bold", marginTop:"20px"}}>1. BASICS</h4>
            <p>A random movie is shown. Refresh the page to get a new one if you are unfamiliar.</p>
            <img src={MovieScreenshot} className="mx-auto" style={{width:"100%", maxWidth:"500px", borderRadius:"12px", margin:"20px 0", display:"block"}} alt="Screenshot of movie card"/>
            <p>You must guess a movie that shares atleast one cast member or director with the current movie. 
                In this example we can guess a Harry Potter movie using Emma Watson as the connection.</p>
            <img src={SearchBarScreenshot} className="mx-auto" style={{width:"100%", maxWidth:"500px", borderRadius:"12px", margin:"20px 0", display:"block"}} alt="Screenshot of search bar"/>
            <p>If your guess is valid that movie replaces the current one, however if the timer runs out before you can make a valid guess you lose. You cannot play duplicate movies.</p>

            <h4 style={{fontWeight:"bold", marginTop:"20px"}}>2. BANS</h4>
            <p>Each actor or director can only be used as a connection <strong>3</strong> times before they are banned.</p>
            <img src={BanScreenshot} className="mx-auto" style={{width:"100%", maxWidth:"200px", borderRadius:"12px", margin:"20px 0", display:"block"}} alt="Screenshot of nan list"/>
            <p>Any movie that contains a banned actor or director can no longer be used. Banned suggestions will appear in red in the search bar.</p>
            
            <h4 style={{fontWeight:"bold", marginTop:"20px"}}>3. SHOP</h4>
            <p>Each correct guess will award you 1 coin. The goal of the game is earn as many coins as possible.</p>
            <p>Coins can be spent in the shop on upgrades or to save yourself in a pinch.</p>
            <img src={ShopScreenshot} className="mx-auto" style={{width:"100%", maxWidth:"150px", borderRadius:"12px", margin:"20px 0", display:"block"}} alt="Screenshot of shop button"/>
            <p>Keep in mind the timer doesn't pause inside the shop so be quick with purchases!</p>

            <h4 style={{fontWeight:"bold", marginTop:"20px"}}>4. STATS</h4>
            <p>View the stats page to see your high score and other statistics. Clearing your browser history will clear your stats.</p>
            
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