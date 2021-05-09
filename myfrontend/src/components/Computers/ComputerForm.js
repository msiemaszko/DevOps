import React from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

const ComputerForm = props => {

    const selectTypeOption = [
        'Netbook',
        'Desktop',
        'Tower',
        'AIO',
        'Server'
    ];

    const submitHandler = event => {
        const inputType = event.nativeEvent.target[1];
        const inputName = event.nativeEvent.target[2];
        
        if (!props.formEditObject)
            props.addNewCompMethod({
                type: inputType.value,
                name: inputName.value
            });
        else
            props.editCompMethod({
                id: props.formEditObject.id,
                type: inputType.value,
                name: inputName.value
            });
        
        props.hideFormMethod();
        event.preventDefault();
        
        // clear form inputs
        inputType.value = '';
        inputName.value = '';

    }

    const modelTitle = props.formEditObject ? `Edit comp #${props.formEditObject.id}` : 'Add a new computer';
    const typeValue = props.formEditObject ? props.formEditObject.type : '';
    const nameValue = props.formEditObject ? props.formEditObject.name : '';
    const selectOption = selectTypeOption.map(value => {
        return <option key={value}>{value}</option>
    });

    return props.doesShow && (
        <Modal 
            show={props.doesShow}
            onHide={props.hideFormMethod}
            backdrop="static"
            keyboard={false}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Form onSubmit={submitHandler}>

                <Modal.Header closeButton>
                    <Modal.Title>{modelTitle}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Computer type</Form.Label>
                        <Form.Control as="select" defaultValue={typeValue} required>
                            <option disabled value=''> -- select an option --</option>
                            {selectOption}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Computer name</Form.Label>
                        <Form.Control type="text" placeholder="type some name" defaultValue={nameValue} required/>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={props.hideFormMethod}>Close</Button>
                    <Button type="submit" variant="success" /*onClick={this.onSubmit}*/>Save it!</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default ComputerForm;