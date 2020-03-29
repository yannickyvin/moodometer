import React from 'react'
import PropTypes from 'prop-types'
import { dayOfYear } from '../services/dateService'
const background = ((process.env.REACT_APP_PICSUM_BACKGROUND === undefined) || (process.env.REACT_APP_PICSUM_BACKGROUND)) ? `url('https://picsum.photos/id/${dayOfYear()}/1920/1200')` : `url('fab${dayOfYear() % 52}.jpg')`
const Layout = ({ children }) => (
  <div className='cont w-100 d-flex justify-content-center' style={{ backgroundImage: background }}>
    {children}
  </div>
)

Layout.propTypes = {
  children: PropTypes.element.isRequired
}

export default Layout
