import { Link } from 'react-router-dom'


export default function Header() {
    return (
        <>
            <div className='header_wrapper'>
                <h1 className='title'>Noel keresztelője</h1>
                <nav>
                    <ul>
                    <Link to='/list'> <li className='menu'>Eddig feltöltöttek</li></Link>
                    <Link to='/'><li className='menu'>új kép feltöltés</li></Link>
                    </ul>
                </nav>
            </div>
        </>
    )
}