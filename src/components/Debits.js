import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Debits = (props) => {
  const [debits, setDebits] = useState([]);
  const [newDebit, setNewDebit] = useState({ amount: '', description: '' });
  const [totalDebits, setTotalDebits] = useState(0);
  const [finalBalance, setFinalBalance] = useState(null);


  useEffect(() => {
    fetch('https://johnnylaicode.github.io/api/debits.json')
      .then(response => response.json())
      .then(data => setDebits(data))
      .catch(error => console.error('Error fetching debits:', error));
  }, []);

  useEffect(() => {
    const sumDebits = debits.reduce((total, debit) => total + parseFloat(debit.amount), 0);
    setTotalDebits(sumDebits);
  }, [debits]);


  useEffect(() => {
    fetch('https://johnnylaicode.github.io/api/credits.json')
      .then(response => response.json())
      .then(data => {
        const sumCredits = data.reduce((total, credit) => total + parseFloat(credit.amount), 0);
        const finalAmount = sumCredits - totalDebits;
        setFinalBalance(finalAmount);
      })
      .catch(error => console.error('Error fetching credits:', error));
  }, [totalDebits]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDebit(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = newDebit.amount.trim() === '' ? '0' : newDebit.amount; 
    const newDebitWithDate = {
      ...newDebit,
      amount: amount.toString(),
      date: new Date().toISOString()
    };
    setDebits(prevDebits => [...prevDebits, newDebitWithDate]);
    setNewDebit({ amount: '', description: '' });

  };

  const debitsGrid = () => {
    return (
      <div className="d-flex">
        <div className="debits-grid">
          <div className="debit-row">
            <div className="debit-column">
              <p><b><u>Amount</u></b></p>
              {debits.map((debit, index) => (
                <p key={index}>{debit.amount}</p>
              ))}
            </div>
            <div className="debit-column">
              <p><b><u>Description</u></b></p>
              {debits.map((debit, index) => (<p key={index}>{debit.description}</p>
              ))}
            </div>
            <div className="debit-column">
              <p><b><u>Date</u></b></p>
              {debits.map((debit, index) => (
                <p key={index}>{debit.date.slice(0, 10)}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1>Debits</h1> {debitsGrid()}

<form onSubmit={handleSubmit}>
  <input type="text" name="description" placeholder="Enter Description" value={newDebit.description} onChange={handleInputChange} />
  <input type="number" name="amount" placeholder="Enter Amount" value={newDebit.amount} onChange={handleInputChange} />
  <button type="submit">Add Debit</button>
</form>

<br/>
<Link to="/">Return to Home</Link>
<br/>
<br/>
<br/>


{finalBalance !== null && (
  <div>
    <h2>Account Balance: {finalBalance.toFixed(2)}</h2>
  </div>
)}
 </div>
    );
  };

export default Debits;

