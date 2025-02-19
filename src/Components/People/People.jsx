import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { BACKEND_URL } from '../../constants';

const PEOPLE_READ_ENDPOINT = `${BACKEND_URL}/people`;
const PEOPLE_CREATE_ENDPOINT = `${BACKEND_URL}/people/create`;
const PEOPLE_UPDATE_ENDPOINT = `${BACKEND_URL}/people`;

function AddPersonForm({ visible, cancel, fetchPeople, setError }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [affiliation, setAffiliation] = useState('');
    const [roles, setRoles] = useState('');

    const changeName = (event) => setName(event.target.value);
    const changeEmail = (event) => setEmail(event.target.value);
    const changeAffiliation = (event) => setAffiliation(event.target.value);
    const changeRoles = (event) => setRoles(event.target.value);


    // I made this async so that we don't need to manually refresh the page after we submit
    const addPerson = async (event) => {
        event.preventDefault();
        const newPerson = { name, email, affiliation, roles };
        try {
            await axios.put(PEOPLE_CREATE_ENDPOINT, newPerson);
            fetchPeople(); // Refresh the list
            cancel(); // Close the form
        } catch (error) {
            setError(`There was a problem adding the person. ${error}`);
        }
    };

    if (!visible) return null;
    return (
        <form onSubmit={addPerson}>
            <label htmlFor="name">Name</label>
            <input required type="text" id="name" value={name} onChange={changeName} />
            <label htmlFor="email">Email</label>
            <input required type="text" id="email" value={email} onChange={changeEmail} />
            <label htmlFor="affiliation">Affiliation</label>
            <input required type="text" id="affiliation" value={affiliation} onChange={changeAffiliation} />
            <label htmlFor="roles">Roles</label>
            <input required type="text" id="roles" value={roles} onChange={changeRoles} />
            <button type="button" onClick={cancel}>Cancel</button>
            <button type="submit">Submit</button>
        </form>
    );
}
AddPersonForm.propTypes = {
    visible: propTypes.bool.isRequired,
    cancel: propTypes.func.isRequired,
    fetchPeople: propTypes.func.isRequired,
    setError: propTypes.func.isRequired,
};


function ErrorMessage({ message }) {
  return <div className="error-message">{message}</div>;
}
ErrorMessage.propTypes = {
  message: propTypes.string.isRequired,
};


// the form for updating person
function UpdatePersonForm({ visible, person, cancel, fetchPeople, setError }) {
  const [name, setName] = useState(person.name);
  const [affiliation, setAffiliation] = useState(person.affiliation || '');
  const [roles, setRoles] = useState(person.roles || []);

  const updatePerson = (event) => {
    event.preventDefault();
    const updatedPerson = { name, affiliation, roles };
    axios.put(`${PEOPLE_UPDATE_ENDPOINT}/${person.email}`, updatedPerson)
        .then(() => {
          fetchPeople();
          cancel();
        })
        .catch((error) => setError(`Could not update person: ${error.response?.data?.message || error.message}`));
  };

  if (!visible) return null;
  return (
      <form onSubmit={updatePerson}>
        <h3>Update Person</h3>
        <label>Name</label>
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
        <label>Affiliation</label>
        <input type="text" required value={affiliation} onChange={(e) => setAffiliation(e.target.value)} />
        <label>Roles</label>
        {roles.map((role, index) => (
            <div key={index}>
              <input type="text" value={role} onChange={(e) => setRoles(roles.map((r, i) => i === index ? e.target.value : r))} />
              <button type="button" onClick={() => setRoles(roles.filter((_, i) => i !== index))}>Remove</button>
            </div>
        ))}
        <button type="button" onClick={() => setRoles([...roles, ''])}>Add Role</button>
        <button type="button" onClick={cancel}>Cancel</button>
        <button type="submit">Update</button>
      </form>
  );
}

// prototypes
UpdatePersonForm.propTypes = {
  visible: propTypes.bool.isRequired,
  person: propTypes.shape({
    name: propTypes.string.isRequired,
    email: propTypes.string.isRequired,
    affiliation: propTypes.string,
    roles: propTypes.arrayOf(propTypes.string),
  }).isRequired,
  cancel: propTypes.func.isRequired,
  fetchPeople: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};



function Person({ person, fetchPeople, setUpdatingPerson }) {
  const { name, email } = person;

  const deletePerson = () => {
    axios.delete(`${PEOPLE_READ_ENDPOINT}/${email}`)
        .then(fetchPeople)
        .catch((error) => console.log(`There was a problem deleting the person. ${error}`));
  };

  return (
      <div>
        <Link to={name}>
          <div className="person-container">
            <h2>{name}</h2>
            <p>Email: {email}</p>
          </div>
        </Link>
        <button onClick={deletePerson} style={{ marginRight: '10px' }}>Delete person</button>
        <button onClick={() => setUpdatingPerson(person)}>Update person</button>
      </div>
  );
}
Person.propTypes = {
  person: propTypes.shape({
    name: propTypes.string.isRequired,
    email: propTypes.string.isRequired,
  }).isRequired,
  fetchPeople: propTypes.func.isRequired,
  setUpdatingPerson: propTypes.func.isRequired,
};

function peopleObjectToArray(Data) {
  return Object.values(Data);
}

function People() {
  const [error, setError] = useState('');
  const [people, setPeople] = useState([]);
  const [addingPerson, setAddingPerson] = useState(false);
  const [updatingPerson, setUpdatingPerson] = useState(null);

  const fetchPeople = () => {
    axios.get(PEOPLE_READ_ENDPOINT)
        .then(({ data }) => setPeople(peopleObjectToArray(data)))
        .catch((error) => setError(`There was a problem retrieving the list of people. ${error}`));
  };

  useEffect(fetchPeople, []);

  return (
      <div className="wrapper">
        <header>
          <h1>View All People</h1>
          <button type="button" onClick={() => setAddingPerson(true)}>Add a Person</button>
        </header>
        {addingPerson && (
            <AddPersonForm
                visible={addingPerson}
                cancel={() => setAddingPerson(false)}
                fetchPeople={fetchPeople}
                setError={setError}
            />
        )}
        {error && <ErrorMessage message={error} />}
        {people.map((person) => (
            <Person key={person.email} person={person} fetchPeople={fetchPeople} setUpdatingPerson={setUpdatingPerson} />
        ))}
        {updatingPerson && (
            <UpdatePersonForm
                visible={!!updatingPerson}
                person={updatingPerson}
                cancel={() => setUpdatingPerson(null)}
                fetchPeople={fetchPeople}
                setError={setError}
            />
        )}
      </div>
  );
}

export default People;