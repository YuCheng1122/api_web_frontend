export interface SyslogRow {
  event_id: string;
  device: string;
  timestamp: string;
  severity: string;
  message: string;
  details: {
    in_interface: string;
    out_interface: string;
    src_ip: string;
    dst_ip: string;
    protocol: string;
    src_port: number;
    dst_port: number;
  };
}
