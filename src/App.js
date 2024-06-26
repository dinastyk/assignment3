/*==================================================
src/App.js

This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

// Import other components
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import Debits from './components/Debits';

class App extends Component {
  constructor() {  // Create and initialize state
    super(); 
    this.state = {
      accountBalance: 0,
      creditList: [],
      debitList: [],
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '11/22/99',
      }
    };
  }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser};
    newUser.userName = logInInfo.userName;
    this.setState({currentUser: newUser})
  }

updatebalance = (updatedbalance) => {
  this.setState({
  accountBalance: updatedbalance
  });
}

  updatecredit = (updatedcredit) => {
    this.setState({
      creditList:[...this.state.creditList, updatedcredit]
    })
  }
  
//calculates the sum
  accountBalancesums = () => {
    const creditsum = this.state.creditList.reduce((creditsum, credit) => creditsum + credit.amount, 0);
    const debitsum = this.state.debitList.reduce((debitsum, debit) => debitsum + debit.amount, 0);
    return creditsum - debitsum;
  }

  // Update balance sum when "Credit" or "Debit" button is pressed on
  Creditadd = (credit) => {
    let updatedbalance = this.state.accountBalance + credit.amount;
    this.setState({
      accountBalance: updatedbalance
    });
  }

  debitadd = (debit) => {
    let updatedbalance = this.state.accountBalance - debit.amount;
    this.setState({
      accountBalance: updatedbalance
    });
  }

//using api for credit and debit
  componentDidMount() {
    fetch('https://johnnylaicode.github.io/api/credits.json')
      .then((response) => response.json())
      .then((data) => {
        this.setState({creditList: data}, () => {
          this.accountBalancesums()})
      }).then(() => {
        fetch('https://johnnylaicode.github.io/api/debits.json')
        .then((response) => response.json())
        .then((data) => {
          this.setState({debitList: data}, () => {
            this.accountBalancesums()})
          })
      });


  }

  // Create Routes and React elements to be rendered using React components
  render() {  
    // Create React elements and pass input props to components
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance} />)
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
    )
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)
    const CreditsComponent = () => (<Credits credits={this.state.creditList} 
    balance={this.state.accountBalance}
    updatebalance={this.updatebalance}
    updatecredit = {this.updatecredit}/>) 

    const DebitsComponent = () => (<Debits debits={this.state.debitList} 
    accountBalance ={this.state.accountBalance}/>) 

    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    // //bank-of-react-starter-code"
    return (
      <Router basename="/assignment3"> 
        <div>
          <Route exact path="/" render={HomeComponent}/>
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
        </div>
      </Router>
    );
  }
}

export default App;