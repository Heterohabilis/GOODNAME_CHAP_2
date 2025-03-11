import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
// import { Link } from 'react-router-dom';

import { BACKEND_URL } from '../../constants';

const MANUSCRIPT_READ_ENDPOINT = `${BACKEND_URL}/manuscript`;
const MANUSCRIPT_CREATE_ENDPOINT = `${BACKEND_URL}/manuscript/create`;

function AddManuscriptForm({ visible, cancel, fetchManuscripts, setError }) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [authorEmail, setAuthorEmail] = useState('');
    const [text, setText] = useState('');
    const [abstract, setAbstract] = useState('');
    const [editor, setEditor] = useState('');

    const addManuscript = async (event) => {
        event.preventDefault();
        const newManuscript = { title, author, author_email: authorEmail, text, abstract, editor };
        try {
            await axios.put(MANUSCRIPT_CREATE_ENDPOINT, newManuscript);
            fetchManuscripts();
            cancel();
        } catch (error) {
            setError(`There was a problem adding the manuscript. ${error.response?.data?.message || error.message}`);
        }
    };

    if (!visible) return null;
    return (
        <form onSubmit={addManuscript}>
            <label>Title</label>
            <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            <label>Author</label>
            <input required type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
            <label>Author Email</label>
            <input required type="email" value={authorEmail} onChange={(e) => setAuthorEmail(e.target.value)} />
            <label>Text</label>
            <textarea required rows="20" cols="80" value={text} onChange={(e) => setText(e.target.value)}></textarea>
            <label>Abstract</label>
            <textarea required rows="10" cols="80" value={abstract} onChange={(e) => setAbstract(e.target.value)}></textarea>
            <label>Editor</label>
            <input required type="text" value={editor} onChange={(e) => setEditor(e.target.value)} />
            <button type="button" onClick={cancel}>Cancel</button>
            <button type="submit">Submit</button>
        </form>
    );
}

AddManuscriptForm.propTypes = {
    visible: propTypes.bool.isRequired,
    cancel: propTypes.func.isRequired,
    fetchManuscripts: propTypes.func.isRequired,
    setError: propTypes.func.isRequired,
};

const manuscriptHeader = 'View All Manuscripts'
const manuscriptButton = 'Add a Manuscript'

function Manuscripts() {
    const [error, setError] = useState('');
    const [manuscripts, setManuscripts] = useState([]);
    const [addingManuscript, setAddingManuscript] = useState(false);

    const fetchManuscripts = () => {
        axios.get(MANUSCRIPT_READ_ENDPOINT)
            .then(({ data }) => setManuscripts(Object.values(data)))
            .catch((error) => setError(`There was a problem retrieving the manuscripts. ${error}`));
    };

    useEffect(fetchManuscripts, []);

    return (
        <div className="wrapper">
            <header>
                <h1>{manuscriptHeader}</h1>
                <button type="button" onClick={() => setAddingManuscript(true)}>{manuscriptButton}</button>
            </header>
            {addingManuscript && (
                <AddManuscriptForm
                    visible={addingManuscript}
                    cancel={() => setAddingManuscript(false)}
                    fetchManuscripts={fetchManuscripts}
                    setError={setError}
                />
            )}
            {error && <div className="error-message">{error}</div>}
            {manuscripts.map((manuscript, index) => (
                <div key={index} className="manuscript-container">
                    <h2>{manuscript.title}</h2>
                    <p>Author: {manuscript.author}</p>
                    <p>Email: {manuscript.author_email}</p>
                    <p>Abstract: {manuscript.abstract}</p>
                    <p>Editor: {manuscript.editor}</p>
                </div>
            ))}
        </div>
    );
}

export default Manuscripts;

export {
    manuscriptHeader,
    manuscriptButton,
}
