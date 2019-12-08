import React from 'react'
import { dayOfYear } from '../service'

const Layout = (props) => (
  <div className="cont w-100 d-flex justify-content-center" style={{backgroundImage: `url('fab${dayOfYear()}.jpg')`}}>
    {props.children}
  </div>
)

export default Layout