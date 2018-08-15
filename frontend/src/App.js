import React, { Component } from 'react';
import MainContainner from './components/MainContainner.js'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

const reducer = function(state, action) {
  if(action.type === 'homepage'){
    return {...state, showHomepage: action.content}
  }
  if(action.type === 'orgSignUp'){
    return { ...state, showOrgSignUp: action.content}
  }
  if(action.type === 'logIn'){
    return { ...state, showLogIn: action.content}
  }
  return state;
}

let myStore = createStore(
  reducer,
  {
    showHomepage: true,
    showOrgSignUp: false,
    showLogIn: false,
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

class App extends Component {
  render() {
    console.log(myStore.getState())
    return (
      <Provider store={myStore}>
        <MainContainner />
      </Provider>
    );
  }
}

export default App;
