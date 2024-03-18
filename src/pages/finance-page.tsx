import baner from '../assets/finance.jpg'
export default function FinancePage() {
    return (

        <>
            <div className="page">
                <div className="baner">
                    <img alt="baner" src={baner} />
                    <div>
                        <h1>Sprawozdania finansowe</h1>
                    </div>
                </div>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące możliwości:</p>
                    <ul>
                        <li>Zobaczenie sprawozdań z konkretnych dzieł</li>
                        <li>Sprawdzenie stan finansów różnych wspólnotowych funduszy (np. LSO, pielgrzymki)</li>
                    </ul>
                </div>
            </div>
        </>
    );
}