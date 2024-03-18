import baner from '../assets/obit.jpg'
export default function ObitPage() {
    return (

        <>
            <div className="page">
                <div className="baner">
                    <img alt="baner" src={baner} />
                    <div>
                        <h1>Pogrzeby</h1>
                    </div>
                </div>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące możliwości:</p>
                    <ul>
                        <li>Sprawdzenie najbliższych pogrzebów</li>
                        <li>Sprawdzanie terminów Mszy Świętych pogrzebowych</li>
                        <li>Dopisanie intencji pogrzebowych</li>
                    </ul>
                </div>
            </div>
        </>
    );
}