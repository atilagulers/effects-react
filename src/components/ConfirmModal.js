import React, {useEffect} from 'react';
import {Modal, Button} from 'react-bootstrap';

function ConfirmModal(props) {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.body}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={props.handleClose}
          disabled={props.isDeleting}
        >
          {props.cancelText}
        </Button>
        <Button
          variant="danger"
          onClick={props.handleConfirm}
          disabled={props.isDeleting}
        >
          {props.confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
