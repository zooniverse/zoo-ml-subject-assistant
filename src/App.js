import React from 'react'
import { HashRouter as Router, Route, Link } from 'react-router-dom'

import { AppContext } from './store/AppContext'
import AppStore from './store/AppStore'
import Header from './Header'
import Form from './Form'

const Home = () => <div><Link to="/form">Form</Link></div>

class App extends React.Component {
  constructor () {
    super()
    
    this.store = AppStore.create({
      name: 'Shaun',
      job: 'wizard',
    })
  }
  
  render () {
    return (
      <AppContext.Provider value={{ name: 'shaun', job: 'developer' }}>
        <>
          <Header />
          <main>
            <Router>
              <Route path="/" exact component={Home} />
              <Route path="/form" component={Form} />
            </Router>
          </main>
          <footer>Footer</footer>
        </>
      </AppContext.Provider>
    )
  }
}

export default App
