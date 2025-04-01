import { Link } from "react-router-dom"

function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/projects">Projects</Link></li>
                <li><Link to="/blogs">Blogs</Link></li>
                <li><Link to="/contacts">Contacts</Link></li>
            </ul>
        </nav>
    )
}

export default Navbar