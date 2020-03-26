import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export const AddTeamForm = ({ onValidate }) => {
  const [team, setTeam] = useState('')

  const handleChangeInput = (event) => {
    setTeam(event.target.value)
  }

  const handleValidate = async () => {
    onValidate(team)
    setTeam('')
  }

  return (
    <form>
      <div className='d-flex flex-row justify-content-center'>
        <div className='input-group'>
          <input className='form-control' type='text' onChange={handleChangeInput} value={team} placeholder='Team à ajouter' />
        </div>
        <div className='input-group'>
          <button className='btn btn-primary form-control' onClick={handleValidate}>Ajouter</button>
        </div>
      </div>
    </form>
  )
}

AddTeamForm.propTypes = {
  onValidate: PropTypes.func
}

export const ListOfTeams = (props) => {
  const selectTeam = (team) => {
    props.onTeamChange(team)
  }

  return (
    <div className='d-flex flex-row flex-wrap'>
      {props.teams.map((team) => (
        <button key={team.publicid} className='btn btn-info mx-1 my-1' type='submit' onClick={() => selectTeam(team)}>{team.nom}</button>
      )
      )}
    </div>
  )
}

ListOfTeams.propTypes = {
  teams: PropTypes.array,
  onTeamChange: PropTypes.func
}

export const DetailTeamForm = (props) => {
  const port = ((window.location.port === undefined) || (window.location.port === '')) ? '' : `:${window.location.port}`
  const path = window.location.pathname === undefined ? '/' : `${window.location.pathname}`
  const urlVote = `${window.location.protocol}//${window.location.hostname}${port}${path}#/?team=${props.team.publicid}`
  const urlRapport = `/report/?team=${props.team.publicid}`

  const deleteTeam = () => {
    props.onTeamDelete()
  }

  const copyUrlVote = () => {
    const urlVote = document.getElementById('urlVote')
    console.log(urlVote)
    urlVote.select()
    document.execCommand('copy')
    props.onCopyText()
  }

  return (
    <div className='d-flex flex-column justify-content-center align-items-center'>
      <div className='small'>
        Nom : {props.team.nom}
      </div>
      <div className='small'>
        Identifiant public : {props.team.publicid}
      </div>
      <div className='small my-3'>
        Url à transmettre : <small><input type='text' id='urlVote' value={urlVote} readOnly /></small> <button className='btn btn-secondary mx-1' onClick={copyUrlVote}>Copier</button>
      </div>
      <div>
        <Link to={urlRapport}>
          <button className='btn btn-primary mx-1'>Voir le rapport</button>
        </Link>
        <button className='btn btn-danger mx-1' onClick={deleteTeam}>Supprimer la team</button>
      </div>
    </div>
  )
}

DetailTeamForm.propTypes = {
  team: PropTypes.object,
  onTeamDelete: PropTypes.func,
  onCopyText: PropTypes.func
}
