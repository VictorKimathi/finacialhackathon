import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type Props = {
    headers: string[]; // Ensure this is always passed as an array
    body: string[][]; // Fix to array of arrays of strings
    selectedColumns: Record<string, string | null>;
    onTableHeadSelectChange: (columnIndex: number, value: string | null) => void;
};

const ImportTable = ({
    headers = [], // Default value to empty array if headers is undefined
    body,
    selectedColumns,
    onTableHeadSelectChange
}: Props) => {
    if (!Array.isArray(headers)) {
        return <div>Error: Headers data is not an array</div>;
    }

    return (
        <div className='overflow-hidden rounded-md border'>
            <Table>
                <TableHeader className='bg-muted'>
                    <TableRow>
                        {headers.length > 0 ? (
                            headers.map((header, index) => (
                                <TableHead key={index}>
                                    {header} {/* Display the actual header */}
                                </TableHead>
                            ))
                        ) : (
                            <TableHead>No headers available</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {body.length > 0 ? (
                        body.map((row: string[], rowIndex) => (
                            <TableRow key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <TableCell key={cellIndex}>
                                        {cell}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell>No data available</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default ImportTable;
