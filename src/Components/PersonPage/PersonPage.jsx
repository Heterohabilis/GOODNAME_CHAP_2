import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';

const PEOPLE_READ_ENDPOINT = `${BACKEND_URL}/people`;
const AVAILABLE_ROLES = {
  'AU': 'Author',
  'ED': 'Editor',
  'ME': 'Managing Editor',
  'CE': 'Copy Editor',
  'RE': 'Referee',
};

function PersonPage() {
  const { email } = useParams();
  const [person, setPerson] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${PEOPLE_READ_ENDPOINT}/${email}/${localStorage.getItem('userEmail')}`)
      .then(({ data }) => setPerson(data))
      .catch((err) => setError(`Error fetching person details: ${err.message}`));
  }, [email]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!person) {
    return <div>Loading...</div>;
  }
  let toBePrinted = [];
  for(var i = 0; i < person.roles.length; i++) {
    toBePrinted.push(AVAILABLE_ROLES[person.roles[i]]);
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>{person.name}</h1>
      <p><strong>Email:</strong> {person.email || 'Unknown'}</p>
      <p><strong>Role:</strong> {toBePrinted?.join(', ') || 'Unknown'}</p>
      <p><strong>Affiliation:</strong> {person.affiliation || 'Unknown'}</p>
    </div>
  );
}

export default PersonPage;
