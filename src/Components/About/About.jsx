import React, { useState, useEffect } from 'react';
import axios from 'axios';
import propTypes from 'prop-types';
import { BACKEND_URL } from '../../constants';

const TEXT_READ_ENDPOINT = `${BACKEND_URL}/text`;
const TEXT_CREATE_ENDPOINT = `${BACKEND_URL}/text/create`;

function AddTextForm({ visible, cancel, fetchTexts, setError }) {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [authorEmail, setAuthorEmail] = useState('');

    const changeTitle = (event) => setTitle(event.target.value);
    const changeText = (event) => setText(event.target.value);
    const changeEmail = (event) => setAuthorEmail(event.target.value);

    const addText = async (event) => {
        event.preventDefault();
        const newText = { title, text, authorEmail };
        try {
            await axios.put(TEXT_CREATE_ENDPOINT, newText);
            fetchTexts(); // Refresh the list
            cancel(); // Close the form
        } catch (error) {
            setError(`There was a problem adding the text. ${error}`);
        }
    };

    if (!visible) return null;
    return (
        <form onSubmit={addText}>
            <label htmlFor="title">Title</label>
            <input required type="text" id="title" value={title} onChange={changeTitle} />
            <label htmlFor="text">Text</label>
            <input required type="text" id="text" value={text} onChange={changeText} />
            <label htmlFor="email">Email</label>
            <input required type="text" id="email" value={authorEmail} onChange={changeEmail} />
            <button type="button" onClick={cancel}>Cancel</button>
            <button type="submit">Submit</button>
        </form>
    );
}

AddTextForm.propTypes = {
    visible: propTypes.bool.isRequired,
    cancel: propTypes.func.isRequired,
    fetchTexts: propTypes.func.isRequired,
    setError: propTypes.func.isRequired,
};

function ErrorMessage({ message }) {
    return <div className="error-message">{message}</div>;
}
ErrorMessage.propTypes = {
    message: propTypes.string.isRequired,
};

function findAbout(data) {
    return data["ABOUT"] || null;
}

function About() {
    const [aboutText, setAboutText] = useState([]);
    const [error, setError] = useState('');
    const [addingText, setAddingText] = useState(false);

    const fetchTexts = () => {
        axios.get(TEXT_READ_ENDPOINT)
            .then(({ data }) => setAboutText(findAbout(data)))
            .catch((error) => setError(`There was a problem retrieving the text. ${error}`));
    };

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
            <button type="button" onClick={() => setAddingText(true)}>Add a Text</button>
            {addingText && (
                <AddTextForm
                    visible={addingText}
                    cancel={() => setAddingText(false)}
                    fetchTexts={fetchTexts}
                    setError={setError}
                />
            )}
            {error && <ErrorMessage message={error} />}
        </div>
    );
}

export default About;