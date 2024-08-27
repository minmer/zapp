import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg'
export default function HomePage() {
    return (

        <>
            <div className="home">
                <div className="homedescription">
                    <img alt="Logo reCreatio" src={logo}/>
                    <h1>Witamy na stronie reCreatio.eu</h1>
                    <div>
                        <p>Strona reCreatio.eu jest częścią szerszego projektu, który ma dać parafiom oraz wspólnotom narzędzia do pracy przez internet. Aby móc skorzystać z niego należy korzystać z dedykowanego linku lub zalogować się.</p>
                    </div>
                </div>
                <Link to="/zielonki">Parafia Narodzenie NMP w Zielonkach</Link>
            </div>
        </>
    );
}