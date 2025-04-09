import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';

const MASTHEAD_ENDPOINT = `${BACKEND_URL}/people/masthead`;

function Masthead() {
    const [error, setError] = useState('');
    const [masthead, setMasthead] = useState([]);

    const fetchMasthead = () => {
        axios.get(MASTHEAD_ENDPOINT)
            .then(({ data }) => {
                if (data && typeof data === "object" && Object.keys(data).length > 0) {
                    const mastheadData = Object.values(data)[0];

                    if (mastheadData && typeof mastheadData === "object") {
                        setMasthead(Object.entries(mastheadData));
                        setError(null);
                    } else {
                        setError("Invalid masthead data format");
                    }
                } else {
                    setError("Invalid response format: Data is empty or not an object");
                }
            })
            .catch((error) => setError(`Failed to fetch masthead roles: ${error.message}`));
    };

    useEffect(fetchMasthead, []);

    return (
        <div className="wrapper">
            <header>
                <h1>Masthead Roles</h1>
            </header>
            {error && <div className="error-message">{error}</div>}
            <ul>
                {masthead
                    .filter(([role]) => role !== 'Author' && role !== 'Referee')
                    .map(([role, people], index) => (
                    people.length > 0 && (
                        <li key={index}>
                            <strong>{role}:</strong>
                            <ul>
                                {people.map((person, idx) => (
                                    <li key={idx}>
                                        {person.name} ({person.affiliation})
                                    </li>
                                ))}
                            </ul>
                        </li>
                    )
                ))}
            </ul>
        </div>
    );
}

export default Masthead;
