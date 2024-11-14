// pages/financial-goals.js
import { useState, useEffect } from 'react';
import { useAuth } from '../../provider/auth-provider';

const FinancialGoals = () => {
  const { getToken } = useAuth();

  const [goals, setGoals] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the Django API
    const fetchGoals = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/financial-goals/', {
          method: 'GET',
          headers: {
            "Authorization": `Token ${getToken()}`,
            "Content-Type": "application/json",
          },
          credentials: 'include' // Optional: Use this if you need to send cookies
        });

        if (!response.ok) {
          throw new Error('Failed to fetch financial goals');
        }

        const data = await response.json();
        setGoals(data); // Assume data is an array of goals
      } catch (error) {
        setError(error.message);
      }
    };

    fetchGoals();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Financial Goals</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {goals.map((goal, index) => (
          <li key={index} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
            <h2>Goal Type: {goal.goal_type}</h2>
            <p>Amount Needed: ${goal.amount_needed}</p>
            <p>Duration (Weeks): {goal.duration_weeks}</p>
            <p>Description: {goal.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FinancialGoals;
