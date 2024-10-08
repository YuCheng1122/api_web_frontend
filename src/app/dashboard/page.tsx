'use client'

// components
import DateTimeFilter from "@/components/dashboard/DateTimeFilter"
import AgentContainer from "@/components/dashboard/AgentContainer"
import NetworkConnection from "@/components/dashboard/NetworkConeection"
import EventTrendGraph from "@/components/dashboard/EventTrendGraph"
import EventTable from "@/components/dashboard/EventTable"
import PieGraphContainer from "@/components/dashboard/PieGraphContainer"

const DashboardPage = () => {

  return (
    <div className="h-full grid grid-rows-[auto,1fr,3fr,3fr,6fr] p-2 gap-2">
      
      {/* datetime filter */}
      <div className="p-2 rounded-lg">
        <DateTimeFilter />
      </div>
      
      {/* agent status */}
      <div className="p-2 bg-gray-100 rounded-lg ">
        <AgentContainer />   
      </div>
      

      {/* network connection and event trend */} 
      <div className="p-2 bg-gray-100 rounded-lg grid grid-cols-10 gap-4">
        
        {/* network connection */}
        <div className="bg-white rounded-lg shadow-lg col-span-4 p-2 flex flex-col h-full w-full relative">
          <NetworkConnection />  
        </div>

        {/* event trend */}
        <div className="bg-white rounded-lg shadow-lg col-span-6 p-2">
          <EventTrendGraph />
        </div>
      
      </div>
      

      {/* event */}
      <div className="p-2 bg-gray-100 rounded-lg">
          <EventTable />
      </div>
      

      {/* pie chart */}
      <div className="p-2 bg-gray-100 rounded-lg grid grid-cols-2 grid-rows-2 gap-2">
        <PieGraphContainer />
      </div>
    
    </div>
  )
}

export default DashboardPage;
