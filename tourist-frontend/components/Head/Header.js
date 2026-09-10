import React from 'react'
import Button from '@material-ui/core/Button'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Header = (props) => {

    const router = useRouter()
    const currentRoute = router.pathname

    const selectedStyle = {background:'black', color:'white' }
    const unselectedStyle = {background:'white', color:'black' }

    return (
        <div style={{margin:50}}>
            <div style={{display:'flex'}}>
                <Link href="/allplaces">
                    <Button size="large" style={(currentRoute == "/allplaces")?selectedStyle:unselectedStyle} variant="contained"> All Places </Button>
                </Link>
                <div style={{width:50}} ></div>
                <Link href="/addplace">
                    <Button size="large" style={(currentRoute == "/addplace")?selectedStyle:unselectedStyle} variant="contained" > Add Places </Button>
                </Link>
            </div>
            <br/>
            {props.children}
        </div>
    )
}

export default Header

