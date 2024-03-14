import { Task } from './task';

export enum SchedStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  PAUSE = 'pause',
  FINISHED = 'finished',
}

interface ScheDefine {
  task: Task;
  type: string;
  id: string;
  name: string;
  tactics: string;
  single_limit: number;
  total_limit: number;
  cancel_threshold: number;
}

export interface SchedCache {
  sched: ScheDefine;
  job: string;
  status: SchedStatus;
}

export enum SchedType {
  DATE = 'date',
  CRON = 'cron',
  INTERVAL = 'interval',
  LOOP = 'loop',
  HURRY = 'hurry',
}

export enum SchedTactics {
  IDLE = 'idle',
  PERFORMANCE = 'performance',
  LOCAL = 'local',
}

export interface addSchedData {
  task_id: string;
  type: SchedType;
  name?: string;
  note?: string;
  tactics: SchedTactics;
  single_limit: number;
  total_limit: number;
  timeout?: number;
  cancel_threshold: number;
}

enum TZ {
  SH = 'Aisa/Shanghai',
  LA = 'America/Los_Angeles',
}

export interface Kwds {
  args?: Array<any>;
  kwargs?: object;
}

export interface DateKwds extends Kwds {
  run_date?: Date | number | string;
  timezone?: TZ | string;
}

export interface CronKwds extends Kwds {
  year?: number | string;
  month?: number | string;
  day?: number | string;
  week?: number | string;
  day_of_week?: number | string;
  hour?: number | string;
  minute?: number | string;
  second?: number | string;
  start_date?: Date | number | string;
  end_date?: Date | number | string;
  timezone?: TZ | string;
}

export interface IntervalKwds extends Kwds {
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  start_date?: Date | number | string;
  end_date?: Date | number | string;
  timezone?: TZ | string;
}
