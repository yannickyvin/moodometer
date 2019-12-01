import React, { Component, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import {getAllTeams, postTeam, deleteTeam} from '../moodClient'
import uuid from 'uuid/v1'
import { Toast, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'

const AddTeamForm = (props) => {
  const [team, setTeam] = useState('')

  const handleChangeInput = (event) => {
    setTeam(event.target.value)
  }

  const insertTeam = async () => {
    props.insertTeam(team)
    setTeam('')
  }

  return (
    <form>
      <div className="d-flex flex-row justify-content-center">
        <div className="input-group">
          <input className="form-control" type="text" onChange={handleChangeInput} value={team} placeholder="Team à ajouter"></input> 
        </div>
        <div className="input-group">
          <button className="btn btn-primary form-control" onClick={insertTeam}>Ajouter</button>
        </div>
      </div>
    </form>
  )
}

const ListOfTeams = (props) => {

  const selectTeam = (team) => {
    props.onTeamChange(team)
  }

  return (
    <div className="d-flex flex-row flex-wrap">
      {props.teams.map( (team) => (
        <button key={team.publicid} className="btn btn-info mx-1 my-1" type="submit" onClick={() => selectTeam(team)}>{team.nom}</button>
        )
      )}
    </div>
  )
}

const DetailTeamForm = (props) => {
  const port = window.location.port === undefined ? '' : `:${window.location.port}`
  const urlVote = `${window.location.protocol}//${window.location.hostname}${port}/#/?team=${props.team.publicid}`
  const urlRapport = `/report/?team=${props.team.publicid}`

  const deleteTeam = () => {
    props.onTeamDelete()
  }

  return(
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div className="small">
        Nom : {props.team.nom}
      </div>
      <div className="small">
        Identifiant public : {props.team.publicid}
      </div>
      <div className="small">
        Url : {urlVote}
      </div>
      <div>
        <Link to={urlRapport}>
          <button className="btn btn-primary mx-1">Voir le rapport</button> 
        </Link>
        <button className="btn btn-danger mx-1" onClick={deleteTeam}>Supprimer la team</button>
      </div>
    </div>
  )
}


class Admin extends Component {

  state = {
    currentTeam: {},
    teams: [],
    showToast: false,
    messageToast: '',
    showModal: false,
    messageModal: ''
  }

  componentDidMount = () => {
    this.refreshTeams()
  }

  refreshTeams = async () => {
    const teams = await getAllTeams()

    this.setState({
      teams
    }) 
  }

  handleInsertTeam = async (nom) => {
    const newTeam = {
      nom: nom,
      publicid: uuid()
    }

    if (nom.length < 3) {
      this.setState({showToast: true, messageToast: 'Le nom de la team doit contenir au moins 3 caractères'})
    } else if (this.state.teams.find(team => (team.nom === nom)) === undefined) {
      await postTeam(newTeam)
    } else {
      this.setState({showToast: true, messageToast: 'Cette Team existe déjà'})
    }

    this.refreshTeams()
  }

  handleSelectTeam = async (team) => {
    this.setState({
      currentTeam: team
    })
  }

  handleDeleteTeam = async () => {
    this.setState({
      showModal: true,
      messageModal: `Confirmez-vous la suppression de la team ${this.state.currentTeam.nom} ?`
    })
  }

  handleConfirmDeleteTeam = async () => {
    await deleteTeam(this.state.currentTeam)
    this.setState({
      showToast: true, 
      messageToast: `Team ${this.state.currentTeam.nom} supprimée`,
      showModal: false,
      messageModal: ''
    })
    this.refreshTeams()
  }


  render() {
    return (

      <div className="cont w-100 d-flex justify-content-center">
        <div className="app h-100 d-flex flex-column align-items-center justify-content-between">
          <Header team={'Administration'} />
          <AddTeamForm insertTeam={this.handleInsertTeam}/>
          <ListOfTeams teams={this.state.teams} teamSelected={this.state.currentTeam} onTeamChange={this.handleSelectTeam}/>
          {this.state.currentTeam.nom !== undefined &&
            <DetailTeamForm team={this.state.currentTeam} onTeamDelete={this.handleDeleteTeam}/>
          }
          <Toast style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                }}
            onClose={() => this.setState({showToast: false})} show={this.state.showToast} delay={3000} autohide>
            <Toast.Header>
               <strong className="mr-auto">Information</strong>
            </Toast.Header>
            <Toast.Body className="toastadmin">{this.state.messageToast}</Toast.Body>
          </Toast>
          <Modal show={this.state.showModal} onHide={() => this.setState({showModal: false})}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>{this.state.messageModal}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => this.setState({showModal: false})}>
                Annuler
              </Button>
              <Button variant="primary" onClick={this.handleConfirmDeleteTeam}>
                Confirmer
              </Button>
            </Modal.Footer>
          </Modal>
          <Footer link="/report" libelle="Rapport" search={this.props.location.search} />
        </div>
      </div>
    )
  }
}

export default Admin