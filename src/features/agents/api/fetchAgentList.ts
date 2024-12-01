import { avocadoClient } from "@/features/api/AvocadoClient";
import { FetchAgentListParams } from "../types/agent";

export const fetchAgentList = async (): Promise<FetchAgentListParams> => {
  const nowtime = new Date();
  const endtime = new Date(nowtime);
  endtime.setDate(nowtime.getDate() - 120);
  console.log("fetchAgentList", endtime.toISOString(), nowtime.toISOString());

  try {
    const response = await avocadoClient.get("/api/dashboard/agent_name", {
      params: {
        start_time: endtime.toISOString(),
        end_time: nowtime.toISOString(),
      },
    });

    const apiData = response.content.agent_name; // response is already response.data from axios
    return {
      success: true,
      content: apiData,
    };
  } catch (error: any) {
    console.error("Error fetching Agentlist data:", error);
    return {
      success: false,
      content: { agent_name: [] },
    };
  }
};
