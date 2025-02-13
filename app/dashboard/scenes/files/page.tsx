"use client";
import React, { useState } from 'react';
import { UplaodButton } from '../../components/upload-button';
import ImportCard from './import-card';
import axios from 'axios';
import { base_url } from '@/env';
import { useAuth } from '../../provider/auth-provider';

const INITIAL_UPLOAD_RESULTS = {
    data: [] as string[][],
    errors: [],
    meta: {},
};

const Variant = {
    Import: 'Import',
    Results: 'Results',
};

const Page = () => {
    const [variant, setVariant] = useState(Variant.Import);
    const [importResults, setImportResults] = useState<typeof INITIAL_UPLOAD_RESULTS>(INITIAL_UPLOAD_RESULTS);
    const [isLoading, setIsLoading] = useState(false);
    const { getToken } = useAuth();
    const [data, setData] = useState("");

    const submitNewMessage = async (csv_data: string) => {
        if (!csv_data.trim()) return;
        setIsLoading(true);

        try {
            const response = await axios.post(
                `${base_url}/api/chat/csv_chat/`,
                { message: csv_data },
                {
                    headers: {
                        "Authorization": `Token ${getToken()}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const assistantReply = response.data.response;
            console.log("Assistant reply:", assistantReply);
            setData(assistantReply);

        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const upload = (results: typeof INITIAL_UPLOAD_RESULTS) => {
        console.log("Incoming results:", results.data);
        const csv_data = JSON.stringify(results.data);
        submitNewMessage(csv_data);
        setImportResults(results);
        setVariant(Variant.Results);
    };

    const onCancelUpload = () => {
        setImportResults(INITIAL_UPLOAD_RESULTS);
        setVariant(Variant.Import);
    };

    if (variant === Variant.Results) {
        return (
            <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={onCancelUpload}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                    >
                        Back
                    </button>
                    <button
                        onClick={onCancelUpload}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                    >
                        Cancel Upload
                    </button>
                </div>

                <h2 className="text-2xl font-semibold mb-6 text-gray-800">CSV Contents:</h2>
                <div className="w-full max-w-4xl overflow-x-auto border rounded-lg shadow-sm bg-white">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                {importResults.data[0] && importResults.data[0].map((header: string, index: number) => (
                                    <th key={index} className="border-b px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {importResults.data.slice(1).map((row: string[], rowIndex: number) => (
                                <tr key={rowIndex} className="hover:bg-gray-50 transition duration-200">
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="border-b px-6 py-4 text-sm text-gray-700">
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <ImportCard
                    data={importResults.data}
                    onCancel={onCancelUpload}
                    onSubmit={() => {
                        // Handle the submit action here
                    }}
                />

                {data && (
                    <div className="mt-8 w-full max-w-4xl">
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">AI Insights:</h3>
                            <p className="text-gray-700 whitespace-pre-wrap">{data}</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Upload Your CSV File</h1>
            <p className="text-gray-600 text-center mb-8 max-w-2xl">
                Please select a CSV file from your computer. The first row should contain column headers, and the data should be properly formatted.
                After uploading, you'll be able to preview the contents and confirm before proceeding.
            </p>
            <UplaodButton onUpload={upload} />
            {isLoading && (
                <div className="mt-6 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="ml-3 text-gray-700">Loading...</p>
                </div>
            )}
        </div>
    );
};

export default Page;