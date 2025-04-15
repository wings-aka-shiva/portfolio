import { Link } from "react-router-dom"

function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link to="/portfolio">Portfolio</Link></li>
                <li><Link to="/my-world">My World</Link></li>
            </ul>
        </nav>
    )
}

export default Navbar