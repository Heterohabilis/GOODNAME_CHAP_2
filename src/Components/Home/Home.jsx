import React, { useState, useEffect } from 'react';
import axios from 'axios';
import propTypes from 'prop-types';
import { BACKEND_URL } from '../../constants';

const TEXT_READ_ENDPOINT = `${BACKEND_URL}/text`;
const TEXT_UPDATE_ENDPOINT = `${BACKEND_URL}/text`;

function ErrorMessage({ message }) {
    return <div className="error-message">{message}</div>;
}

ErrorMessage.propTypes = {
    message: propTypes.string.isRequired,
};

function UpdateTextForm({ visible, textData, cancel, fetchText, setError }) {
    const [title, setTitle] = useState(textData.title);
    const [text, setText] = useState(textData.text);


    const updateText = async (event) => {
        event.preventDefault();
        const updatedText = { title, text };
        try {
            await axios.put(
                `${TEXT_UPDATE_ENDPOINT}/${title}`,
                updatedText,
                { headers: { 'Content-Type': 'application/json' } }
            );
            fetchText();
            cancel();
        } catch (error) {
            console.error('Update error details:', error);
            setError(`Error updating text: ${error.message}`);
        }
    };

    if (!visible) return null;
    return (
        <form onSubmit={updateText}>
            <h3>Update Home Text</h3>

            <label>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

            <label htmlFor="text" style={{ display: 'block', marginBottom: '1.5rem' }}>
                Text
            </label>
            <textarea
                id="text"
                rows="6"
                cols="50"
                value={text}
                onChange={(e) => setText(e.target.value)}
                readOnly 
            />

            {/*<label htmlFor="email">Email</label>*/}
            {/*<input */}
            {/*    id="email" */}
            {/*    type="text" */}
            {/*    value={authorEmail} */}
            {/*    onChange={(e) => setAuthorEmail(e.target.value)} */}
            {/*/>*/}

            <button type="button" onClick={cancel}>Cancel</button>
            <button type="submit">Update</button>
        </form>
    );
}

UpdateTextForm.propTypes = {
    visible: propTypes.bool.isRequired,
    textData: propTypes.shape({
        title: propTypes.string,
        text: propTypes.string,
        authorEmail: propTypes.string,
    }),
    cancel: propTypes.func.isRequired,
    fetchText: propTypes.func.isRequired,
    setError: propTypes.func.isRequired,
};

function findHome(data) {
    return data["HOME"] || null;
}

function Home() {
    const [homeText, setHomeText] = useState(null);
    const [error, setError] = useState('');
    const [updatingText, setUpdatingText] = useState(false);

    const fetchText = () => {
        axios.get(TEXT_READ_ENDPOINT)
            .then(({ data }) => {
                const homeData = findHome(data);
                if (homeData) {
                    setHomeText(homeData);
                } else {
                    setError('No HOME text found in database');
                }
            })
            .catch((error) => {
                setError(`There was a problem retrieving the text. ${error.message}`);
            });
    };

    useEffect(() => {
        fetchText();
    }, []);

    const styles = {
        'text-align': 'center',
    };

    if (error) {
        return (
            <ErrorMessage message={error} />
        );
    }

    if (!homeText) {
        return (
            <p>No home content available</p>
        );
    }
    
    return (
        <div>
            <h1 style={styles}>{homeText.text}</h1>
            <p>{homeText.text}</p>
            <button 
                type="button" 
                onClick={() => setUpdatingText(true)}
            >
                Update Text
            </button>
            
            {updatingText && (
                <UpdateTextForm
                    visible={updatingText}
                    textData={homeText}
                    cancel={() => setUpdatingText(false)}
                    fetchText={fetchText}
                    setError={setError}
                />
            )}
            {error && <ErrorMessage message={error} />}
        </div>
    );
}

export default Home;