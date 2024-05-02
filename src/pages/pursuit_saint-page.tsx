import baner from '../assets/pursuit_saint.jpg'
export default function PursuitSaintPage() {
    return (

        <>
            <div className="page">
                <div className="baner">
                    <img alt="baner" src={baner} />
                    <div>
                        <h1>W pogoni za Świętym</h1>
                    </div>
                </div>
            </div>
            <div className="description">
                <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące funkcjonalności:</p>
                <ul>
                    <li>Sprawdzenie najbliższych wyjazdów</li>
                    <li>Zgłoszenie się na wyjazd</li>
                    <li>Zgłoszenie chęci do pomagania</li>
                    <li>Zdjęcia oraz materiały z wyjazdów</li>
                </ul>
            </div>
        </>
    );
}