import React, { Component } from 'react';
import MainContainner from './components/MainContainner.js'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

const reducer = function(state, action) {

  switch(action.type) {
    case 'homepage': 
      return {...state, showHomepage: action.content, showOrgPage: false};

    case 'getItems':
      return {...state, items: action.content};

    case 'orgSignUp':
      return {...state, showOrgSignUp: action.content, showHomepage: false};
    
    case 'buyerSignUp' :
      return { ...state, showBuyerSignUp: action.content, showHomepage: false}

    case 'logIn':
      return { ...state, showLogIn: action.content, showHomepage: false};
    
    case 'showOrgPage':
      return { ...state, showLogIn: false, orgId: action.content, showOrgPage: true, 
                  showCreateListing: false, showUpdateItemPage: false, showHomepage:false
              };

    case 'setOrg':
      return { ...state, currentOrg: action.content};

    case 'showCreateL':
      return { ...state, showCreateListing: action.content, showOrgPage: false, showUpdateItemPage: false};
    
    case 'showBuyerPage':
      return { ...state, showLogIn: false, buyerId: action.content, showBuyerPage: true};

    case 'setBuyer':
      return { ...state, currentBuyer: action.content}
    
    case 'showEditItem':
      return { ...state, showUpdateItemPage: true, item: action.content, showOrgPage: false}
    
  }
  return state;
}

let myStore = createStore(
  reducer,
  {
    showHomepage: true,
    showOrgSignUp: false,
    showBuyerSignUp: false,
    showLogIn: false,
    showOrgPage: false,
    showCreateListing: false,
    showBuyerPage: false,
    showUpdateItemPage: false,
    items: [],
    orgId: "",
    currentOrg: [],
    buyerId: "",
    currentBuyer: [],
    item: {}
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