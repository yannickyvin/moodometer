import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'

export const AdminControl = (props) => {

  return (
    <Form.Group controlId='formBasicPassword'>
      <Form.Label>Admin Code</Form.Label>
      <Form.Control type='password' placeholder='Code' onChange={(event) => props.onInputChange(event.target.value)} />
    </Form.Group>
  )
}

AdminControl.propTypes = {
  onInputChange: PropTypes.func
}
