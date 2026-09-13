import React from 'react'
import Button from '@mui/material/Button'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Header = ({ children }) => {
    const router = useRouter()
    const currentRoute = router.pathname

    const selectedStyle = { background: 'black', color: 'white' }
    const unselectedStyle = { background: 'white', color: 'black' }

    return (
        <div className="page-shell">
            <nav className="navigation" aria-label="Primary navigation">
                <Link href="/allplaces">
                    <Button size="large" style={currentRoute === '/allplaces' ? selectedStyle : unselectedStyle} variant="contained">All places</Button>
                </Link>
                <Link href="/addplace">
                    <Button size="large" style={currentRoute === '/addplace' ? selectedStyle : unselectedStyle} variant="contained">Add place</Button>
                </Link>
            </nav>
            <main>{children}</main>
        </div>
    )
}

export default Header

