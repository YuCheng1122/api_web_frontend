'use client'
import Table from '@/features/vision_dashboard/components/table'
import BarChartComponent from '@/features/vision_dashboard/components/bar'
import EventTrendGraph from '@/features/vision_dashboard/components/EventTrendGraph'
import AlertComponent from '@/features/vision_dashboard/components/alert'
import DateTimeFilter from '@/features/vision_dashboard/components/DateTimeFilter'
import AgentNamePie from '@/features/vision_dashboard/components/agentname-pie'
import AgentOSPie from '@/features/vision_dashboard/components/agentos-pie'
import AgentSummaryPie from '@/features/vision_dashboard/components/agentsummary-pie'
import AgentAuthenticationPie from '@/features/vision_dashboard/components/authentication_pie'
import CVEBarChartComponent from '@/features/vision_dashboard/components/cve_barchart'
import AgentnameBarChartComponent from '@/features/vision_dashboard/components/agentname_barchart'



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
                    <div className="flex  w-full xl:w-3/5  min-h-96 h-1/2 flex-col gap-4 mb-5 sm:mb-5 md:mb-5 xl:mb-0 ">
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