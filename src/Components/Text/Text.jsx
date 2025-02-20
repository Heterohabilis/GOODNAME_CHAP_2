import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
            <input required type="text" id="authorEmail" value={authorEmail} onChange={changeEmail} />
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

function textObjectToArray(Data) {
    return Object.values(Data);
}

function Text({ text, fetchTexts }) {
    const { title, text, email } = text;
    return (
        <div>
            <Link to={title}>
                <div className="text-container">
                    <h2>{title}</h2>
                    <p>Text: {text}</p>
                    <p>Email: {email}</p>
                </div>
            </Link>
        </div>
    );
}

function Texts() {
    const [error, setError] = useState('');
    const [text, setText] = useState([]);
    const [addingText, setAddingText] = useState(false);

    const fetchTexts = () => {
        axios.get(TEXT_READ_ENDPOINT)
            .then(({ data }) => setText(textObjectToArray(data)))
            .catch((error) => setError(`There was a problem retrieving the list of text. ${error}`));
    };

    useEffect(fetchTexts, []);

    return (
        <div className="wrapper">
            <header>
                <h1>View All Text</h1>
                <button type="button" onClick={() => setAddingText(true)}>Add a Text</button>
            </header>
            {addingText && (
                <AddTextForm
                    visible={addingText}
                    cancel={() => setAddingText(false)}
                    fetchTexts={fetchTexts}
                    setError={setError}
                />
            )}
            {error && <ErrorMessage message={error} />}
            {text.map((text) => (
                <Text key={text.title} text={text} fetchTexts={fetchTexts} />
            ))}
        </div>
    );
}
export default Texts;