import { Outlet } from "react-router-dom"

import Header from "../components/header"

function Layout() {
    return (
        <>
            <Header />
            <main className="p-8 bg-[#e3f2fd] min-w-[360px]">
                <Outlet />
            </main>
        </>
    )
}

export default Layout