import { Link } from 'react-router-dom'


export default function Header() {
    return (
        <>
            <div className='header_wrapper'>
                <h1 className='title'>Noel kereszteloje</h1>
                <nav>
                    <ul>
                    <Link to='/list'> <li className='menu'>Feltoltott kepek</li></Link>
                    <Link to='/'><li className='menu'>Uj kep feltoltese</li></Link>
                    </ul>
                </nav>
            </div>
        </>
    )
}