import baner from '../assets/baptism.jpg'
export default function BaptismPage() {
    return (

        <>
            <div className="page">
                <div className="baner">
                    <img alt="baner" src={baner} />
                    <div>
                        <h1>Chrzest Święty</h1>
                    </div>
                </div>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące możliwości:</p>
                    <ul>
                        <li>Zgłoszenie dziecka do Chrztu</li>
                        <li>Sprawdzenie potrzebnych dokumentów do Chrztu</li>
                        <li>Zgłoszenie potrzeby wyciągu lub wypisu z akt Chrztu (np. do Komunii, Bierzmowania lub ślubu)</li>
                    </ul>
                </div>
            </div>
        </>
    );
}