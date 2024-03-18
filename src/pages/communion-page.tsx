import baner from '../assets/communion.jpg'
export default function CommunionPage() {
    return (

        <>
            <div className="page">
                <div className="baner">
                    <img alt="baner" src={baner} />
                    <div>
                        <h1>Komunia Święta</h1>
                    </div>
                </div>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące możliwości:</p>
                    <ul>
                        <li>Zgłoszenie dziecka do Komunii</li>
                        <li>Sprawdzenie potrzebnych dokumentów do Komunii</li>
                        <li>Sprawdzenie postępu dziecka w zdawaniu</li>
                        <li>Zgłoszenie się na wyjazd w białym tygodniu</li>
                        <li>Sprawdzenie wszystkich terminów spotkań</li>
                        <li>Możliwość dodatkowych terminów do zdawania</li>
                    </ul>
                </div>
            </div>
        </>
    );
}