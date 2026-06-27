import { bootstrapWorker } from '@vendure/core';
import { config } from './vendure-config';

bootstrapWorker(config)
    .then(worker => worker.startJobQueue())
    .catch(error => {
        console.error('Vendure worker failed to start:', error);
        process.exit(1);
    });