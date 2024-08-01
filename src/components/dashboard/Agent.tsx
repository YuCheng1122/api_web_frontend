import Image from "next/image"
import { AgentDataType } from "@/components/dashboard/AgentContainer"

const Agent = ({agent}: {agent: AgentDataType}) => {
  return (
    <>
      <div className="flex flex-col items-center justify-around bg-white rounded-lg shadow-lg">
        <div className="font-bold">{agent.agent_name}</div>
        <Image 
            src={'/monitors.png'}
            alt="monitor"
            width={50}
            height={50}
          />
          <div className="text-sm text-gray-500">No results found</div>
      </div>
    </>
  )
}

export default Agent;
