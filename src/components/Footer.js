import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Footer = ({ link, search, libelle }) => {
  return (
    <footer>
      <Link className='footer' to={link + search}>{libelle}</Link>
    </footer>
  )
}

Footer.propTypes = {
  link: PropTypes.string,
  search: PropTypes.string,
  libelle: PropTypes.string
}

export default Footer
