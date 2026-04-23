import { useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import CoinSprite from '../assets/CoinSprite.png';
import ShopButton from '../components/ShopButton';
import MovieCard from '../components/MovieCard';
import CircleTimer from '../components/CircleTimer';
import { AnimatePresence, motion } from 'framer-motion';

const SHOP_ITEMS = [
    { id: "1", name: "+5 Seconds", description: "Adds 5 seconds to the current timer", price: 1,
    effect: ({setTimer, setMaxTime}) => {
       setTimer(t => {
        const newTime = t + 5
        setMaxTime(m => Math.max(m, newTime))
        return newTime
        })
    }
    },
    { id: "2", name: "Skip", description: "Skip the current movie", price: 1,
        effect : ({onSkip}) => onSkip()
    },
    {id:"3", name:"Pay Raise", description:"+$1 per correct guess", 
        price: (inventory) => (inventory["3"] || 0) * 3 + 3, 
        effect: ({setScoreBonus}) => setScoreBonus(b => b + 1),
    }
]

function Shop({score, setScore, setOpenShop, inventory, setInventory, setTimer, timer, maxTime, setMaxTime, onSkip, currentMovie, setScoreBonus}){
    const [message, setMessage] = useState("")

    function buyItem(item){
        const price = typeof item.price === "function" ? item.price(inventory) : item.price;
        if(score < price) return;
        setScore(s => s - price);
        item.effect({setTimer, setMaxTime, onSkip, inventory, setScoreBonus})
        const newInventory = {...inventory, [item.id]: (inventory[item.id] || 0) + 1};
        setInventory(newInventory);
        setMessage(`${item.name} purchased!`)
        setTimeout(() => setMessage(""), 2000)
    }

    function closeShop(){
        setOpenShop(false);
    }

    return (
    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", height:"100vh", padding:"20px"}}>
        
        {/* LEFT*/}
        <div className="d-flex flex-column align-items-center" style={{paddingTop:"90px"}}>
            <MovieCard movie={currentMovie}/>
            <div style={{marginTop:"30px"}}>
                <CircleTimer timer={timer} maxTime={maxTime}/>
            </div>
        </div>

        {/* MIDDLE*/}
        <div className="d-flex flex-column align-items-center" style={{paddingTop:"50px", gap:"20px"}}>
            <h1 style={{fontWeight:"bold", fontSize:"50px"}}>SHOP</h1>
            <div className="d-flex align-items-center gap-2">
                <img src={CoinSprite} width={48} height={48} style={{imageRendering:"pixelated"}}/>
                <h2 style={{margin:0, marginLeft:"8px", fontWeight:"bold"}}>{score}</h2>
            </div>
            
            {SHOP_ITEMS.map(item => (
                <ShopButton key={item.id} item={item} score={score} inventory={inventory} onBuy={buyItem}/>
            ))}
            <Button variant="danger" onClick={closeShop}>Return</Button>
        </div>

        {/* RIGHT*/}
        <div className="d-flex flex-column align-items-center">
            <AnimatePresence>
                {message && (
                    <motion.p
                        key="message"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{color:"gold", fontWeight:"bold", fontSize:"18px", position:"fixed", right:"650px", top:"170px"}}
                    >
                    {message}
                </motion.p>
                )}
            </AnimatePresence>
        </div>
       
        <div/>

    </div>
)
}
export default Shop;