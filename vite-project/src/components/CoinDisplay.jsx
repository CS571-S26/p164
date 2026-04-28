import CoinSprite from '../assets/CoinSprite.png';

function CoinDisplay({score}){
    return (
        <div className="d-flex align-items-center gap-2">
            <img src={CoinSprite} width={64} height={64} alt="Image of a coin" />
            <h2 style={{margin:0, marginLeft:"12px", fontWeight:"bold"}}>{score}</h2>
        </div>
    )
}
export default CoinDisplay;