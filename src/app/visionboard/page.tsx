'use client'
import Table from '../../components/visiondashboard/table'
import BarChartComponent from '@/components/visiondashboard/bar'
import EventTrendGraph from '@/components/visiondashboard/EventTrendGraph'
import AlertComponent from '@/components/visiondashboard/alert'
import DateTimeFilter from '@/components/visiondashboard/DateTimeFilter'
import AgentNamePie from '@/components/visiondashboard/agentname-pie'
import AgentOSPie from '@/components/visiondashboard/agentos-pie'
import AgentSummaryPie from '@/components/visiondashboard/agentsummary-pie'
import AgentAuthenticationPie from '@/components/visiondashboard/authentication_pie'



export default function Visionboardpage() {


    return (
        <>
            <div className='h-full p-3 bg-gray-100 rounded-lg '>
                <div className="h-full w-full flex flex-wrap  ">
                    <div className="flex flex-col gap-2 w-full h-1/2">
                        <DateTimeFilter />
                    </div>
                    <div className='flex flex-col gap-2 xl:w-2/5  h-full w-full p-5 '>


                        <div className='flex md:flex-row sm:flex-row  flex-col gap-2  w-full  justify-center h-full max-h-96 mb-5'>

                            <AgentNamePie />
                            <AgentOSPie />
                        </div>
                        <div className="w-full h-full flex items-center justify-center"> {/* Set fixed height */}
                            <BarChartComponent />
                        </div>

                        <div className="flex md:flex-row sm:flex-row  flex-col gap-2  w-full  justify-center min-h-48">
                            <Table />
                        </div>
                        {/* <div className="flex md:flex-row sm:flex-row  flex-col gap-2  w-full justify-center min-h-48">
                            <BarChartComponent />
                        
                        </div> */}
                    </div>

                    <div className="flex  w-full xl:w-3/5  min-h-96 h-1/2 flex-col">
                        <AlertComponent />
                        <EventTrendGraph />

                        <div className='flex md:flex-row sm:flex-row  flex-col   w-full  justify-center min-h-96 gap-2 '>
                            <AgentSummaryPie />
                            <AgentAuthenticationPie />
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}