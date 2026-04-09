function HowTo(){
    return (
        <div className="d-flex flex-column align-items-center" style={{marginTop:"75px"}}>
            <h1 style={{fontWeight:"bold"}}>HOW TO PLAY</h1>
            <ul style={{marginTop:"15px"}}>
                <li>A random movie is shown, type a movie into the search bar.</li>
                <li>The movie must share at least one actor or director with the current movie.</li>
                <li>If your guess is valid, the new movie becomes the current movie. Your score increases and the timer resets.</li>
                <li>If you fail to guess a movie before the timer hits 0 you lose.</li>
                <li>Each actor or director can only be used as a connection 3 times before they are banned.</li>
                <li>Any movie with a banned actor or director can no longer be played.</li>
                <li>The same movie cannot be guessed twice.</li>
                <li>Try to get the highest score possible!</li>
            </ul>
        </div>
    )
}
export default HowTo;
/**
 * Cannot play the same movie twice
 * timer for each movie
 * 
 */