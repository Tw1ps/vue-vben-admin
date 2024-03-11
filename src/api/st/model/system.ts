export interface NodeInfo {
  cid: string;
  system_memory_total: number;
  system_memory_used: number;
  system_memory_used_max: number;
  system_memory_free: number;
  process_memory_used: number;
  process_memory_used_max: number;
  heartbeat: number;
  boot_time: number;
  boot_process: number;
  cpu_used: number;
  cpu_used_max: number;
  hostname: string;
  ip: Array<string>;
  os: string;
  os_version: string;
  user: string;
  screenshot: string;
}
