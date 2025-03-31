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

const manuscriptHeader = 'Dashboard'
const manuscriptButton = 'Add a Manuscript'

const STATE_TABLE = {
    SUBMITTED: ["ASSIGN_REF", "REJECT", "WITHDRAW"],
    IN_REF_REV: ["ACCEPT", "REJECT", "ACCEPT_WITH_REVISIONS", "SUBMIT_REVIEW", "ASSIGN_REF", "DELETE_REF", "WITHDRAW"],
    AUTHOR_REVISION: ["DONE"],
    COPY_EDIT: ["DONE", "WITHDRAW"],
    AUTHOR_REV: ["DONE", "WITHDRAW"],
    EDITOR_REV: ["ACCEPT"],
    FORMATTING: ["DONE"],
    PUBLISHED: [],
    REJECTED: ["WITHDRAW"],
    WITHDRAWN: ["WITHDRAW"]
};

const stateAbbreviations = {
    'AUR': 'AUTHOR_REV',
    'CED': 'COPY_EDIT',
    'REV': 'IN_REF_REV',
    'REJ': 'REJECTED',
    'SUB': 'SUBMITTED',
    'WIT': 'WITHDRAWN',
    'EDR': 'EDITOR_REV',
    'ARV': 'AUTHOR_REVISION',
    'FMT': 'FORMATTING',
    'PUB': 'PUBLISHED',
};

const ACTION_ABBREVIATIONS = {
    ACCEPT: 'ACC',
    ASSIGN_REF: 'ARF',
    DELETE_REF: 'DRF',
    DONE: 'DON',
    REJECT: 'REJ',
    WITHDRAW: 'WIT',
    REMOVE_REF: 'RRF',
    SUBMIT_REVIEW: 'SBR',
    ACCEPT_WITH_REVISIONS: 'AWR'
};


// const FULL_ACTION_NAMES = {
//     ACC: 'Accept',
//     ARF: 'Assign Reference',
//     DRF: 'Delete Reference',
//     DON: 'Done',
//     REJ: 'Reject',
//     WIT: 'Withdraw',
//     RRF: 'Remove Reference',
//     SBR: 'Submit for Review',
//     AWR: 'Accept with Revisions'
// };

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
            {manuscripts.map((manuscript) => (
                <Manuscript
                    key={manuscript._id}
                    manuscript={manuscript}
                    fetchManuscripts={fetchManuscripts}
                />
            ))}
        </div>
    );
}

function Manuscript({ manuscript, fetchManuscripts }) {
    const { _id, title, author, author_email, abstract, editor, state } = manuscript;
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedAction, setSelectedAction] = useState('');

    const handleActionChange = (event) => {
        setSelectedAction(event.target.value);
    };

    const submitStateUpdate = () => {
        if (!selectedAction) return;
        
        // Debug logging to see what values we're working with
        console.log('Manuscript object:', manuscript);
        console.log('Manuscript ID (_id):', _id);
        console.log('Selected action:', selectedAction);
        
        if (!_id) {
            console.error('Error: Manuscript ID is undefined or missing');
            alert('Error: Manuscript ID is missing or undefined');
            return;
        }
        
        const actionAbbreviation = ACTION_ABBREVIATIONS[selectedAction];
        console.log('Action Abbreviation:', actionAbbreviation);
        
        // Construct and log the full URL for better debugging
        const updateUrl = `${MANUSCRIPT_READ_ENDPOINT}/${_id}/update_state`;
        console.log('Making request to URL:', updateUrl);
        console.log('Request payload:', { action: actionAbbreviation });

        axios.put(updateUrl, { action: actionAbbreviation })
            .then((response) => {
                console.log('Update successful, response:', response.data);
                fetchManuscripts();
                setIsUpdating(false);
            })
            .catch((error) => {
                console.error('Update failed, error details:', error);
                console.error('Response status:', error.response?.status);
                console.error('Response data:', error.response?.data);
                console.log(`Could not update manuscript state: ${error.response?.data?.message || error.message}`);
                // Show error to user
                alert(`Failed to update state: ${error.response?.data?.message || error.message}`);
            });
    };

    return (
        <div className="manuscript-container">
            <h2>{title}</h2>
            <p>Author: {author}</p>
            <p>Email: {author_email}</p>
            <p>Abstract: {abstract}</p>
            <p>Editor: {editor}</p>
            <p><strong>Current State:</strong> {stateAbbreviations[state]}</p>

            {isUpdating ? (
                <div>
                    <select value={selectedAction} onChange={handleActionChange}>
                        <option value="" disabled>Select next action</option>
                        {STATE_TABLE[stateAbbreviations[state]]?.map((action) => (
                            <option key={action} value={action}>{action}</option>
                            ))}
                    </select>
                    <button type="button" onClick={submitStateUpdate}>Confirm</button>
                    <button type="button" onClick={() => setIsUpdating(false)}>Cancel</button>
                </div>
            ) : (
                <button type="button" onClick={() => setIsUpdating(true)}>Update State</button>
            )}
        </div>
    );
}

Manuscript.propTypes = {
    manuscript: propTypes.shape({
        _id: propTypes.string.isRequired,
        title: propTypes.string.isRequired,
        author: propTypes.string.isRequired,
        author_email: propTypes.string.isRequired,
        abstract: propTypes.string.isRequired,
        editor: propTypes.string,
        state: propTypes.string.isRequired,
    }).isRequired,
    fetchManuscripts: propTypes.func.isRequired,
};


export default Manuscripts;

export {
    manuscriptHeader,
    manuscriptButton,
}
