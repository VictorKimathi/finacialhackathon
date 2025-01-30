import { CardTitle } from '@/components/ui/card';
import { Button, Card, CardContent, CardHeader } from '@mui/material';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import ImportTable from './import-table';

const requiredOptions = ["date", "Amount", "payee"];

interface SelectedColumnState {
  [key: string]: string | null;
}

type Props = {
  data: string[][]; // Fix type to string[][] instead of String[][]
  onCancel: () => void; // Fix typo 'Cancle' to 'Cancel'
  onSubmit: () => void; // Fix typo 'Sumbit' to 'Submit'
}

const ImportCard = ({
  onCancel, 
  onSubmit, 
  data
}: Props) => {

  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnState>({});
  const headers = data[0];
  const body = data.slice(1);

  return (
    <div>
      <Card className="border-none drop-shadow-sm bg-blue-950">
        <div className="max-w-screen-2xl mx-auto w-full pb-10 mt-24">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl line-clamp-1">
              Import Transactions
            </CardTitle>
            <div className="flex items-center gap-x-2">
              <Button onClick={()=>{}} size="sm">
                <Plus className="size-4 mr-2" />
                Add new
              </Button>
              {/* <UploadButton onUpload={onUpload} /> */}
            </div>
          </CardHeader>
          <CardContent>
            <ImportTable
              headers={headers}
              body={body}
              selectedColumns={selectedColumns} // Fix prop name to selectedColumns
              onTableHeadSelectChange={() => {}} // Fix prop name to onTableHeadSelectChange
            />
            {/* You, 4 hours ago • 14 transactions form */}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

export default ImportCard;
