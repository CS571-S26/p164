import { Link } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'

function NavBar() {
  return (
    <Navbar bg="dark" variant="dark" fixed="bottom">
      <Container className="justify-content-center">
        <Nav>
          <Nav.Link as={Link} to="/">Game</Nav.Link>
          <Nav.Link as={Link} to="/how-to-play">How To Play</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}
export default NavBar
