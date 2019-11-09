import React, {Component} from 'react'

const Sprint = () => {
  return(
    <div>Sprint 12</div>
  )
}

const Note = () => {
  return(
    <div>4.5</div>
  )
}

const Tendance = () => {
  return(
    <div>Hausse</div>
  )
}


class Summary extends Component {
  state = {

  }

  render() {
    return (
      <div>
        <Sprint></Sprint>
        <Note></Note>
        <Tendance></Tendance>
      </div>
    )
  }
}

export default Summary;