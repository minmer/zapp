import baner from '../assets/confirmation.jpg'
export default function BaptismPage() {
    return (

        <>
            <div className="page">
                <div className="baner">
                    <img alt="baner" src={baner} />
                    <div>
                        <h1>Bierzmowanie</h1>
                    </div>
                </div>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące możliwości:</p>
                    <ul>
                        <li>Zgłoszenie do Bierzmowania</li>
                        <li>Sprawdzenie potrzebnych dokumentów do Bierzmowani</li>
                        <li>Sprawdzenie wszystkich terminów spotkań</li>
                        <li>Kontakt z kapłanem w sprawie bierzmowania</li>
                    </ul>
                </div>
            </div>
        </>
    );
}