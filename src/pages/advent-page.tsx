import { Link } from 'react-router-dom';
import roraty from '../assets/roraty.png'
import EditableDisplaySingle from '../generals/editable/EditableDisplaySingle';
import { Editable } from '../generals/editable/Editable';
import { useAuth } from '../generals/permission/AuthContext';
export default function AdventPage() {
    const users = [
        { id: 'BS', display: 'BS' },
        { id: 'SB', display: 'SB' },
        { id: 'KR', display: 'KR' },
        { id: 'FK', display: 'FK' },
    ]
    const szachy =
        [
            { winner: 'BS', looser: 'SB' },
            { winner: 'BS', looser: 'KR' },
            { winner: 'FK', looser: 'SB' },
        ]
    const results = users.map(user => ({
        id: user.display,
        score: Math.floor(
            6.5 * szachy.filter(match => match.winner === user.id || match.looser === user.id).length +
            100 * users.reduce((acc, opponent) => acc + szachy.filter(match => match.winner === user.id && match.looser === opponent.id).length *
                (1 + Math.max(0, szachy.filter(m => m.winner === opponent.id).length - szachy.filter(m => m.looser === opponent.id).length) /
                    Math.max(1, szachy.filter(m => m.winner === opponent.id || m.looser === opponent.id).length + 1)), 0)
        ),
        matches: szachy.filter(match => match.winner === user.id || match.looser === user.id).length,
        wins: szachy.filter(match => match.winner === user.id).length,
        looses: szachy.filter(match => match.looser === user.id).length
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
                        <Link to="https://www.youtube.com/watch?v=iHtxJJsrJN4" style={{

                            margin: '6px',
                            display: 'inline',
                        }}>02.12.2024 r.</Link>
                    </div>
                    <h2>Materiały</h2>
                    <div style={{

                        margin: '6px',
                        width: 'auto',
                    }}>
                        <Link to="https://www.recreatio.eu/00.pdf" style={{

                            margin: '6px',
                            display: 'inline',
                        }}>Wprowadzenie</Link>
                        <Link to="https://www.recreatio.eu/01.pdf" style={{

                            margin: '6px',
                            display: 'inline',
                        }}>01.12.2024 r.</Link>
                        <Link to="https://www.recreatio.eu/02.pdf" style={{

                            margin: '6px',
                            display: 'inline',
                        }}>02.12.2024 r.</Link>
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
                                        {Math.floor(result.score)}
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