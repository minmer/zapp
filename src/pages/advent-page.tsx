import { Link } from 'react-router-dom';
import roraty from '../assets/roraty.png'
import EditableDisplaySingle from '../generals/editable/EditableDisplaySingle';
import { Editable } from '../generals/editable/Editable';
import { useAuth } from '../generals/permission/AuthContext';
export default function AdventPage() {
    const users = [
        { id: 'BS', display: 'Hetkik' },
        { id: 'SB', display: 'Szymon B' },
        { id: 'KR', display: 'Rudy' },
        { id: 'FK', display: 'Playmobil' },
        { id: 'MP', display: 'MP' },
        { id: 'SW', display: 'SW' },
        { id: 'DK', display: 'DK' },
        { id: 'JZ', display: 'JZ' },
        { id: 'PK', display: 'Proboszcz' },
        { id: 'MS', display: 'MS' },
    ]
    const szachy =
        [
            // 02
            { winner: 'BS', looser: 'SB' },
            { winner: 'BS', looser: 'KR' },
            { winner: 'SB', looser: 'KR' },
            { winner: 'FK', looser: 'SB' },
            // 03
            { winner: 'KR', looser: 'MP' },
            { winner: 'MP', looser: 'KR' },
            { winner: 'SB', looser: 'KR' },
            { winner: 'SW', looser: 'FK' },
            // 04
            { winner: 'BS', looser: 'DK' },
            { winner: 'BS', looser: 'FK' },
            { winner: 'FK', looser: 'SB' },
            { winner: 'FK', looser: 'JZ' },
            // 05
            { winner: 'PK', looser: 'BS' },
            // 06
            { winner: 'BS', looser: 'KR' },
            { winner: 'FK', looser: 'MS' },
        // 09
        // 10
        // 11
        // 12
        // 13
        // 16
        // 17
        // 18
        // 19
        // 20
        ]

    // Inicjalizacja wyników
    let scores = users.reduce((acc, user) => {
        acc[user.id] = 1000; // Start with 1000 points for everyone
        return acc;
    }, {});

    const kFactor = 32; // Współczynnik przyrostu/straty punktów
    const activityFactor = 10; // Współczynnik wpływu aktywności
    const tolerance = 0.01; // Konwergencja
    const maxIterations = 100; // Limit iteracji
    let iterations = 0;

    // Iteracyjna aktualizacja wyników
    let updated = true;

    while (updated && iterations < maxIterations) {
        updated = false;
        const newScores = { ...scores };

        for (const user of users) {
            let score = scores[user.id]; // Obecny wynik gracza
            const matchesPlayed = szachy.filter(match => match.winner === user.id || match.looser === user.id).length;

            // Przeanalizuj mecze z innymi graczami
            for (const opponent of users) {
                if (user.id === opponent.id) continue;

                const winsAgainst = szachy.filter(match => match.winner === user.id && match.looser === opponent.id).length;
                const lossesAgainst = szachy.filter(match => match.winner === opponent.id && match.looser === user.id).length;

                const totalMatches = winsAgainst + lossesAgainst;
                if (totalMatches > 0) {
                    const opponentScore = scores[opponent.id];
                    const expectedWinRate = 1 / (1 + Math.pow(10, (opponentScore - scores[user.id]) / 400));
                    const actualWinRate = winsAgainst / totalMatches;

                    // Aktualizacja punktów w oparciu o różnicę przewidywanych i rzeczywistych wyników
                    score += kFactor * (actualWinRate - expectedWinRate) * totalMatches;
                }
            }

            // Dodaj premię za aktywność
            score += activityFactor * Math.sqrt(matchesPlayed);

            // Sprawdź, czy wynik zmienił się znacząco
            if (Math.abs(newScores[user.id] - score) > tolerance) {
                updated = true;
            }

            newScores[user.id] = score;
        }

        scores = newScores;
        iterations++;
    }

    const scoresArray = Object.values(scores) as number[]; // Rzutowanie na tablicę liczb
    const mean = scoresArray.reduce((acc, val) => acc + val, 0) / scoresArray.length; // Oblicz średnią
    const stdDev = Math.sqrt(
        scoresArray.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / scoresArray.length // Oblicz odchylenie standardowe
    );

    const k = 4;

    const results = users.map(user => ({
        id: user.display,
        score: Math.floor(1+99 / (1 + Math.exp(-k * (scores[user.id] - mean) / stdDev))), // Normalizacja z uwzględnieniem średniej i odchylenia
        scorenom: Math.floor(scores[user.id]), // Normalizacja z uwzględnieniem średniej i odchylenia
        matches: szachy.filter(match => match.winner === user.id || match.looser === user.id).length,
        wins: szachy.filter(match => match.winner === user.id).length,
        looses: szachy.filter(match => match.looser === user.id).length,
    })).sort((a, b) => b.score - a.score);








    return (

        <>
            <div className="home" style={{
                overflow: 'scroll',
} }>
                <div className="homedescription">
                    <img style={{
                        width: '100%',
                        margin: '0',
                        boxShadow: '#00000077 0px 3px 12px 7px',
                    }} alt="Roraty" src={roraty} />
                    <h2>Kazania</h2>
                    <div style={{

                        margin: '6px',
                        width: 'auto',
                    }}>
                        <a href="https://www.youtube.com/watch?v=iHtxJJsrJN4" target="_blank" style={{

                            margin: '6px',
                            display: 'inline-block',
                            width: 'auto',
                        }}>02.12.2024 r.</a>
                        <a href="https://youtu.be/2HgGv6_EogY" target="_blank" style={{

                            margin: '6px',
                            display: 'inline-block',
                            width: 'auto',
                        }}>03.12.2024 r.</a>
                        <a href="https://youtu.be/2TfiCERUjCM" target="_blank" style={{

                            margin: '6px',
                            display: 'inline-block',
                            width: 'auto',
                        }}>04.12.2024 r.</a>
                        <a href="https://youtu.be/27Ucz_I5FCs" target="_blank" style={{

                            margin: '6px',
                            display: 'inline-block',
                            width: 'auto',
                        }}>05.12.2024 r.</a>
                        <a href="https://youtu.be/J75oz49EwAk" target="_blank" style={{

                            margin: '6px',
                            display: 'inline-block',
                            width: 'auto',
                        }}>06.12.2024 r.</a>
                    </div>
                    <h2>Materiały</h2>
                    <div style={{

                        margin: '6px',
                        width: 'auto',
                    }}>
                        <a href="https://www.recreatio.eu/roraty/00.pdf" target="_blank" style={{

                            margin: '6px',
                            display: 'inline-block',
                            width: 'auto',
                        }}>Wprowadzenie</a>
                        <a href="https://www.recreatio.eu/roraty/01.pdf" target="_blank" style={{

                            margin: '6px',
                            display: 'inline-block',
                            width: 'auto',
                        }}>01.12.2024 r.</a>
                        <a href="https://www.recreatio.eu/roraty/02.pdf" target="_blank" style={{

                            margin: '6px',
                            display: 'inline-block',
                            width: 'auto',
                        }}>02.12.2024 r.</a>
                        <a href="https://www.recreatio.eu/roraty/03.pdf" target="_blank" style={{
                                
                            margin: '6px',
                            display: 'inline-block',
                            width: 'auto',
                        }}>03.12.2024 r.</a>
                        <a href="https://www.recreatio.eu/roraty/04.pdf" target="_blank" style={{

                            margin: '6px',
                            display: 'inline-block',
                            width: 'auto',
                        }}>04.12.2024 r.</a>
                        <a href="https://www.recreatio.eu/roraty/05.pdf" target="_blank" style={{

                            margin: '6px',
                            display: 'inline-block',
                            width: 'auto',
                        }}>05.12.2024 r.</a>
                        <a href="https://www.recreatio.eu/roraty/06.pdf" target="_blank" style={{

                            margin: '6px',
                            display: 'inline-block',
                            width: 'auto',
                        }}>06.12.2024 r.</a>
                    </div>
                    <h2>Roratni turniej szachowy</h2>
                    <div style={{
                        fontSize: '1.5rem',
                        textAlign: 'center',
                        marginTop: '24px',
                        marginBottom: '24px',
                    } }>
                        {szachy.map(match =>
                            <div><span style={{ fontWeight: 'bold' }}>{users.find(user => match.winner == user.id).display}</span>{' - ' + users.find(user => match.looser == user.id).display}</div>
                        )}
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Zawodnik</th>
                                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Wynik</th>
                                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Ilość partii</th>
                                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Wygrane</th>
                                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Przegrane</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result) => (
                                <tr key={result.id}>
                                    <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                                        {result.id}
                                    </td>
                                    <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                                        {Math.floor(result.score) + ' (' + Math.floor(result.scorenom) + ')'}
                                    </td>
                                    <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                                        {result.matches}
                                    </td>
                                    <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                                        {result.wins}
                                    </td>
                                    <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                                        {result.looses}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}