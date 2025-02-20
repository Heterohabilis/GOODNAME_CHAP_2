import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
            <label htmlFor="title">Title</label>
            <input required type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <label htmlFor="author">Author</label>
            <input required type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
            <label htmlFor="authorEmail">Author Email</label>
            <input required type="email" id="authorEmail" value={authorEmail} onChange={(e) => setAuthorEmail(e.target.value)} />
            <label htmlFor="text">Text</label>
            <textarea required id="text" value={text} onChange={(e) => setText(e.target.value)}></textarea>
            <label htmlFor="abstract">Abstract</label>
            <textarea required id="abstract" value={abstract} onChange={(e) => setAbstract(e.target.value)}></textarea>
            <label htmlFor="editor">Editor</label>
            <input required type="text" id="editor" value={editor} onChange={(e) => setEditor(e.target.value)} />
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

function manuscriptsObjectToArray(Data) {
    return Object.values(Data);
}
function Manuscript({ manuscript, fetchManuscripts, setUpdatingManuscript }) {
    const { id, title, author, author_email } = manuscript;

    const deleteManuscript = () => {
        axios.delete(`${MANUSCRIPT_READ_ENDPOINT}/${id}`)
            .then(fetchManuscripts)
            .catch((error) => console.log(`There was a problem deleting the manuscript. ${error}`));
    };

    return (
        <div>
            <Link to={title}>
                <div className="manuscript-container">
                    <h2>{title}</h2>
                    <p>Author: {author}</p>
                    <p>Email: {author_email}</p>
                </div>
            </Link>
            <button onClick={deleteManuscript} style={{ marginRight: '10px' }}>Delete manuscript</button>
            <button onClick={() => setUpdatingManuscript(manuscript)}>Update manuscript</button>
        </div>
    );
}

Manuscript.propTypes = {
    manuscript: propTypes.shape({
        id: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
        title: propTypes.string.isRequired,
        author: propTypes.string.isRequired,
        author_email: propTypes.string.isRequired,
    }).isRequired,
    fetchManuscripts: propTypes.func.isRequired,
    setUpdatingManuscript: propTypes.func.isRequired,
};

function Manuscripts() {
    const [error, setError] = useState('');
    const [manuscripts, setManuscripts] = useState([]);
    const [addingManuscript, setAddingManuscript] = useState(false);

    const fetchManuscripts = () => {
        axios.get(MANUSCRIPT_READ_ENDPOINT)
            .then(({ data }) => setManuscripts(manuscriptsObjectToArray(data)))
            .catch((error) => setError(`There was a problem retrieving the list of manuscripts. ${error}`));
    };

    useEffect(fetchManuscripts, []);

    return (
        <div className="wrapper">
            <header>
                <h1>View All Manuscripts</h1>
                <button type="button" onClick={() => setAddingManuscript(true)}>Add a Manuscript</button>
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
            {manuscripts.map((manuscript) => (
                <Manuscript key={manuscript.title} manuscript={manuscript} fetchManuscripts={fetchManuscripts} />
            ))}
        </div>
    );
}

export default Manuscripts;
