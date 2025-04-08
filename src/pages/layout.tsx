import Navbar from "../components/navbar"
import { Outlet } from "react-router-dom"

function Layout() {
    return (
        <>
            <div className="bg-[#0d47a1]">
                <h2>Shiva Kumar Tirupathi</h2>
                <Navbar />
            </div>
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default Layout