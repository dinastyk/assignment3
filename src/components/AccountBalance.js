/*==================================================
src/components/AccountBalance.js

The AccountBalance component displays account balance. It is included in other page views.
==================================================*/
import React, {Component} from 'react';

class AccountBalance extends Component {
  state = {
    debitSum: 0,
    creditSum: 0,
    balance: 0,
    loading: true
  };

  componentDidMount() {
    this.fetchDebits();
    this.fetchCredits();
  }

  fetchDebits = () => {
    fetch('https://johnnylaicode.github.io/api/debits.json')
      .then(response => response.json())
      .then(data => {
        const debitSum = data.reduce((total, item) => total + item.amount, 0);
        this.setState({ debitSum });
      })
      .catch(error => console.error('Error fetching debits:', error));
  };

  fetchCredits = () => {
    fetch('https://johnnylaicode.github.io/api/credits.json')
      .then(response => response.json())
      .then(data => {
        const creditSum = data.reduce((total, item) => total + item.amount, 0);
        this.setState({ creditSum, loading: false });
      })
      .catch(error => console.error('Error fetching credits:', error));
  };

  calculateBalance = () => {
    const { debitSum, creditSum } = this.state;
    const balance = creditSum - debitSum;
    return balance;
  };

  

  render() {
    const { loading } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    const balance = this.calculateBalance();

    return (
      <div>
        <h2>Account Balance: ${balance}</h2>
      </div>
    );
  }
}

export default AccountBalance;