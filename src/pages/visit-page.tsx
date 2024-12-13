import baner from '../assets/visit.jpg'
export default function VisitPage() {
    return (

        <>
            <div className="page">
                <div className="baner">
                    <img alt="baner" src={baner} />
                    <div>
                        <h1>Kolęda</h1>
                    </div>
                </div>
                <div className="description">
                    <p>Strona jest w budowie - prosimy o cierpliwość - planowane uruchomienie to 15.12.2024 r.</p>
                </div>
            </div>
        </>
    );
}