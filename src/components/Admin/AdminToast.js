import React from 'react'
import PropTypes from 'prop-types'
import { Toast } from 'react-bootstrap'

export const AdminToast = (props) => {

  return (
    <Toast
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0
      }}
      onClose={props.onClose}
      show={props.showToast} delay={3000} autohide
    >
      <Toast.Header>
        <strong className='mr-auto'>Information</strong>
      </Toast.Header>
      <Toast.Body className='toastadmin'>{props.messageToast}</Toast.Body>
    </Toast>
  )
}

AdminToast.propTypes = {
  showToast: PropTypes.bool,
  messageToast: PropTypes.string,
  onClose: PropTypes.func
}
