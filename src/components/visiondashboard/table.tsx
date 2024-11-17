import { useState, useEffect, use } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component';


// components
import Loading from '@/components/Loading'
import ErrorDisplayer from '@/components/Error'

// context
import { useVisionBoardContext } from '@/contexts/VisionBoardContext';
// utils
import { initData, EventTableDataType, fetchEventTableData } from '@/utils/visiondashboard/fetchEventTableData'
type tableData = {
    timestamp: string
    agent_name: string
    rule_description: string
    rule_mitre_tactic: string
    rule_mitre_id: string
    rule_level: number
}


export default function Table() {
    const { dateTimeRange } = useVisionBoardContext()
    const [useSampleData, setUseSampleData] = useState<boolean>(false); // 新增變數來決定資料來源(測試用)
    const [eventTableData, setEventTableData] = useState<EventTableDataType[]>([
        {
            "timestamp": "2024-11-12T08:06:19.475000+00:00",
            "agent_name": "poc2_001",
            "rule_description": "User account changed",
            "rule_mitre_tactic": "Persistence",
            "rule_mitre_id": "T1098",
            "rule_level": 8
        },
        {
            "timestamp": "2024-11-12T08:06:19.475000+00:00",
            "agent_name": "poc2_001",
            "rule_description": "User account changed",
            "rule_mitre_tactic": "Persistence",
            "rule_mitre_id": "T1098",
            "rule_level": 8
        },
        {
            "timestamp": "2024-11-12T08:06:19.475000+00:00",
            "agent_name": "poc2_001",
            "rule_description": "User account changed",
            "rule_mitre_tactic": "Persistence",
            "rule_mitre_id": "T1098",
            "rule_level": 8
        },
    ])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1); // 新增狀態管理當前頁碼
    const itemsPerPage = 5; // 固定每頁顯示5列
    const totalPages = Math.ceil(eventTableData.length / itemsPerPage); // 計算總頁數

    // 計算當前頁的資料
    const currentItems = eventTableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        const fetchData = async () => {
            if (isLoading) return;
            setIsLoading(true);
            try {
                if (!useSampleData && dateTimeRange?.start && dateTimeRange?.end) {
                    const result = await fetchEventTableData({ id: 0, start: dateTimeRange?.start, end: dateTimeRange?.end });
                    if (result.success) {
                        setEventTableData(result.content.datas);
                    } else {
                        throw new Error('Failed to fetch event table data');
                    }
                }
            } catch (error) {
                console.log(error);
                setError("Failed to fetch event table data 😢. Please try again later.");
                setTimeout(() => {
                    setError(null);
                }, 3000);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [dateTimeRange, useSampleData]); // 添加 useSampleData 作為依賴

    const adjustTime = (timeString: string) => {
        const date = new Date(timeString);
        date.setHours(date.getHours() + 8);
        return date.toISOString().replace('T', ' ').slice(0, 19);
    };


    const columns: TableColumn<tableData>[] = [
        {
            name: 'timestamp',
            selector: (row) => row.timestamp.slice(0, 10),
            sortable: true,
            width: '110px',
        },
        {
            name: 'agent_name',
            selector: (row) => row.agent_name,
            sortable: true,
            width: '120px',
        },
        {
            name: 'rule_description',
            selector: (row) => row.rule_description,
            sortable: true,
            width: '145px',

        },
        {
            name: 'rule_mitre_tactic',
            selector: (row) => row.rule_mitre_tactic,
            sortable: true,
            width: '140px',
        },
        {
            name: 'rule_mitre_id',
            selector: (row) => row.rule_mitre_id,
            sortable: true,
            width: '100px',
        },
        {
            name: 'rule_level',
            selector: (row) => row.rule_level,
            sortable: true,
            width: '100px',
        },



    ]

    return (



        <div className="flex flex-col rounded-xl w-full ">
            {error && <ErrorDisplayer errorMessage={error} setError={setError} />}
            <DataTable
                columns={columns}
                data={eventTableData}
                pagination
                highlightOnHover
                pointerOnHover
                paginationPerPage={3}
                paginationRowsPerPageOptions={[3, 6, 9, 12]}
            />



        </div>
    )
}