import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';

const PEOPLE_READ_ENDPOINT = `${BACKEND_URL}/people`;

function PersonPage() {
  const { name } = useParams();
  const [person, setPerson] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${PEOPLE_READ_ENDPOINT}/${name}`)
      .then(({ data }) => setPerson(data))
      .catch((err) => setError(`Error fetching person details: ${err.message}`));
  }, [name]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!person) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>{person.name}</h1>
      <p><strong>Role:</strong> {person.roles?.join(', ') || 'Unknown'}</p>
      <p><strong>Affiliation:</strong> {person.affiliation || 'Unknown'}</p>
    </div>
  );
}

export default PersonPage;
