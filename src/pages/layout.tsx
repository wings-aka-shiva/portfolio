import { Outlet } from "react-router-dom"

import Header from "../components/header"

function Layout() {
    return (
        <>
            <Header />
            <main className="p-4 bg-[#e3f2fd] min-w-[407px]">
                <Outlet />
            </main>
        </>
    )
}

export default Layout