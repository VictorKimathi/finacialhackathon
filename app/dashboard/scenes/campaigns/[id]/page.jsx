"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function CampaignDetails() {
  const params = useParams();
  const { id } = params; // Access the dynamic `id` parameter

  const [campaign, setCampaign] = useState(null);
  const [contributions, setContributions] = useState([]); // Initialize as an empty array
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch campaign details and contributions
  useEffect(() => {
    if (id) {   
      fetchCampaignDetails();
      fetchContributions();
    }
  }, [id]);

  const fetchCampaignDetails = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/campaigns/${id}`);
      setCampaign(response.data.campaign);
    } catch (error) {
      console.error("Error fetching campaign details:", error);
      setError("Failed to fetch campaign details");
    }
  };

  const fetchContributions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:5000/api/campaigns/${id}`);
      console.log("Contributions API response:", response.data);
      if (Array.isArray(response.data.data)) {
        setContributions(response.data.data);
      } else {
        setError("Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching contributions:", error);
      setError("Failed to fetch contributions");
    } finally {
      setLoading(false);
    }
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending contribution request:", { campaign_id: parseInt(id), amount: parseFloat(amount) });
      const response = await axios.post("http://127.0.0.1:5000/api/contribute", {
        campaign_id: parseInt(id),  // Ensure `campaign_id` is an integer
        amount: parseFloat(amount), // Ensure `amount` is a number
      });
      alert(response.data.message);
      fetchContributions(); // Refresh contributions after successful contribution
      setAmount(""); // Clear the input field after submission
    } catch (error) {
      console.error("Error contributing:", error);
      alert("Failed to contribute. Check the console for details.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!campaign) return <p>Campaign not found</p>;

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{campaign.title}</h1>
        <p className="text-gray-600 mb-4">{campaign.description}</p>
        <p className="text-gray-600 mb-4">Target: {campaign.target} XLM</p>
        <p className="text-gray-600 mb-4">Wallet: {campaign.wallet}</p>

        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(campaign.currentAmount / campaign.target) * 100}%` }}></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Contributions</h2>
        <ul className="space-y-2">
          {Array.isArray(contributions) && contributions.length > 0 ? (
            contributions.map((contribution, index) => (
              <li key={index} className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-700">
                  {contribution.amount} XLM from {contribution.from} at {contribution.timestamp}
                </p>
                <p className="text-gray-500 text-sm">Transaction Hash: {contribution.transaction_hash}</p>
              </li>
            ))
          ) : (
            <p className="text-gray-600">No contributions found.</p>
          )}
        </ul>

        <form onSubmit={handleContribute} className="mt-6">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => {
              console.log("Amount input changed:", e.target.value); // Debugging
              setAmount(e.target.value);
            }}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4 text-gray-800"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Contribute
          </button>
        </form>
      </div>
    </div>
  );
}