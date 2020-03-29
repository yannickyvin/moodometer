import React from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import Vote from './pages/Vote'
import Report from './pages/Report'
import Admin from './pages/Admin'
import AdminReport from './pages/AdminReport'
import Home from './pages/Home'
import { ConnectedContext } from './components/ConnectedContext'

const accessPwd = process.env.REACT_APP_ADMIN_PWD

class App extends React.Component {
  constructor (props) {
    super(props)

    this.handleCheckControl = (value) => {
      if (value === accessPwd) {
        this.setState({ isConnected: true })
      }
    }

    this.state = {
      isConnected: false,
      handleCheckControl: this.handleCheckControl
    }
  }

  render () {
    return (
      <HashRouter>
        <Switch>
          <Route exact path='/' component={Vote} />
          <Route exact path='/home' component={Home} />
          <Route path='/report' component={Report} />
          <ConnectedContext.Provider value={this.state}>
            <Route path='/admin' component={Admin} />
            <Route path='/adminreport' component={AdminReport} />
          </ConnectedContext.Provider>
          <Redirect from='*' to='/' />
        </Switch>
      </HashRouter>
    )
  }
}

export default App
