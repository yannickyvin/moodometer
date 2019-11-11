import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { postMood } from '../moodClient'
import { MOOD, LABELS, IS_ACTIVATED } from '../config/config'
import { dateOfDay } from '../service'
import uniqid from 'uniqid'
import queryString from 'query-string'
import Header from '../components/Header'

let id

if (window.localStorage.getItem('id') === null ) {
  id = uniqid();
  window.localStorage.setItem('id', id)
} else {
  id = window.localStorage.getItem('id')
}

const Options = ({ onSelect }) => (
  <div>
    {MOOD.options.map(o => (
      <button
        key={o.rate}
        className={`btn btn-xl m-2`}
        onClick={() => onSelect(o.rate)}
      >
        <img className={`emoji`} src={o.img}/>
      </button>
    ))}
  </div>
)

const InputFormMood = (props) => {
  return (
    <>
      <div className="form-group my-4">
        <div className="d-flex form justify-content-center align-items-center">
          <span id="wordhelp" className="px-1 my-2 form-text text-muted small italic">
            <u>{LABELS.informationUnderline}</u>{LABELS.informationNext}
          </span>
          <img src="right-arrow.svg" className="arrow mx-1" alt="arrow" />
          <input className="inputmood mx-2 px-3" aria-describedby="wordhelp" onChange={props.onInputChange}/>
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

      <div className="app h-100 d-flex flex-column space-between align-items-center">
        <Header team={this.state.team} />
        <div className="app-content h-100">
          <p className="text-center">{LABELS.question}</p>
          <Options onSelect={this.handleSelect} />
          {IS_ACTIVATED.information && <InputFormMood onInputChange={this.informationUpdate}/>}
        </div>
        
        <footer>
          <Link to={"/report" + this.props.location.search}>Rapport</Link>
        </footer>
      </div>
    )
  }
}

export default Vote
