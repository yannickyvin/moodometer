import React from 'react'

const Header = (props) => {
  return(
    <>
      <header>
            <a href="https://github.com/yannickyvin/moodometer">moodometer</a>
          </header>
      <p className="font-weight-light text-muted italic">Equipe : {props.team}</p>
    </>
  )
}

export default Header