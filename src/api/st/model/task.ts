export interface Task {
  id: string;
  name: string;
  desc?: string;
  desc_args?: string;
  execute?: object;
  required_memory?: number;
  required_os?: string;
  note?: string;
}

export interface TaskExecuteInfo {
  node: string;
  msg?: string;
  elapsed: number;
  running: boolean;
}

export interface Statistics {
  task: string;
  run_count: number;
  last_time: Date;
  running: boolean;
  logs: Map<string, TaskExecuteInfo>;
}
