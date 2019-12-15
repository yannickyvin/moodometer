import React from 'react'
import PropTypes from 'prop-types'

const Header = ({ team }) => {
  return (
    <>
      <header>
        <a className='header' href='https://github.com/yannickyvin/moodometer'>moodometer</a>
      </header>
      <p className='font-weight italic'>Equipe : {team}</p>
    </>
  )
}

Header.propTypes = {
  team: PropTypes.string
}

export default Header
