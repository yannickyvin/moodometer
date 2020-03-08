import React from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import Vote from './pages/Vote'
import Report from './pages/Report'
import Admin from './pages/Admin'
import Home from './pages/Home'

const App = () => (
  <HashRouter>
    <Switch>
      <Route exact path='/' component={Vote} />
      <Route exact path='/home' component={Home} />
      <Route path='/report' component={Report} />
      <Route path='/admin' component={Admin} />
      <Redirect from='*' to='/' />
    </Switch>
  </HashRouter>
)

export default App
