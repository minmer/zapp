import baner from '../assets/confession.jpg'
export default function ConfessionPage() {
    return (

        <>
            <div className="page">
                <div className="baner">
                    <img alt="baner" src={baner} />
                    <div>
                        <h1>Spowiedź Święta</h1>
                    </div>
                </div>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące funkcjonalności:</p>
                    <ul>
                        <li>Godziny Spowiedzi Świętej poszczególnych kapłanów</li>
                        <li>Pomoce w przygotowaniu się do Spowiedzi Świętej</li>
                    </ul>
                </div>
            </div>
        </>
    );
}