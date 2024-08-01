interface TableData {
  time: string
  agent_name: string
  rule_description: string
  rule_mitre_tactic: string
  rule_mitre_id: string
  rule_level: number
}


const EventTable = () => {
  // TODO: fetch data from backend
  const data: TableData[] = [
    {
      time: 'Jul 30, 2024 @ 03:36:11.534',
      agent_name: 'win10_wazuh_test0718',
      rule_description: 'VirusTotal: Alert - c:\\users\\vm_user\\downloads\\annabelle.exe - 62 engines detected this file',
      rule_mitre_tactic: 'Execution',
      rule_mitre_id: 'T1203',
      rule_level: 12
    },
    {
      time: 'Jul 30, 2024 @ 03:36:11.534',
      agent_name: 'win10_wazuh_test0718',
      rule_description: 'VirusTotal: Alert - c:\\users\\vm_user\\downloads\\annabelle.exe - 62 engines detected this file',
      rule_mitre_tactic: 'Execution',
      rule_mitre_id: 'T1203',
      rule_level: 12
    },
    {
      time: 'Jul 30, 2024 @ 03:36:11.534',
      agent_name: 'win10_wazuh_test0718',
      rule_description: 'VirusTotal: Alert - c:\\users\\vm_user\\downloads\\annabelle.exe - 62 engines detected this file',
      rule_mitre_tactic: 'Execution',
      rule_mitre_id: 'T1203',
      rule_level: 12
    },
    {
      time: 'Jul 30, 2024 @ 03:36:11.534',
      agent_name: 'win10_wazuh_test0718',
      rule_description: 'VirusTotal: Alert - c:\\users\\vm_user\\downloads\\annabelle.exe - 62 engines detected this file',
      rule_mitre_tactic: 'Execution',
      rule_mitre_id: 'T1203',
      rule_level: 12
    },
    {
      time: 'Jul 30, 2024 @ 03:36:11.534',
      agent_name: 'win10_wazuh_test0718',
      rule_description: 'VirusTotal: Alert - c:\\users\\vm_user\\downloads\\annabelle.exe - 62 engines detected this file',
      rule_mitre_tactic: 'Execution',
      rule_mitre_id: 'T1203',
      rule_level: 12
    },
    {
      time: 'Jul 30, 2024 @ 03:36:11.534',
      agent_name: 'win10_wazuh_test0718',
      rule_description: 'VirusTotal: Alert - c:\\users\\vm_user\\downloads\\annabelle.exe - 62 engines detected this file',
      rule_mitre_tactic: 'Execution',
      rule_mitre_id: 'T1203',
      rule_level: 12
    },
    {
      time: 'Jul 30, 2024 @ 03:36:11.534',
      agent_name: 'win10_wazuh_test0718',
      rule_description: 'VirusTotal: Alert - c:\\users\\vm_user\\downloads\\annabelle.exe - 62 engines detected this file',
      rule_mitre_tactic: 'Execution',
      rule_mitre_id: 'T1203',
      rule_level: 12
    },
    {
      time: 'Jul 30, 2024 @ 03:36:11.534',
      agent_name: 'win10_wazuh_test0718',
      rule_description: 'VirusTotal: Alert - c:\\users\\vm_user\\downloads\\annabelle.exe - 62 engines detected this file',
      rule_mitre_tactic: 'Execution',
      rule_mitre_id: 'T1203',
      rule_level: 12
    },
    

  ]

  return (
    <>
        <div className="h-full text-sm font-bold">
          wazuh_event_up_to_12
        </div>

        <div className="flex-grow p-2 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-700 font-bold border-b border-gray-300">
                <th className="w-[15%] p-2">Time</th>
                <th className="w-[15%] p-2">Agent Name</th>
                <th className="w-[40%] p-2">Rule Description</th>
                <th className="w-[10%] p-2">Rule Mitre Tactic</th>
                <th className="w-[10%] p-2">Rule Mitre ID</th>
                <th className="w-[10%] p-2">Rule Level</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="text-gray-600 border-b border-gray-300">
                  <td className="p-2 text-sm">{item.time}</td>
                  <td className="p-2 text-sm">{item.agent_name}</td>
                  <td className="p-2 text-sm">{item.rule_description}</td>
                  <td className="p-2 text-sm">{item.rule_mitre_tactic}</td>
                  <td className="p-2 text-sm">{item.rule_mitre_id}</td>
                  <td className="p-2 text-sm">{item.rule_level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </>
  )
}

export default EventTable;
