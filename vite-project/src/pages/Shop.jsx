import { useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import CoinSprite from '../assets/CoinSprite.png';
import ShopButton from '../components/ShopButton';
import MovieCard from '../components/MovieCard';
import CircleTimer from '../components/CircleTimer';
import { AnimatePresence, motion } from 'framer-motion';
import CoinDisplay from '../components/CoinDisplay';
import ImageButton from '../components/ImageButton';
import ReturnButton from '../assets/ReturnButton.png';
import ReturnButtonAlt from '../assets/ReturnButtonAlt.png';

[ReturnButton,ReturnButtonAlt].forEach(src => {
    const img = new Image()
    img.src = src
})

const SHOP_ITEMS = [
    { id: "1", name: "+5 Seconds", description: "Adds 5 seconds to the current timer", price: 2,
    effect: ({setTimer, setMaxTime}) => {
       setTimer(t => {
        const newTime = t + 5
        setMaxTime(m => Math.max(m, newTime))
        return newTime
        })
    }
    },
    { id: "2", name: "Skip", description: "Skip the current movie",
        price: (inventory) => (inventory["2"] || 0) * 2 + 2,
        effect : ({onSkip}) => onSkip()
    },
    {id:"3", name:"Pay Raise", description:"+$1 per correct guess", 
        price: (inventory) => (inventory["3"] || 0) * 3 + 3, 
        effect: ({setScoreBonus}) => setScoreBonus(b => b + 1),
    },
    {id:"4", name:"Overtime", description:"+1 second to the timer limit for each movie", 
        price : (inventory) => (inventory["4"] || 0) * 2 + 2,
        effect: ({setBaseMaxTime, setMaxTime}) => {
            setBaseMaxTime(m=> m + 1)
            setMaxTime(m=> m+1)
        }
    }
]

function Shop({score, setScore, setOpenShop, inventory, setInventory, setTimer, timer, maxTime, setMaxTime, setBaseMaxTime, onSkip, currentMovie, setScoreBonus, setGamble}){
    const [message, setMessage] = useState("")

    function buyItem(item){
        const price = typeof item.price === "function" ? item.price(inventory) : item.price;
        if(score < price) return;
        setScore(s => s - price);
        item.effect({setTimer, setMaxTime, onSkip, inventory, setScoreBonus, setGamble, setBaseMaxTime})
        const newInventory = {...inventory, [item.id]: (inventory[item.id] || 0) + 1};
        setInventory(newInventory);
        setMessage(`${item.name} purchased!`)
        setTimeout(() => setMessage(""), 2000)
    }

    function closeShop(){
        setOpenShop(false);
    }

   return (
    <div className="container-fluid" style={{padding:"20px"}}>
        <div className="row">
            {/* LEFT */}
            <div className="col-12 col-md-3 d-flex flex-column align-items-center" style={{paddingTop:"135px", paddingLeft:"90px"}}>
                <MovieCard movie={currentMovie}/>
                <div style={{marginTop:"30px"}}>
                    <CircleTimer timer={timer} maxTime={maxTime}/>
                </div>
            </div>
            {/* MIDDLE */}
            <div className="col-12 col-md-6 d-flex flex-column align-items-center" style={{paddingTop:"14px", gap:"20px"}}>
                <h1 style={{fontWeight:"bold", fontSize:"50px"}}>SHOP</h1>
                    <div className="d-flex align-items-center gap-3">
                    <CoinDisplay score={score}/>
                    <AnimatePresence>
                        {message && (
                        <motion.p
                        key="message"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{color:"gold", fontWeight:"bold", fontSize:"18px", margin:0}}
                        >
                        {message}
                    </motion.p>
                ) }
            </AnimatePresence>
            </div>

                <div className="d-flex flex-wrap justify-content-center" style={{gap:"20px", maxWidth:"700px", marginTop:"30px"}}>
                    {SHOP_ITEMS.map(item => (
                        <ShopButton key={item.id} item={item} price={typeof item.price === "function" ? item.price(inventory) : item.price} score={score} inventory={inventory} onBuy={buyItem}/>
                    ))}
                </div>
                <ImageButton img={ReturnButton} hoveredImg={ReturnButtonAlt} onClick={closeShop} altText="A button to leave the shop."/>
            </div>
            
        </div>
    </div>
)
}
export default Shop;