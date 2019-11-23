import React, { Component, useState } from 'react'
import { postMood } from '../moodClient'
import { MOOD, LABELS, IS_ACTIVATED } from '../config/config'
import { dateOfDay } from '../service'
import uniqid from 'uniqid'
import queryString from 'query-string'
import Header from '../components/Header'
import Footer from '../components/Footer'

let id

if (window.localStorage.getItem('id') === null ) {
  id = uniqid();
  window.localStorage.setItem('id', id)
} else {
  id = window.localStorage.getItem('id')
}

const Options = ({ onSelect }) => (
  <div className="d-flex flex-wrap justify-content-center align-items-center">
    {MOOD.options.map(o => (
      <button
        key={o.rate}
        className={`btn btn-xl`}
        onClick={() => onSelect(o.rate)}
      >
        <img className={`emoji`} src={o.img} alt={o.img} />
      </button>
    ))}
  </div>
)

const InputFormMood = ({onInputChange}) => {
  const [backgroundInput, setBackgroundInput]   = useState('#fff')
  const [border, setBorder]   = useState('1')

  const handleChangeInput = (event) => {
    if (event.target.value.length > 2) {
      setBackgroundInput('#eee')
      setBorder('0')
    } else {
      setBackgroundInput('#fff')
      setBorder('1')
    }
    onInputChange(event)
  }

  return (
    <>
      <div className="form-group my-4">
        <div className="d-flex flex-wrap form justify-content-center align-items-center">
          <span id="wordhelp" className="inputlabelinformation px-1 my-2 form-text text-muted italic">
            <u>{LABELS.informationUnderline}</u>{LABELS.informationNext}
          </span>
          <img src="right-arrow.svg" className="arrow mx-1" alt="arrow" />
          <input className="inputinformation mx-2 px-3" aria-describedby="wordhelp" onChange={handleChangeInput} style={{backgroundColor: backgroundInput, border: border}} />
        </div>
      </div>
    </>
  )
}

class Vote extends Component {

  state = {
    team: MOOD.defaultTeam,
    information: ""
  }

  componentDidMount = () => {
    const parsed = queryString.parse(this.props.location.search)
    this.setState({team : parsed.team === undefined ? MOOD.defaultTeam : parsed.team})
  }

  handleSelect = async moodId => {
    const userMood = {
      session: id,
      day: dateOfDay('YYYY-MM-DD'),
      rate: moodId,
      team: this.state.team,
      information: this.state.information
    }
    await postMood(userMood)
    this.props.history.push(`/report${this.props.location.search}`)
  }

  informationUpdate = (event) => {
    this.setState({information: event.target.value})
  }

  render() {
    return (

      <div className="cont h-100 w-100 d-flex justify-content-center">
        <div className="app h-100 d-flex flex-column align-items-center">
          <Header team={this.state.team} />
          <div className="d-flex flex-column flex-wrap justify-content-center h-100">
            <p className="text-center">{LABELS.question}</p>
            <Options onSelect={this.handleSelect} />
            {IS_ACTIVATED.information && <InputFormMood onInputChange={this.informationUpdate}/>}
          </div>

          <Footer link="/report" libelle="Rapport" search={this.props.location.search} />
        </div>
      </div>
      
    )
  }
}

export default Vote
