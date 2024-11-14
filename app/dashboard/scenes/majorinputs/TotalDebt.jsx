// pages/total-debt.js
import { useState, useEffect } from 'react';

// Placeholder function for retrieving the token
import { useAuth } from '../../provider/auth-provider';

const TotalDebt = () => {
  const { getToken } = useAuth();

  const [totalDebt, setTotalDebt] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalDebt = async () => {
      try {
        // Updated URL for the debts endpoint
        const response = await fetch(`http://localhost:8000/api/debts/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${getToken()}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch debts');
        }

        const data = await response.json();
        console.log('Debts data:', data);
        setTotalDebt(data); // Assuming the response is an array of debts
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTotalDebt();
  }, [getToken]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Total Debt</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {totalDebt.length > 0 ? (
          totalDebt.map((debt, index) => (
            <li key={index} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
              <h2>Debt Name: {debt.debt_name}</h2>
              <p>Debt Type: {debt.debt_type}</p>
              <p>Amount: ${debt.amount}</p>
            </li>
          ))
        ) : (
          <p>No debts found.</p>
        )}
      </ul>
    </div>
  );
};

export default TotalDebt;
