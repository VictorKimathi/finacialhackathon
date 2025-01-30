// "use client";
// import React, { useState } from 'react'
// import { UplaodButton } from '../../components/upload-button'
// import ImportCard from './import-card';

// const INITIAL_UPLOAD_RESULTS = {
//     data    : [],
//     errors  : [],
//     meta   : {}
// }


// const Variant = {
//     Import : 'Import',
//     Results : 'Results'
// }

// const page = () => {
//     const [variant, setVariant] = useState(Variant.Import);
//     //I want to trigger the screen that wwill contain the uploadeed information
//     const upload = (results: typeof INITIAL_UPLOAD_RESULTS) => {
//         console.log(results);
//         setImportResults(results);
//     }

//     const onCancelUPload = () => {
//         setImportResults(INITIAL_UPLOAD_RESULTS);
//         setVariant(Variant.Import);
//     }


//  const [importResults , setImportResults ] =  useState<typeof INITIAL_UPLOAD_RESULTS>(INITIAL_UPLOAD_RESULTS);
 
// //  if (variant === Variant.Results) {
// //      return (
// //          <div>
// //              <button onClick={onCancelUPload}>Back</button>
// //              <pre>{JSON.stringify(importResults, null, 2)}</pre>
// //          </div>
// //      )
// //     }



//   return (
//     <div>


//         <UplaodButton onUpload={upload} />
//         <ImportCard data={importResults.data} onCancel={onCancelUPload}  onSubmit={()=>{}}/>

//     </div>
//   )
// }

// export default page
"use client";
import React, { useState } from 'react';
import { UplaodButton } from '../../components/upload-button';
import ImportCard from './import-card';

const INITIAL_UPLOAD_RESULTS = {
    data: [],
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

    // Trigger screen to display uploaded information
    const upload = (results: typeof INITIAL_UPLOAD_RESULTS) => {
        console.log(results);
        setImportResults(results);
        setVariant(Variant.Results);
    };

    // Handle canceling upload
    const onCancelUpload = () => {
        setImportResults(INITIAL_UPLOAD_RESULTS);
        setVariant(Variant.Import);
    };

    // Render results or the upload form based on the variant
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
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <UplaodButton onUpload={upload} />
        </div>
    );
};

export default Page;
