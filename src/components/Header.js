import React from 'react'

const Header = (props) => {
  return(
    <>
      <header>
        <a className="header" href="https://github.com/yannickyvin/moodometer">moodometer</a>
      </header>
      <p className="font-weight italic">Equipe : {props.team}</p>
    </>
  )
}

export default Header