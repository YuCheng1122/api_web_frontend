import Image from "next/image"
import { AgentDataType } from "@/utils/dashboard/fetchAgentData";
import Link from "next/link"; // 新增這行

const Agent = ({ agent }: { agent: AgentDataType }) => {
  return (
    <>
      <div className="flex flex-col items-center justify-around bg-white rounded-lg shadow-lg min-w-32 sm:max-w-32 p-2">
        <div className="font-bold">{agent.agent_name}</div>
        <Link href="/agent">
          <Image
            src={'/monitors.png'}
            alt="monitor"
            width={50}
            height={50}
          />
        </Link>
        <div className={`text-sm ${agent.data ? 'text-black font-bold' : 'text-gray-500'}`}>{agent.data || 'No results found'}</div>
      </div>
    </>
  )
}

export default Agent;
