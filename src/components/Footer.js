import React from 'react'
import { Link } from 'react-router-dom'

const Footer = (props) => {
  console.log('props', props)
  return(
    <footer>
      <Link className="footer" to={props.link + props.search}>{props.libelle}</Link>
    </footer>
  )
}

export default Footer