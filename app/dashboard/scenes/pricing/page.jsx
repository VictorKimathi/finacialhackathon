"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function Crowd() {
  const [campaigns, setCampaigns] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");
  const [wallet, setWallet] = useState("");

  // Fetch campaigns on component mount
  useEffect(() => {
    console.log("Fetching campaigns...");
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      console.log("Making API request to fetch campaigns...");
      const response = await axios.get("http://127.0.0.1:5000/api/campaigns");
      console.log("API response received:", response);
      console.log("Response data:", response.data);
      setCampaigns(response.data);
      console.log("Campaigns state updated:", response.data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      console.log("Creating new campaign...");
      const response = await axios.post("http://127.0.0.1:5000/api/campaigns", {
        title,
        description,
        target,
        wallet,
      });
      console.log("New campaign created:", response.data);
      setCampaigns([...campaigns, response.data]);
      console.log("Campaigns state updated with new campaign:", [...campaigns, response.data]);
      alert("Campaign created successfully!");
      // Clear form fields after successful submission
      setTitle("");
      setDescription("");
      setTarget("");
      setWallet("");
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Stellar Crowdfunding</h1>
        <form onSubmit={handleCreateCampaign} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => {
              console.log("Title input changed:", e.target.value); // Debugging
              setTitle(e.target.value);
            }}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => {
              console.log("Description input changed:", e.target.value); // Debugging
              setDescription(e.target.value);
            }}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-gray-800"
          />
          <input
            type="number"
            placeholder="Target Amount"
            value={target}
            onChange={(e) => {
              console.log("Target input changed:", e.target.value); // Debugging
              setTarget(e.target.value);
            }}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
          />
          <input
            type="text"
            placeholder="Stellar Wallet Address"
            value={wallet}
            onChange={(e) => {
              console.log("Wallet input changed:", e.target.value); // Debugging
              setWallet(e.target.value);
            }}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Create Campaign
          </button>
        </form>
      </div>

      <div className="max-w-4xl mx-auto mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Campaigns</h2>
        <ul className="space-y-4">
          {campaigns.map((campaign, index) => (
            <li key={index} className="bg-white shadow-sm rounded-md p-4">
              <Link href={`/dashboard/scenes/campaigns/${index}`} className="text-blue-600 font-medium hover:underline">
                {campaign.title}
              </Link>
              <p className="text-gray-600">{campaign.description}</p>
              <p className="text-gray-600">Target: {campaign.target} XLM</p>
              <p className="text-gray-600">Wallet: {campaign.wallet}</p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(campaign.currentAmount / campaign.target) * 100}%` }}></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}