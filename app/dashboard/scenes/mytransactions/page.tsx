"use client"
import { base_url } from "../../../../env.js"

import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet"
import { useNewTransaction } from '../../hooks/use_new_transaction'; // Adjust if necessary
import TransactionForm from '../transactionForm/page';

// type TransactionSheetProps = {

//     accountOptions: { label: string; value: string }[]; // List of accounts for dropdown
//     categoryOptions: { label: string; value: string }[]; // List of categories for dropdown
// }


type TransactionFormProps = {
    disabled?: boolean; // Optional boolean
};


const TransactionSheet = () => {
 
    const { isOpen, onClose } = useNewTransaction();

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-6 p-6 rounded-lg bg-white shadow-lg border border-gray-200">
                <SheetHeader className="border-b pb-4">
                    <SheetTitle className="text-xl font-bold text-gray-800">
                        New Transaction
                    </SheetTitle>
                    <SheetDescription className="text-sm text-gray-500">
                        Add a new transaction to track your income or expenses
                    </SheetDescription>
                </SheetHeader>

                <TransactionForm
                 disabled={false}
                />
            </SheetContent>
        </Sheet>
    )
}

export default TransactionSheet;
