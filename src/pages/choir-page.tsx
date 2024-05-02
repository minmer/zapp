import baner from '../assets/choir.jpg'
export default function ChoirPage() {
    return (

        <>
            <div className="page">
                <div className="baner">
                    <img alt="baner" src={baner} />
                    <div>
                        <h1>Chór mieszany</h1>
                    </div>
                </div>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące funkcjonalności:</p>
                    <ul>
                        <li>Terminy najbliższych prób i śpiewów</li>
                        <li>Repertuar na każdy śpiew</li>
                        <li>Nuty do pobrania</li>
                    </ul>
                </div>
            </div>
        </>
    );
}