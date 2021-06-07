import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import { XSquare, PencilSquare } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import Loading from '../Loading/Loading'
import ComputerForm from './ComputerForm'
import RemoveConfirmation from './RemoveConfirmation';
import './ComputersList.css';


const ComputersList = () => {
    const [computersList, setComputersList] = useState([]);
    
    // modal: form new/edit computer
    const [doesFormShow, setFormShow] = useState(false);
    const hideFormHandler = () => setFormShow(false);
    const showFromHandler = () => setFormShow(true);
    const [compToEditInForm, setCompToEditInForm] = useState(null);
    
    // model: remove confirmation
    const [doesRemoveModalShow, setRemoveModalShow] = useState(false);
    const hideRemoveModalHandler = () => setRemoveModalShow(false);
    const showRemoveModalHandler = () => setRemoveModalShow(true);
    const [compIdToRemove, setCompIdToRemove] = useState(null);


    // GET: /computer
    useEffect(() => {
        axios.get("/api/computer")
            .then(res => {
                if (res.status === 200) {
                    // console.log(res.data);
                    return res.data;
                }
            })
            .then(computers => {
                setComputersList(computers);
            })
            .catch(err => console.error('Wystąpił bład podczas pobierania listy: ', err));
    }, []);


    // POST: /computer
    const addComputer = newComputerObject => {
        const tableRows = computersList.slice();
        
        axios.post("/api/computer", newComputerObject)
        .then(res => {
            if (res.status === 200) {
                const newCompInDatabase = res.data.data;
                setComputersList([...tableRows, newCompInDatabase]);
            } else {
                console.log("Something wrong with response: ", res);
            }
        })
        .catch (err => console.error('Wystąpił bład podczas dodawania: ', err));

    }

    // PUT: /computer
    const editComputer = editedComputerObject => {
        const tableRows = computersList.slice();
        const orginalComputer = tableRows.filter(comp => comp.id === editedComputerObject.id)[0];
        const indexOf = tableRows.indexOf(orginalComputer);
        
        axios.put('/api/computer', editedComputerObject)
        .then(res => {
            if (res.status === 200) {
                // replace modified computer
                tableRows[indexOf] = editedComputerObject; 
                setComputersList(tableRows);
            } else {
                console.log("Something wrong with response: ", res);
            }
            setCompToEditInForm(null);
            hideFormHandler();
        })
        .catch(err => console.error('Wystąpił bład podczas edyzji: ', err));
    }

    // DELETE: /computer/:id
    const removeConfirmedComputer = () => {
        const computerId = compIdToRemove;
        
        axios.delete(`/api/computer/${computerId}`)
            .then(res => {
                if (res.status === 200) {
                    // remove from list
                    const newItems = computersList.filter(computer => computer.id !== computerId);
                    setComputersList(newItems);
                    hideRemoveModalHandler();
                }
                return res;
            })
            .catch(err => console.error('Wystąpił bład podczas usuwania: ', err));
    }

    const removeComputerHandler = computerId => {
        setCompIdToRemove(computerId);
        showRemoveModalHandler();
    }

    const editComputerHandler = compId => {
        const compObject = computersList.slice().filter(comp => comp.id === compId);
        setCompToEditInForm(compObject[0]);
        showFromHandler();
    }
    
    const addButtonHandler = () => {
        setCompToEditInForm(null);
        showFromHandler();
    }

    const clickOnRowHandler = event => {
        const href = event.target.parentElement.childNodes[0].childNodes[0];
        if (href && href.tagName === 'A') { // prevent click from function below
            href.click();
        }
    }

    // render const elements:
    const tableRows = computersList && computersList.map(
        computer => {
            return (
                <tr key={computer.id} onClick={clickOnRowHandler}>
                    <td className="font-weight-bold">
                        <Link to={`/computers/${computer.id}`}>
                            {computer.id}
                        </Link>
                    </td>
                    <td>{computer.type}</td>
                    <td>{computer.name}</td>
                    <td>
                        <center>
                            <XSquare
                                color="red"
                                size={24}
                                onClick={() => removeComputerHandler(computer.id)}
                            />
                            &nbsp;
                            <PencilSquare 
                                color="gray" 
                                size={24}
                                onClick={() => editComputerHandler(computer.id)} 
                            />
                        </center>
                    </td>
                </tr>
            )
        });

    
    return (
        <div>
            <h2>Computers</h2>
            {computersList.length ?
                <Table striped bordered hover>
                    <thead className="thead-dark">
                        <tr>
                            <th>#</th>
                            <th>Type</th>
                            <th>Model</th>
                            <th>Modify</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows}
                    </tbody>
                </Table>
                : <Loading />
            }

            <Button onClick={addButtonHandler}>Add new computer</Button>

            <ComputerForm
                doesShow={doesFormShow}
                hideFormMethod={hideFormHandler}
                addNewCompMethod={addComputer} 
                editCompMethod={editComputer}
                formEditObject={compToEditInForm}
            />
            
            <RemoveConfirmation 
                removeConfirmedMethod={removeConfirmedComputer} 
                message={`are you sure you want to delete computer #${compIdToRemove ? compIdToRemove : ''} ?`}
                doesShow={doesRemoveModalShow} 
                hideModalMethod={hideRemoveModalHandler}
            />
        </div>
    )
}

export default ComputersList;