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
    const [itemsPerPage, setItemsPerPage] = useState(5); // 新增狀態管理每頁顯示的資料筆數
    const totalPages = Math.ceil(eventTableData.length / itemsPerPage); // 計算總頁數

    // 計算當前頁的資料
    const currentItems = eventTableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    useEffect(() => {
        console.log(currentPage);
    }, [currentPage]);




    useEffect(() => {
        const fetchData = async () => {

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
        setIsLoading(true);
        fetchData();
    }, [dateTimeRange, useSampleData]); // 添加 useSampleData 作為依賴

    const adjustTime = (timeString: string) => {
        const date = new Date(timeString);
        date.setHours(date.getHours() + 8);
        return date.toISOString().replace('T', ' ').slice(0, 19);
    };


    const columns: TableColumn<tableData>[] = [
        {
            name: '時間戳記',
            selector: (row) => row.timestamp.slice(0, 10),
            sortable: true,
            width: '200px',
        },
        {
            name: '場域設備',
            selector: (row) => row.agent_name,
            sortable: true,
            width: '200px',
        },
        {
            name: '規則說明',
            selector: (row) => row.rule_description,
            sortable: true,
            width: '400px',

        },
        {
            name: 'MITRE 策略',
            selector: (row) => row.rule_mitre_tactic,
            sortable: true,
            width: '200px',
        },
        {
            name: '規則 MITRE 編號',
            selector: (row) => row.rule_mitre_id,
            sortable: true,
            width: '200px',
        },
        {
            name: '規則級別',
            selector: (row) => row.rule_level,
            sortable: true,
            width: '10px',
        },



    ]

    return (
        <div className="flex flex-col rounded-xl w-full ">
            {error && <ErrorDisplayer errorMessage={error} setError={setError} />}
            {
                isLoading ? <Loading /> :
                    <DataTable
                        columns={columns}
                        data={currentItems}
                        pagination
                        paginationServer
                        paginationTotalRows={eventTableData.length}
                        paginationPerPage={itemsPerPage}
                        paginationRowsPerPageOptions={[5, 10, 15, 20]}
                        onChangeRowsPerPage={(currentRowsPerPage) => {
                            setItemsPerPage(currentRowsPerPage);
                        }}
                        onChangePage={(currentPage) => {
                            setCurrentPage(currentPage);
                        }}
                    />
            }



        </div>
    )
}