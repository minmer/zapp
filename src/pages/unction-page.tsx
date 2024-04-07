import baner from '../assets/unction.jpg'
export default function UnctionPage() {
    return (

        <>
            <div className="page">
                <div className="baner">
                    <img alt="baner" src={baner} />
                    <div>
                        <h1>Namaszczenie Chorych</h1>
                    </div>
                </div>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące możliwości:</p>
                    <ul>
                        <li>Zgłoszenie się na odwiedziny księdza z Najświętszym Sakramentem</li>
                        <li>Zgłoszenie się do Namaszczenia Chorych w czasie rekolekcji</li>
                    </ul>
                </div>
            </div>
        </>
    );
}