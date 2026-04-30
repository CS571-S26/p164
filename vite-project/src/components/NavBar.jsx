import { Link } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'

function NavBar() {
  return (
    <Navbar style={{backgroundColor:"white", paddingLeft:"20px", paddingRight:"20px"}}>
      <Navbar.Brand as={Link} to="/" style={{fontWeight:"bold", fontSize:"30px", color:"#2b2b2b"}}>
        LINKED
      </Navbar.Brand>
      <Nav className="ms-3">
        <Nav.Link as={Link} to="/how-to-play" style={{color:"#2b2b2b", fontWeight:"600"}}>How To Play</Nav.Link>
        <Nav.Link as={Link} to="/stats" style={{color:"#2b2b2b", fontWeight:"600"}}>Stats</Nav.Link>
        <Nav.Link as={Link} to="/options" style={{color:"#2b2b2b", fontWeight:"600"}}>Options</Nav.Link>
      </Nav>
    </Navbar>
  )
}
export default NavBar
