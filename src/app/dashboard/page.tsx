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
    <div className="h-full  p-2 gap-2 w-screen ">

      {/* datetime filter */}
      <div className="p-2 rounded-lg w-full">
        <DateTimeFilter />
      </div>

      {/* agent status */}
      <div className="p-2 bg-gray-100 rounded-lg overflow-x-scroll w-full">
        <AgentContainer />
      </div>


      {/* network connection and event trend */}
      <div className="p-2 bg-gray-100 rounded-lg flex flex-wrap justify-center space-x-2 h-3/5  ">

        {/* network connection */}
        <div className="bg-white rounded-lg shadow-lg  min-w-80  w-5/12  mb-2 ">
          <NetworkConnection />
        </div>

        {/* event trend */}
        <div className="bg-white rounded-lg shadow-lg min-w-80 w-5/12  items-center ">
          <EventTrendGraph />
        </div>

      </div>


      {/* event */}
      <div className=" bg-gray-100 rounded-lg flex justify-center  ">
        <EventTable />
      </div>


      {/* pie chart */}
      <div className="p-2 bg-gray-100 rounded-lg ">
        <PieGraphContainer />
      </div>

    </div>
  )
}

export default DashboardPage;
