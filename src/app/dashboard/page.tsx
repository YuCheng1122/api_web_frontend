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
    <div className="h-full   w-screen ">

      {/* datetime filter */}
      <div className="p-2 rounded-lg w-full">
        <DateTimeFilter />
      </div>

      {/* agent status */}
      <div className="p-2 bg-gray-100 rounded-lg overflow-x-scroll w-full pl-5 ">
        <AgentContainer />
      </div>


      {/* network connection and event trend */}
      <div className="w-full bg-gray-100 rounded-lg flex flex-wrap justify-center h-2/5 mb-10 sm:mb-5 ">

        {/* network connection */}
        <div className="md:w-1/2 sm:w-full mb-5 min-w-96     ">
          <NetworkConnection />
        </div>

        {/* event trend */}
        <div className="bg-white rounded-lg mb-5 shadow-lg md:w-1/2  sm:w-full min-w-96   items-center   ">
          <EventTrendGraph />
        </div>

      </div>


      {/* event */}
      <div className=" bg-gray-100 rounded-lg flex justify-center w-full  ">
        <EventTable />
      </div>


      {/* pie chart */}
      <div className="p-2 bg-gray-100 rounded-lg  w-screen">
        <PieGraphContainer />
      </div>

    </div>
  )
}

export default DashboardPage;
