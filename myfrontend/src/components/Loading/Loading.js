import React from 'react';
import { Spinner } from 'react-bootstrap';
import './Loading.css';

const Loading = () => {
    return (
        <center>
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </center>
    )
}

export default Loading;