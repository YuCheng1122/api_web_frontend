'use client'

import EventTable from './components/EventTable';
import MaliciousEvents from './components/MaliciousEvents';
import EventTrend from './components/EventTrend';
import TimeRangeFilter from './components/TimeRangeFilter';
import OSDistribution from './components/OSDistribution';
import AgentStatus from './components/AgentStatus';
import AuthStatus from './components/AuthStatus';
import CVEDistribution from './components/CVEDistribution';
import AgentDistribution from './components/AgentDistribution';
import SeverityAlert from './components/SeverityAlert';

export default function VisionBoardPage() {
    return (
        <>
            <div className='h-full p-3 bg-gray-100 rounded-lg'>
                <div className="h-full w-full flex flex-wrap">
                    <div className="flex flex-col gap-1 w-full h-1/2 mb-[120px] md:mb-10 sm:mb-10 xl:mb-10">
                        <TimeRangeFilter />
                    </div>
                    <div className='flex flex-col gap-2 xl:w-2/5 h-full w-full px-5 mb-5'>
                        <div className='flex md:flex-row sm:flex-row flex-col gap-2 w-full justify-center h-60 mb-20 md:mb-0 sm:mb-0 xl:mb-0'>
                            <AuthStatus />
                            <AgentStatus />
                        </div>
                        <div className="w-full h-full flex flex-wrap items-center justify-center min-h-96 gap-10 md:gap-2">
                            <MaliciousEvents />
                            <CVEDistribution />
                        </div>
                    </div>
                    <div className="flex w-full xl:w-3/5 min-h-96 h-1/2 flex-col gap-4 mb-5 sm:mb-5 md:mb-5 xl:mb-0">
                        <SeverityAlert />
                        <EventTrend />
                        <div className='flex md:flex-row sm:flex-row flex-col w-full justify-center min-h-96 gap-2'>
                            <AgentDistribution />
                            <OSDistribution />
                        </div>
                    </div>
                    <div className="flex md:flex-row sm:flex-row flex-col gap-2 w-full justify-center min-h-48">
                        <EventTable />
                    </div>
                </div>
            </div>
        </>
    );
}
