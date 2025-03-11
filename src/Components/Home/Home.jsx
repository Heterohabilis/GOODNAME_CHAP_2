import React from 'react';
// import axios from 'axios';
// import propTypes from 'prop-types';
// import { BACKEND_URL } from '../../constants';

// const TEXT_READ_ENDPOINT = `${BACKEND_URL}/text`;

const homeHeader = "Journal of React";
function Home() {

    const styles = {
        'text-align': 'center',
    }
    return <h1 style={styles} >{homeHeader}</h1>
}

export default Home;