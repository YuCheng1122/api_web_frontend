import axios from "axios";


export interface nodeType {
  id: string;
  attributes: {
    tags: string[];
  }
}

export interface edgeType {
  source: string;
  target: string;
  attributes: {
    timestamp: string;
    source_ip: string;
    dest_ip: string;
    source_port: number;
    dest_port: number;
    count: number;
    flow: {
      bytes_toclient: number;
      bytes_toserver: number;
    }
  }
}


export interface GraphDataProps {
  nodes: any[];
  edges: any[];
}

export interface FetchGraphDataRequestProps {
  startDate: Date;
  endDate: Date;
  token: string;
}

export interface FetchGraphDataResponseProps {
  success: boolean;
  content: any;
}


export const initData = {
  success: true,
  content: {
    start_time: "2024-07-19T05:00:00",
    end_time: "2024-07-19T06:00:00",
    nodes: [
      {
          id: "192.168.65.135",
          "attributes": {
            "tags": ["gateway", "critical"]
          }
      },
      {
          "id": "192.168.65.2",
          "attributes": {
            "tags": ["internal", "suspicious"]
          }
      },
    
    ],
    edges: [
        {
            "source": "192.168.65.135",
            "target": "192.168.65.2",
            "attributes": {
                "timestamp": "2024-07-19T05:30:23.616000",
                "source_ip": "192.168.65.135",
                "dest_ip": "192.168.65.2",
                "source_port": 60561.0,
                "dest_port": 53.0,
                "count": 1032,
                "flow.bytes_toclient": 0,
                "flow.bytes_toserver": 87
            }
        },
        {
            "source": "192.168.65.135",
            "target": "224.0.0.251",
            "attributes": {
                "timestamp": "2024-07-19T05:30:42.724000",
                "source_ip": "192.168.65.135",
                "dest_ip": "224.0.0.251",
                "source_port": 5353.0,
                "dest_port": 5353.0,
                "count": 12,
                "flow.bytes_toclient": 0,
                "flow.bytes_toserver": 87
            }
        },
      
    ]
  } 
}



// ------------------------------------------------------------------------------------->



const isInternalIP = (ip: string) => {
  const internalRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./
  ];

  return internalRanges.some(regex => regex.test(ip));
}


const cleanData = (data: GraphDataProps) => {
  const cleanedData = { nodes: [], edges: [] };
  // Ensure data.nodes and data.edges are arrays
  if (!Array.isArray(data.nodes)) {
    console.error('data.nodes is not an array:', data.nodes);
    return cleanedData;
  }
  if (!Array.isArray(data.edges)) {
    console.error('data.edges is not an array:', data.edges);
    return cleanedData;
  }

  data.nodes.forEach(node => {
    console.log('Processing Node:', node); // Log each node
    cleanedData.nodes.push({
      id: node.id,
      name: node.id,
      symbol: 'circle',
      symbolSize: 30,
      itemStyle: {
        color: isInternalIP(node.id) ? 'blue' : 'red'
      },
      label: {
        show: true,
        position: 'right',
        distance: 20,
        formatter: params => params.data.name,
        fontSize: 14
      }
    });
    
  });

  data.edges.forEach(edge => {
    console.log('Processing Edge:', edge); // Log each edge  
    cleanedData.edges.push({
      source: edge.source,
      target: edge.target,
      lineStyle: {
        width: edge.attributes.event_type === 'flow' ? 5 : 2,
        curveness: 0.3,
        color: edge.attributes.event_type === 'flow' ? 'blue' : 'red'
      },
      emphasis: {
        focus: 'adjacency',
        lineStyle: {
          width: 10
        }
      },
      edgeEffect: {
        show: true,
        period: 6,
        trailLength: 0.7,
        color: edge.attributes.event_type === 'flow' ? 'blue' : 'red',
        symbol: 'arrow',
        symbolSize: 5
      }
    });
  });

  return cleanedData;
}


export const fetchGraphData = async (params: FetchGraphDataRequestProps): Promise<FetchGraphDataResponseProps> => {

  return new Promise((resolve) => {
    setTimeout(() => {

      const data = {
        nodes: [
          {
              id: "192.168.65.135",
              "attributes": {
                "tags": ["gateway", "critical"]
              }
          },
          {
              "id": "192.168.65.2",
              "attributes": {
                "tags": ["internal", "suspicious"]
              }
          },
        
        ],
        edges: [
            {
                "source": "192.168.65.135",
                "target": "192.168.65.2",
                "attributes": {
                    "timestamp": "2024-07-19T05:30:23.616000",
                    "source_ip": "192.168.65.135",
                    "dest_ip": "192.168.65.2",
                    "source_port": 60561.0,
                    "dest_port": 53.0,
                    "count": 1032,
                    "flow.bytes_toclient": 0,
                    "flow.bytes_toserver": 87,
                    "event_type": "flow"
                }
            },
            {
                "source": "192.168.65.135",
                "target": "224.0.0.251",
                "attributes": {
                    "timestamp": "2024-07-19T05:30:42.724000",
                    "source_ip": "192.168.65.135",
                    "dest_ip": "224.0.0.251",
                    "source_port": 5353.0,
                    "dest_port": 5353.0,
                    "count": 12,
                    "flow.bytes_toclient": 0,
                    "flow.bytes_toserver": 87,
                    "event_type": "alert"
                }
            },
          
        ]
      }

      const cleanedData = cleanData(data)


      const result = {
        start_time: "2024-07-19T05:00:00",
        end_time: "2024-07-19T06:00:00",
        ...cleanedData
      }

      console.log(result)

      const response = {
        success: true,
        content: result
      }

      resolve(response)

    }, 2500)
  })
}


// export const fetchGraphData = async (params: FetchGraphDataRequestProps): Promise<FetchGraphDataResponseProps> => {

//   const { startTime, endTime, token } = params;  
//   const url = `${process.env.REACT_APP_API_URL}/api/view/graph_data?start_time=${encodeURIComponent(startTime.toISOString())}&end_time=${encodeURIComponent(endTime.toISOString())}`;
//   const headers = {
//     Authorization: token
//   }
//   const response = await axios.get(url, { headers });
//   return response.data;
// }
