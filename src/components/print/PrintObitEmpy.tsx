import React from "react";
import logo from '../../assets/logo.png';

export default function PrintObitEmpty() {
    const rows = Array.from({ length: 32 }, (_, i) => i + 1);

    return (
        <div className="print-obit">
            <img src={logo} alt="Logo" />
            <div className="logo">
                <p>Parafia pw. Narodzenia NMP</p>
                <p>32-087 Zielonki, ul. ks. Jana Michalika 1</p>
                <p>tel.: 12 285 03 21</p>
            </div>
            <div className="title-description">Msze Święte za</div>
            <div className="title">__________________________</div>
            <table className="intentions-table">
                <thead>
                    <tr>
                        <th className="narrow">Nr</th>
                        <th>Intencja od</th>
                        <th className="narrow">Zbior.</th>
                        <th>Kwota</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((_, i) => (
                        <tr key={i}>
                            <td className="narrow">{i + 1}.</td>
                            <td></td>
                            <td className="narrow">&#9675;</td>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="footer-title">
                3 intencje są odprawiane w ramach indywidualnych Mszy Świętych porannych, 7 intencji w ramach Mszy Świętych zbiorowych, a pozostałe Msze będą odprawiane bez wyznaczonego terminu, zarówno w parafii, jak i poza nią.
            </div>
        </div>
    );
}
