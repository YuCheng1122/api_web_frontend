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
import CVEBarChartComponent from '@/components/visiondashboard/cve_barchart'
import AgentnameBarChartComponent from '@/components/visiondashboard/agentname_barchart'



export default function Visionboardpage() {


    return (
        <>
            <div className='h-full p-3 bg-gray-100 rounded-lg '>
                <div className="h-full w-full flex flex-wrap  ">
                    <div className="flex flex-col gap-1 w-full h-1/2 mb-[120px] md:mb-10 sm:mb-10 xl:mb-10">
                        <DateTimeFilter />
                    </div>
                    <div className='flex flex-col gap-2 xl:w-2/5  h-full w-full px-5 mb-5  '>
                        <div className='flex md:flex-row sm:flex-row  flex-col gap-2  w-full  justify-center h-60 mb-20 md:mb-0 sm:mb-0 xl:mb-0'>
                            <AgentAuthenticationPie />
                            <AgentSummaryPie />


                        </div>
                        <div className="w-full h-full flex flex-wrap items-center justify-center min-h-96 gap-10 md:gap-2"> {/* Set fixed height */}

                            <BarChartComponent />
                            <CVEBarChartComponent />
                        </div>


                    </div>
                    <div className="flex  w-full xl:w-3/5  min-h-96 h-1/2 flex-col gap-2 ">
                        <AlertComponent />
                        <EventTrendGraph />
                        <div className='flex md:flex-row sm:flex-row  flex-col  w-full  justify-center min-h-96 gap-2 '>
                            {/* <AgentNamePie /> */}
                            <AgentnameBarChartComponent />
                            <AgentOSPie />

                        </div>
                    </div>
                    <div className="flex md:flex-row sm:flex-row  flex-col gap-2  w-full  justify-center min-h-48">
                        <Table />
                    </div>

                </div>
            </div >
        </>
    )
}