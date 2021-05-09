import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { Table } from 'react-bootstrap';

import Loading from '../Loading/Loading';

// class ComputerDetails extends Component {
const ComputerDetails = () => {

    const [computer, setComputer] = useState(null);
    const { id } = useParams();

    // GET: /computer/:id
    useEffect( () => {
        axios.get(`/api/computer/${id}`)
            .then(res => {
                if (res.status === 200) {
                    return res.data;
                }
            })
            .then(computer => setComputer(computer))
            .catch(err => console.error('Wystąpił bład: ', err));
    }, [id]);


    // render const elements:
    const computerDetails = computer && (
        <Table striped bordered hover>
            <thead className="thead-dark">
                <tr>
                    <th>id</th>
                    <th>Model</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{computer.id}</td>
                    <td>{computer.type}</td>
                    <td>{computer.name}</td>
                </tr>
            </tbody>
        </Table>
    );

    return (
        <div>
            <h2>Computer details</h2>
            {computer ? computerDetails : <Loading/>}
        </div>
    )
}

export default ComputerDetails;