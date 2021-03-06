import React, { Component } from 'react'
import Layout from '../components/Layout'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ConnectedContext } from '../components/ConnectedContext'
import { AddTeamForm, ListOfTeams, DetailTeamForm } from '../components/Admin/AdminContent'
import { AdminToast } from '../components/Admin/AdminToast'
import { AdminModal } from '../components/Admin/AdminModal'
import { AdminControl } from '../components/Admin/AdminControl'
import { getAllTeams, postTeam, deleteTeam } from '../services/moodClientService'
import uuid from 'uuid/v1'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class Admin extends Component {
  state = {
    currentTeam: {},
    teams: [],
    showToast: false,
    messageToast: '',
    showModal: false,
    messageModal: ''
  }

  static contextType = ConnectedContext

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
      this.setState({ showToast: true, messageToast: 'Le nom de la team doit contenir au moins 3 caractères' })
    } else if (this.state.teams.find(team => (team.nom === nom)) === undefined) {
      await postTeam(newTeam)
    } else {
      this.setState({ showToast: true, messageToast: 'Cette Team existe déjà' })
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

  handleCopyText = async () => {
    this.setState({
      showToast: true,
      messageToast: 'Copie dans presse-papier effectué'
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

  render () {
    return (
      <Layout>
        {this.context.isConnected
          ? (
            <div className='app h-100 d-flex flex-column align-items-center justify-content-around'>
              <Header team='Administration' />
              <Link to='/adminreport'>
                Voir le rapport cumulé
              </Link>
              <AddTeamForm onValidate={this.handleInsertTeam} />
              <ListOfTeams teams={this.state.teams} teamSelected={this.state.currentTeam} onTeamChange={this.handleSelectTeam} />

              {this.state.currentTeam.nom !== undefined &&
                <DetailTeamForm team={this.state.currentTeam} onTeamDelete={this.handleDeleteTeam} onCopyText={this.handleCopyText} />}
              <AdminToast showToast={this.state.showToast} messageToast={this.state.messageToast} onClose={() => this.setState({ showToast: false })} />
              <AdminModal showModal={this.state.showModal} messageModal={this.state.messageModal} onCancel={() => this.setState({ showModal: false })} onConfirm={this.handleConfirmDeleteTeam} />
            </div>
          ) : (
            <div className='app h-100 d-flex flex-column align-items-center justify-content-around'>
              <header>
                <div className='header' onClick={() => this.props.history.goBack()}>Retour</div>
              </header>
              <ConnectedContext.Consumer>
                {({ handleCheckControl }) => (
                  <AdminControl onInputChange={handleCheckControl} />
                )}
              </ConnectedContext.Consumer>
              <Footer link='/' libelle='Home' search='/' />
            </div>
          )}
      </Layout>
    )
  }
}

Admin.propTypes = {
  history: PropTypes.object
}

export default Admin
