import { useState, useEffect } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component';
type tableData = {
    vulnerability: string,
    count: number
}

export default function Table() {
    const [agentsData, setAgentsData] = useState<any[]>([
        { "vulnerability": "CVE-2024-44244", "count": 50 },
        { "vulnerability": "CVE-2024-40857", "count": 48 },
        { "vulnerability": "CVE-2024-40866", "count": 48 },
        { "vulnerability": "CVE-2024-44155", "count": 48 },
        { "vulnerability": "CVE-2024-44187", "count": 48 }
    ])
    const columns: TableColumn<tableData>[] = [
        {
            name: 'Vulnerability',
            selector: (row) => row.vulnerability,
            sortable: true,
            width: '150px',
        },
        {
            name: 'Count',
            selector: (row) => row.count,
            sortable: true,
            width: '120px',
        }
    ]

    return (
        <div className='flex flex-col gap-2 min-h-96'>

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Vision Board</h1>
            </div>
            <div className="flex flex-col gap-2">
                <DataTable
                    columns={columns}
                    data={agentsData}
                    pagination
                    highlightOnHover
                    pointerOnHover
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
                />
            </div>


        </div>
    )
}