export interface EventTableDataType {
  id: number
  time: string
  agent_name: string
  rule_description: string
  rule_mitre_tactic: string
  rule_mitre_id: string
  rule_level: number
}

export interface fetchEventTableDataRequest {
  id: number
  start: Date
  end: Date
}

export interface fetchEventTableDataResponse {
  success: boolean
  content: {
    total: number
    datas: EventTableDataType[]
  }
}

export const initData : {total: number, datas: EventTableDataType[]} = {
  total: 0,
  datas: []
}


export const fetchEventTableData = async (param: fetchEventTableDataRequest): Promise<fetchEventTableDataResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {

      const result = {
        total: 100,
        datas: [
          {
            id: 1,
            time: 'Jul 30, 2024 @ 03:36:11.534',
            agent_name: 'win10_wazuh_test0718',
            rule_description: 'VirusTotal: Alert - c:\\users\\vm_user\\downloads\\annabelle.exe - 62 engines detected this file',
            rule_mitre_tactic: 'Execution',
            rule_mitre_id: 'T1203',
            rule_level: 12
          },
          {
            id: 2,
            time: 'Jul 30, 2024 @ 03:36:11.534',
            agent_name: 'win10_wazuh_test0718',
            rule_description: 'VirusTotal: Alert - c:\\users\\vm_user\\downloads\\annabelle.exe - 62 engines detected this file',
            rule_mitre_tactic: 'Execution',
            rule_mitre_id: 'T1203',
            rule_level: 12
          },
          {
            id: 3,
            time: 'Jul 30, 2024 @ 03:36:11.534',
            agent_name: 'win10_wazuh_test0718',
            rule_description: 'VirusTotal: Alert - c:\\users\\vm_user\\downloads\\annabelle.exe - 62 engines detected this file',
            rule_mitre_tactic: 'Execution',
            rule_mitre_id: 'T1203',
            rule_level: 12
          },
          {
            id: 4,
            time: 'Jul 30, 2024 @ 03:36:11.534',
            agent_name: 'win10_wazuh_test0718',
            rule_description: 'VirusTotal: Alert - c:\\users\\vm_user\\downloads\\annabelle.exe - 62 engines detected this file',
            rule_mitre_tactic: 'Execution',
            rule_mitre_id: 'T1203',
            rule_level: 12
          },
          {
            id: 5,
            time: 'Jul 30, 2024 @ 03:36:11.534',
            agent_name: 'win10_wazuh_test0718',
            rule_description: 'VirusTotal: Alert - c:\\users\\vm_user\\downloads\\annabelle.exe - 62 engines detected this file',
            rule_mitre_tactic: 'Execution',
            rule_mitre_id: 'T1203',
            rule_level: 12
          },
          {
            id: 6,
            time: 'Jul 30, 2024 @ 03:36:11.534',
            agent_name: 'win10_wazuh_test0718',
            rule_description: 'VirusTotal: Alert - c:\\users\\vm_user\\downloads\\annabelle.exe - 62 engines detected this file',
            rule_mitre_tactic: 'Execution',
            rule_mitre_id: 'T1203',
            rule_level: 12
          },
          {
            id: 7,
            time: 'Jul 30, 2024 @ 03:36:11.534',
            agent_name: 'win10_wazuh_test0718',
            rule_description: 'VirusTotal: Alert - c:\\users\\vm_user\\downloads\\annabelle.exe - 62 engines detected this file',
            rule_mitre_tactic: 'Execution',
            rule_mitre_id: 'T1203',
            rule_level: 12
          },
        ]
      }

      const response = {
        success: true,
        content: result
      }

      resolve(response)

    }, 2500)
  })

}
