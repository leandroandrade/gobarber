import Bee from 'bee-queue';
import CancellationMail from "../app/jobs/CancellationMail";
import redisConfig from '../config/redis';
import PrintValue from "../app/jobs/PrintValue";

const jobs = [CancellationMail, PrintValue];


class Queue {

    constructor() {
        this.queues = {};

        this.init();
    }

    init() {
        jobs.forEach(({ key, handle }) => {
            this.queues[key] = {
                bee: new Bee(key, {
                    redis: redisConfig,
                }),
                handle
            };
        });
    }

    add(queue, dados) {
        return this.queues[queue].bee.createJob(dados).save();
    }

    processQueue() {
        jobs.forEach(job => {
            const { bee, handle } = this.queues[job.key];

            bee.on('failed', this.handleFailure).process(handle);
        })
    }

    handleFailure(job, err) {
        console.log(`Queue ${ job.queue.name }: FAILED`, err);
    }

}

export default new Queue();