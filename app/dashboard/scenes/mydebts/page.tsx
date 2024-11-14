"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../provider/auth-provider';

import { base_url } from "../../../../env.js"
const DebtForm = () => {
  const { getToken } = useAuth();

  // Define debt types
  const DEBT_TYPES = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'personal_loan', label: 'Personal Loan' },
    { value: 'mortgage', label: 'Mortgage' },
    { value: 'student_loan', label: 'Student Loan' },
    { value: 'other', label: 'Other' },
  ];

  const [debt, setDebt] = useState([{ amount: '', debt_type: '', debt_name: '' }]);
  const [successMessage, setSuccessMessage] = useState('');

  // Function to handle adding new debt entry
  const handleAddDebt = () => {
    setDebt([...debt, { amount: '', debt_type: '', debt_name: '' }]);
  };

  // Function to handle form submission
  const saveDebtData = async (debtData) => {
    try {
      const debtPayload = {
        amount: debtData.amount,
        debt_type: debtData.debt_type,
        status: "active",
        name: debtData.debt_name,
      };

      const response = await axios.post(
        `${base_url}/api/debts`,
        debtPayload,
        {
          headers: {
            Authorization: `Token ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Debt saved:", response.data);
      return true; // Return true on success
    } catch (error) {
      console.error("Error saving debt:", error);
      return false; // Return false on error
    }
  };

  // Function to handle input changes
  const handleInputChange = (index, field, value) => {
    setDebt(debt.map((debtItem, i) =>
      i === index ? { ...debtItem, [field]: value } : debtItem
    ));
  };

  // Function to submit all debts
  const handleSubmit = async () => {
    const promises = debt.map(saveDebtData);
    const results = await Promise.all(promises);

    // Check if all debts were successfully saved
    if (results.every(result => result === true)) {
      setSuccessMessage("All debts saved successfully! Reloading...");

      // Clear fields
      setDebt([{ amount: '', debt_type: '', debt_name: '' }]);

      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      alert("Some debts could not be saved. Please try again.");
    }
  };

  return (
    <div className="debt-form space-y-4">
      {successMessage && (
        <div className="success-message bg-green-200 text-green-700 p-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {debt.map((d, index) => (
        <div key={index} className="input-group space-y-2 p-4 border border-gray-200 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-black">Debt Amount:</label>
          <input
            type="number"
            placeholder="Debt Amount"
            className="input-field w-full p-2 border border-gray-300 rounded-md text-black text-base"
            value={d.amount}
            onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
          />

          <label className="block text-sm font-medium text-black">Debt Type:</label>
          <select
            className="input-field w-full p-2 border border-gray-300 rounded-md text-black text-base"
            value={d.debt_type}
            onChange={(e) => handleInputChange(index, 'debt_type', e.target.value)}
          >
            <option value="">Select Debt Type</option>
            {DEBT_TYPES.map((type) => (
              <option key={type.value} value={type.value} className="text-black">
                {type.label}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium text-black">Debt Name:</label>
          <input
            type="text"
            placeholder="Debt Name"
            className="input-field w-full p-2 border border-gray-300 rounded-md text-black text-base"
            value={d.debt_name}
            onChange={(e) => handleInputChange(index, 'debt_name', e.target.value)}
          />
        </div>
      ))}

      <button
        onClick={handleAddDebt}
        className="button add-debt bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600"
      >
        + Add Debt
      </button>

      <button
        onClick={handleSubmit}
        className="button submit-debt bg-green-500 text-white py-2 px-4 mt-4 rounded-lg shadow hover:bg-green-600"
      >
        Submit Debts
      </button>
    </div>
  );
};

export default DebtForm;
