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
            setData(assistantReply)
            // Handle the assistant's reply as needed

        } catch (error) {
            console.error("Error sending message:", error);
            // Optionally, set an error message in the state to display to the user
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
            <div className="flex flex-col items-center">
                <div className="flex gap-4 mb-4">
                    <button
                        onClick={onCancelUpload}
                        className="px-4 py-2 bg-gray-500 text-white rounded"
                    >
                        Back
                    </button>
                    <button
                        onClick={onCancelUpload}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Cancel Upload
                    </button>
                </div>

                <h2 className="text-xl font-semibold mb-4">CSV Contents:</h2>
                <div className="overflow-x-auto border rounded-md">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                {importResults.data[0] && importResults.data[0].map((header: string, index: number) => (
                                    <th key={index} className="border-b px-4 py-2">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {importResults.data.slice(1).map((row: string[], rowIndex: number) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="border-b px-4 py-2">{cell}</td>
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

                <div>
                    {data ?
                        <div>
                            {data}
                        </div> : ""
                    }
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Upload Your CSV File</h1>
            <p className="text-gray-600 text-center mb-6 max-w-lg">
                Please select a CSV file from your computer. The first row should contain column headers, and the data should be properly formatted.
                After uploading, you'll be able to preview the contents and confirm before proceeding.
            </p>
            <UplaodButton onUpload={upload} />
            {isLoading && <p className="mt-4">Loading...</p>}
        </div>
    );
};

export default Page;