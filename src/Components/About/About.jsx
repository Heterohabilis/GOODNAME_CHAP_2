import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';

const TEXT_READ_ENDPOINT = `${BACKEND_URL}/text`;

function findAbout(data) {
    return data["ABOUT"] || null;
}

function About() {
    const [aboutText, setAboutText] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(TEXT_READ_ENDPOINT)
            .then(({ data }) => {
                const aboutData = findAbout(data);
                if (aboutData) {
                    setAboutText(aboutData);
                } else {
                    setError('No ABOUT text found');
                }
            })
            .catch((error) => setError(`There was a problem retrieving the text. ${error.message}`));
    }, []);

    if (error) return <p>Error: {error}</p>;
    if (!aboutText) return <p>Loading...</p>;

    return (
        <div className="text-container">
            <h2>{aboutText.title}</h2>
            <p>{aboutText.text}</p>
        </div>
    );
}

export default About;