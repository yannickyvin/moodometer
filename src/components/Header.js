import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Header = ({ team }) => {
  return (
    <>
      <header>
        <Link className='header' to='admin'>Admin</Link>
      </header>
      <p className='font-weight italic'>Equipe : {team}</p>
    </>
  )
}

Header.propTypes = {
  team: PropTypes.string
}

export default Header
