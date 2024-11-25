'use client'

import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { getEvents } from '@/features/deprecated/vision_board/api/getEvents';
import { useVisionBoardContext } from '@/features/deprecated/vision_board/contexts/VisionBoardContext';
import ErrorDisplayer from '@/app/deprecated/vision_board/components/Error';
import Loading from '@/app/deprecated/vision_board/components/Loading';
import { EventTableRow } from '@/features/deprecated/vision_board/types';
import { formatTimestamp } from '@/features/deprecated/vision_board/utils/formatTime';

export default function EventTable() {
    const { dateTimeRange } = useVisionBoardContext();
    const [eventTableData, setEventTableData] = useState<EventTableRow[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (dateTimeRange?.start && dateTimeRange?.end) {
                    const result = await getEvents({
                        id: 0,
                        start: dateTimeRange.start,
                        end: dateTimeRange.end
                    });
                    if (result.success) {
                        setEventTableData(result.content.datas);
                    } else {
                        throw new Error('Failed to fetch event table data');
                    }
                }
            } catch (error) {
                console.error(error);
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
    }, [dateTimeRange]);

    // Calculate current page data
    const currentItems = eventTableData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const columns: TableColumn<EventTableRow>[] = [
        {
            name: '時間戳記',
            selector: row => formatTimestamp(row.timestamp).slice(0, 10),
            sortable: true,
            width: '200px',
        },
        {
            name: '場域設備',
            selector: row => row.agent_name,
            sortable: true,
            width: '200px',
        },
        {
            name: '規則說明',
            selector: row => row.rule_description,
            sortable: true,
            width: '400px',
        },
        {
            name: 'MITRE 策略',
            selector: row => row.rule_mitre_tactic,
            sortable: true,
            width: '200px',
        },
        {
            name: '規則 MITRE 編號',
            selector: row => row.rule_mitre_id,
            sortable: true,
            width: '200px',
        },
        {
            name: '規則級別',
            selector: row => row.rule_level,
            sortable: true,
            width: '10px',
        },
    ];

    return (
        <div className="flex flex-col rounded-xl w-full">
            {error && <ErrorDisplayer errorMessage={error} setError={setError} />}
            {isLoading ? (
                <Loading />
            ) : (
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
                    onChangePage={(page) => {
                        setCurrentPage(page);
                    }}
                />
            )}
        </div>
    );
}
