
export interface AgentDataType {
  id: number
  agent_name: string
  data: any
}

export interface fetchAgentDataRequest {
  start: Date
  end: Date
}

export interface fetchAgentDataResponse {
  success: boolean
  content: AgentDataType[]
}

export const initData: AgentDataType[] = [
  {
    id: 1,
    agent_name: "Active agents",
    data: null,
  },
  {
    id: 2,
    agent_name: "Total agents",
    data: null,
  },
  {
    id: 3,
    agent_name: "Active Windows agents",
    data: null,
  },
  {
    id: 4,
    agent_name: "Windows agents",
    data: null,
  },
  {
    id: 5,
    agent_name: "Active Linux agents",
    data: null,
  },
  {
    id: 6,
    agent_name: "Linux agents",
    data: null,
  },
  {
    id: 7,
    agent_name: "Active MacOS agents",
    data: null,
  },
  {
    id: 8,
    agent_name: "MacOs agents",
    data: null,
  },
]

export const fetchAgentData = async (param: fetchAgentDataRequest): Promise<fetchAgentDataResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result =  [
        {
          id: 1,
          agent_name: "Active agents",
          data: 20,
        },
        {
          id: 2,
          agent_name: "Total agents",
          data: 8,
        },
        {
          id: 3,
          agent_name: "Active Windows agents",
          data: 15,
        },
        {
          id: 4,
          agent_name: "Windows agents",
          data: 17,
        },
        {
          id: 5,
          agent_name: "Active Linux agents",
          data: 19,
        },
        {
          id: 6,
          agent_name: "Linux agents",
          data: 19,
        },
        {
          id: 7,
          agent_name: "Active MacOS agents",
          data: 0,
        },
        {
          id: 8,
          agent_name: "MacOs agents",
          data: 2,
        },
      ]

      const response = {
        success: true,
        content: result
      }

      resolve(response)
    }, 2500)
  })
}

