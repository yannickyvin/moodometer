import React from 'react'
import PropTypes from 'prop-types'
import { dayOfYear } from '../service'

const Layout = ({ children }) => (
  <div className='cont w-100 d-flex justify-content-center' style={{ backgroundImage: `url('fab${dayOfYear() % 52}.jpg')` }}>
    {children}
  </div>
)

Layout.propTypes = {
  children: PropTypes.element.isRequired
}

export default Layout
