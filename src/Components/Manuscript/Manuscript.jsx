import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import './Manuscript.css';

import { BACKEND_URL } from '../../constants';

const MANUSCRIPT_READ_ENDPOINT = `${BACKEND_URL}/manuscript`;
const MANUSCRIPT_CREATE_ENDPOINT = `${BACKEND_URL}/manuscript/create`;
const ACTIONS_ENDPOINT = `${BACKEND_URL}/actions`;

function AddManuscriptForm({ visible, cancel, fetchManuscripts, setError }) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [authorEmail, setAuthorEmail] = useState('');
    const [text, setText] = useState('');
    const [abstract, setAbstract] = useState('');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    const addManuscript = async (event) => {
        event.preventDefault();
        const actualEmail = isAdmin ? authorEmail : localStorage.getItem('userEmail');
        const newManuscript = { title, author, author_email: actualEmail, text, abstract };

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

            {isAdmin && (
                <>
                    <label>Author Email</label>
                    <input
                        required
                        type="email"
                        value={authorEmail}
                        onChange={(e) => setAuthorEmail(e.target.value)}
                    />
                </>
            )}

            <label>Text</label>
            <textarea required rows="20" cols="80" value={text} onChange={(e) => setText(e.target.value)} />

            <label>Abstract</label>
            <textarea required rows="10" cols="80" value={abstract} onChange={(e) => setAbstract(e.target.value)} />

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

const manuscriptHeader = 'Dashboard';
const manuscriptButton = 'Add a Manuscript';

const stateAbbreviations = {
    'SUB': 'SUBMITTED',
    'REV': 'IN_REF_REV',
    'ARV': 'AUTHOR_REVISION',
    'EDR': 'EDITOR_REV',
    'CED': 'COPY_EDIT',
    'AUR': 'AUTHOR_REV',
    'FMT': 'FORMATTING',
    'PUB': 'PUBLISHED',
    'REJ': 'REJECTED',
    'WIT': 'WITHDRAWN',
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

const groupManuscriptsByState = (manuscripts) => {
    return manuscripts.reduce((groups, manuscript) => {
        const state = stateAbbreviations[manuscript.state];
        if (!groups[state]) {
            groups[state] = [];
        }
        groups[state].push(manuscript);
        return groups;
    }, {});
};

function Manuscripts() {
    const [error, setError] = useState('');
    const [manuscripts, setManuscripts] = useState([]);
    const [addingManuscript, setAddingManuscript] = useState(false);
    const [actionTable, setActionTable] = useState({});

    const stateDisplayNames = {
        SUBMITTED: 'Submitted',
        IN_REF_REV: 'Referee Review',
        AUTHOR_REVISION: 'Author Revision',
        EDITOR_REV: 'Editor Review',
        COPY_EDIT: 'Copy Edit',
        AUTHOR_REV: 'Author Review',
        FORMATTING: 'Formatting',
        PUBLISHED: 'Published',
    };

    const fetchManuscripts = () => {
        const userEmail = localStorage.getItem('userEmail');
        const isAdmin = localStorage.getItem('isAdmin') === 'true';

        const url = isAdmin
            ? `${BACKEND_URL}/manuscript`
            : `${BACKEND_URL}/manuscript/by_email/${userEmail}`;

        axios.get(url)
            .then(({ data }) => {
                const result = Array.isArray(data) ? data : Object.values(data); // 兼容不同格式
                setManuscripts(result);
            })
            .catch((error) => {
                setError(`There was a problem retrieving the manuscripts. ${error}`);
            });
    };


    useEffect(fetchManuscripts, []);

    useEffect(() => {
        axios.get(ACTIONS_ENDPOINT)
            .then(({ data }) => setActionTable(data))
            .catch((error) => setError(`Failed to fetch action table: ${error}`));
    }, []);

    const groupedManuscripts = groupManuscriptsByState(
        manuscripts.filter(manuscript => manuscript.state !== 'WIT')
    );

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
            <div className="manuscripts-columns">
                {Object.keys(stateDisplayNames).map((state) => {
                    const manuscriptsInState = groupedManuscripts[state] || [];
                    return (
                        <div key={state} className="manuscript-column">
                            <h2 className="state-header">{stateDisplayNames[state]}</h2>
                            <div className="manuscripts-list">
                                {manuscriptsInState.map((manuscript) => (
                                    <Manuscript
                                        key={manuscript._id}
                                        manuscript={manuscript}
                                        fetchManuscripts={fetchManuscripts}
                                        actionTable={actionTable}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function Manuscript({ manuscript, fetchManuscripts, actionTable }) {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const { _id, title, author, author_email, abstract, text, editor, state, referees: assignedReferees = [] } = manuscript;
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedAction, setSelectedAction] = useState('');
    const [selectedReferee, setSelectedReferee] = useState('');
    const [showFullText, setShowFullText] = useState(false);
    const [referees, setReferees] = useState([]);

    const actionDisplayNames = {
        ACCEPT: 'Accept',
        ASSIGN_REF: 'Assign Referee',
        DELETE_REF: 'Delete Referee',
        DONE: 'Done',
        REJECT: 'Reject',
        WITHDRAW: 'Withdraw',
        REMOVE_REF: 'Remove Referee',
        SUBMIT_REVIEW: 'Submit Review',
        ACCEPT_WITH_REVISIONS: 'Accept with Revisions',
    };

    useEffect(() => {
        axios.get(`${BACKEND_URL}/people`)
            .then(({ data }) => {
                const refereeList = Object.values(data).filter(person =>
                    person.roles && person.roles.includes('RE')
                );
                setReferees(refereeList);
            })
            .catch((error) => {
                console.error('Failed to fetch referees:', error);
            });
    }, []);

    const handleActionChange = (event) => {
        setSelectedAction(event.target.value);
        setSelectedReferee('');
    };

    const submitStateUpdate = () => {
        if (!selectedAction) return;

        if (!_id) {
            alert('Error: Manuscript ID is missing or undefined');
            return;
        }

        if (selectedAction === 'DELETE_REF' && !assignedReferees.includes(selectedReferee)) {
            alert(`Cannot delete referee "${selectedReferee}" because they are not assigned to this manuscript.`);
            return;
        }

        const actionAbbreviation = ACTION_ABBREVIATIONS[selectedAction];
        const updateUrl = `${MANUSCRIPT_READ_ENDPOINT}/${_id}/update_state/${localStorage.getItem('userEmail')}`;
        const payload = { action: actionAbbreviation };

        if (selectedAction === 'ASSIGN_REF' || selectedAction === 'DELETE_REF') {
            payload.referee = selectedReferee;
        }

        axios.put(updateUrl, payload)
            .then(() => {
                fetchManuscripts();
                setIsUpdating(false);
                setSelectedAction('');
                setSelectedReferee('');
            })
            .catch((error) => {
                alert(`Failed to update state: ${error.response?.data?.message || error.message}`);
            });
    };

    const withdrawManuscript = () => {
        if (!window.confirm('Are you sure you want to withdraw this manuscript?')) return;

        const updateUrl = `${MANUSCRIPT_READ_ENDPOINT}/${_id}/update_state/${localStorage.getItem('userEmail')}`;
        axios.put(updateUrl, { action: 'WIT' })
            .then(() => {
                fetchManuscripts();
            })
            .catch((error) => {
                alert(`Failed to withdraw: ${error.response?.data?.message || error.message}`);
            });
    };

    return (
        <div className="manuscript-card">
            <h3>{title}</h3>
            <p><strong>Author:</strong> {author}</p>
            <p><strong>Email:</strong> {author_email}</p>
            <details>
                <summary>Abstract</summary>
                <p>{abstract}</p>
            </details>
            {text && (
                <button type="button" onClick={() => setShowFullText(!showFullText)} className="show-text-button">
                    {showFullText ? 'Hide Text' : 'Show Text'}
                </button>
            )}
            {showFullText && text && (
                <div className="manuscript-full-text">
                    <p>{text}</p>
                </div>
            )}
            {editor && <p><strong>Editor:</strong> {editor}</p>}

            {isUpdating ? (
                <div className="update-controls">
                    <select value={selectedAction} onChange={handleActionChange}>
                        <option value="" disabled>Select next action</option>
                        {actionTable[stateAbbreviations[state]]
                            ?.filter((action) => !(isAdmin && action === 'WITHDRAW'))
                            .map((action) => (
                                <option key={action} value={action}>
                                    {actionDisplayNames[action] || action}
                                </option>
                            ))}
                    </select>

                    {(selectedAction === 'ASSIGN_REF' || selectedAction === 'DELETE_REF') && (
                        <div>
                            <label>Referee</label>
                            <select
                                value={selectedReferee}
                                onChange={(e) => setSelectedReferee(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select a referee</option>

                                {selectedAction === 'ASSIGN_REF' &&
                                    referees
                                        .filter(ref => !assignedReferees.includes(ref.email))
                                        .map((ref) => (
                                            <option key={ref.email} value={ref.email}>
                                                {ref.name} ({ref.email})
                                            </option>
                                        ))}

                                {selectedAction === 'DELETE_REF' &&
                                    assignedReferees.map((email) => (
                                        <option key={email} value={email}>
                                            {email}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    )}

                    <div className="button-group">
                        <button type="button" onClick={submitStateUpdate}>Confirm</button>
                        <button type="button" onClick={() => setIsUpdating(false)}>Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="button-group">
                    {isAdmin && (
                        <button type="button" onClick={() => setIsUpdating(true)}>Update State</button>
                    )}
                    {!isAdmin && (
                        <button type="button" onClick={withdrawManuscript}>Withdraw</button>
                    )}
                </div>

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
        text: propTypes.string.isRequired,
        abstract: propTypes.string.isRequired,
        editor: propTypes.string,
        state: propTypes.string.isRequired,
        referees: propTypes.arrayOf(propTypes.string),
    }).isRequired,
    fetchManuscripts: propTypes.func.isRequired,
    actionTable: propTypes.object.isRequired,
};

export default Manuscripts;

export {
    manuscriptHeader,
    manuscriptButton,
};
