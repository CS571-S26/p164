import { Card, Button } from 'react-bootstrap';

function ShopButton({item, score, inventory, onBuy}){
    const price = typeof item.price === "function" ? item.price(inventory) : item.price;

    return (

        <Card bg="dark" text="white" style={{height:"100%"}}>
            <Card.Body>
                <Card.Title style={{fontWeight:"bold"}}>{item.name}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <Button
                    className="w-100"
                    variant={score >= price ? "warning" : "secondary"} 
                    onClick={()=>onBuy(item)}
                    disabled={score < price}
                >${price}</Button>
            </Card.Body>
        </Card>

    )
}
export default ShopButton;