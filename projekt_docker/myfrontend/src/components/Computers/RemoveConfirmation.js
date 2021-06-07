import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const RemoveConfirmation = props => {

    return (
        <Modal
            size="sm"
            show={props.doesShow}
            onHide={props.hideModalMethod}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-sm">Delete computer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.message}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.hideModalMethod}>Cancel</Button>
                <Button variant="danger" onClick={props.removeConfirmedMethod}>Remove</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default RemoveConfirmation