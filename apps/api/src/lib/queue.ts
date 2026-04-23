import { type ConnectionOptions, type Job, type JobsOptions, Queue, Worker, type WorkerOptions } from "bullmq";
import { type JobData, type JobName, jobRegistry, type Job as RegistryJob } from "../queues/registry";
import { log } from "./logger";
import { createRedisClient } from "./redis";

interface JobSystemOptions {
  queueConnection: ConnectionOptions;
  workerConnection: ConnectionOptions;
  defaultWorkerOptions?: Omit<WorkerOptions, "connection">;
}

export class JobSystem {
  private queues = new Map<string, Queue>();
  private workers = new Map<string, Worker>();
  private queueConnection: ConnectionOptions;
  private workerConnection: ConnectionOptions;
  private options: JobSystemOptions;

  constructor(options: JobSystemOptions) {
    this.queueConnection = options.queueConnection;
    this.workerConnection = options.workerConnection;
    this.options = options;
  }

  private getQueue(queueName: string) {
    if (!this.queues.has(queueName)) {
      const q = new Queue(queueName, { connection: this.queueConnection });
      q.on("error", err => log.error(err, `[Queue ${queueName}] error`));
      this.queues.set(queueName, q);
    }
    // biome-ignore lint/style/noNonNullAssertion: guaranteed by the block above
    return this.queues.get(queueName)!;
  }

  createProducer<K extends JobName>(jobKey: K) {
    const queue = this.getQueue(jobKey);
    return {
      add: async (data: JobData<K>, opts?: JobsOptions) => {
        const validated = (jobRegistry.parse({ name: jobKey, data }) as Extract<RegistryJob, { name: K }>).data;
        return queue.add(jobKey, validated, opts);
      },
    };
  }

  createWorker<K extends JobName>(jobKey: K, handler: (data: JobData<K>, job?: Job) => Promise<void>) {
    if (this.workers.has(jobKey)) {
      throw new Error(`Worker for "${jobKey}" already registered`);
    }

    const worker = new Worker(
      jobKey,
      async (job: Job) => {
        const data = (jobRegistry.parse({ name: jobKey, data: job.data }) as Extract<RegistryJob, { name: K }>).data;
        return handler(data, job);
      },
      { connection: this.workerConnection, ...this.options.defaultWorkerOptions }
    );

    worker.on("error", err => log.error(err, `[Worker ${jobKey}] error`));
    worker.on("failed", (job, err) => log.error(err, `[Job ${job?.name}] failed`));
    this.workers.set(jobKey, worker);
    return worker;
  }

  async close() {
    await Promise.all([
      ...Array.from(this.queues.values()).map(q => q.close()),
      ...Array.from(this.workers.values()).map(w => w.close()),
    ]);
  }
}

export const jobSystem = new JobSystem({ queueConnection: createRedisClient(), workerConnection: createRedisClient() });
