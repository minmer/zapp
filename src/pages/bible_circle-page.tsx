import baner from '../assets/bible_circle.jpg'
export default function BibleCirclePage() {
    return (

        <>
            <div className="page">
                <div className="baner">
                    <img alt="baner" src={baner} />
                    <div>
                        <h1>Krąg biblijny</h1>
                    </div>
                </div>
                <div className="description">
                    <p>Obecnie strona jest w budowie. Ostatecznie na tej stronie powinny się znaleźć następujące możliwości:</p>
                    <ul>
                        <li>Terminy najbliższych spotkań</li>
                        <li>Materiały pomocnicze do czytania Pisma Świętego</li>
                        <li>Bieżące rozważania z kręgu biblijnego</li>
                    </ul>
                </div>
            </div>
        </>
    );
}