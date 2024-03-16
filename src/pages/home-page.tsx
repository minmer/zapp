import logo from '../assets/logo.svg'
export default function HomePage() {
    return (

        <>
            <div className="home">
                <img alt="Logo reCreatio" src={logo}/>
                <h1>Witamy na stronie reCreatio.eu</h1>
                <div>
                    <p>Strona reCreatio.eu jest częścią szerszego projektu, który ma dać parafiom oraz wspólnotom narzędzia do pracy przez internet. Aby móc skorzystać z niego należy korzystać z dedykowanego linku.</p>
                </div>
            </div>
        </>
    );
}