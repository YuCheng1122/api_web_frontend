'use client'
import Table from '../../components/visiondashboard/table'
import PieGraph from '@/components/agentdashboard/PieGraph'
import BarChartComponent from '@/components/visiondashboard/bar'
import EventTrendGraph from '@/components/visiondashboard/EventTrendGraph'

export default function Visionboardpage() {
    // pie graph data
    const data = [
        { value: 1048, name: 'CVE-2024-44244' },
        { value: 735, name: 'CVE-2024-40857' },
        { value: 580, name: 'CVE-2024-40866' },
        { value: 484, name: 'CVE-2024-44155' },
        { value: 300, name: 'CVE-2024-44187' }
    ]

    return (
        <>
            <div className='min-h-[90vh] p-3 bg-gray-100 rounded-lg overflow-scroll'>
                <div className="h-full w-full relative bg-white flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Vision Board</h1>
                    </div>
                    <div className='flex flex-row gap-2 min-h-48'>
                        <PieGraph title="Vulnerability" data={data} />
                        <PieGraph title="Vulnerability" data={data} />
                    </div>
                    <div className="flex flex-row gap-2">
                        <Table />
                        <Table />
                    </div>
                    <div className="flex flex-row gap-2">
                        <BarChartComponent />
                        <BarChartComponent />

                    </div>
                    <div className="flex flex-row gap-2">
                        <EventTrendGraph />

                    </div>

                    <div className='flex flex-row gap-2 min-h-48'>
                        <PieGraph title="Vulnerability" data={data} />
                        <PieGraph title="Vulnerability" data={data} />
                    </div>


                </div>
            </div>
        </>
    )
}