import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'

export const AdminModal = (props) => {
  return (
    <Modal show={props.showModal} onHide={props.onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.messageModal}</Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={props.onCancel}>
          Annuler
        </Button>
        <Button variant='primary' onClick={props.onConfirm}>
          Confirmer
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

AdminModal.propTypes = {
  showModal: PropTypes.bool,
  messageModal: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func
}
