import { bootstrapWorker, Logger } from '@vendure/core';
import { EmailProcessor } from '@vendure/email-plugin/lib/src/email-processor';
import { config } from './vendure-config';

const loggerCtx = 'EmailProcessorDiagnostics';
const processorBuild = 'EMAIL_PROCESSOR_PROBE_20260622_1';

const originalProcess = EmailProcessor.prototype.process;

EmailProcessor.prototype.process = async function (data: any): Promise<any> {
    const sender = (this as any).emailSender;

    const identity = {
        processorBuild,
        pid: process.pid,
        senderClass: sender?.constructor?.name ?? 'unknown',
        service: process.env.RAILWAY_SERVICE_NAME ?? 'unknown',
        environment:
            process.env.RAILWAY_ENVIRONMENT_NAME ?? 'unknown',
        deployment:
            process.env.RAILWAY_DEPLOYMENT_ID ?? 'unknown',
        replica:
            process.env.RAILWAY_REPLICA_ID ?? 'unknown',
        commit:
            process.env.RAILWAY_GIT_COMMIT_SHA ?? 'unknown',
    };

    console.error(
        `[EMAIL_PROCESSOR_STARTED] ${JSON.stringify({
            ...identity,
            recipient: data?.recipient,
            subject: data?.subject,
            metadata: data?.metadata,
            timestamp: new Date().toISOString(),
        })}`,
    );

    try {
        const originalResult = await originalProcess.call(this, data);

        console.error(
            `[EMAIL_PROCESSOR_COMPLETED] ${JSON.stringify({
                ...identity,
                recipient: data?.recipient,
                metadata: data?.metadata,
                originalResult,
                timestamp: new Date().toISOString(),
            })}`,
        );

        return {
            originalResult,
            ...identity,
            recipient: data?.recipient,
            orderCode: data?.metadata?.orderCode,
            completedAt: new Date().toISOString(),
        };
    } catch (error) {
        const err =
            error instanceof Error
                ? error
                : new Error(String(error));

        console.error(
            `[EMAIL_PROCESSOR_FAILED] ${JSON.stringify({
                ...identity,
                recipient: data?.recipient,
                metadata: data?.metadata,
                error: err.message,
                stack: err.stack,
                timestamp: new Date().toISOString(),
            })}`,
        );

        throw err;
    }
};

console.error(
    `[WORKER_ENTRY_LOADED] ${JSON.stringify({
        processorBuild,
        pid: process.pid,
        service: process.env.RAILWAY_SERVICE_NAME,
        deployment: process.env.RAILWAY_DEPLOYMENT_ID,
        replica: process.env.RAILWAY_REPLICA_ID,
        commit: process.env.RAILWAY_GIT_COMMIT_SHA,
    })}`,
);

bootstrapWorker(config)
    .then(worker => worker.startJobQueue())
    .catch(error => {
        const err =
            error instanceof Error
                ? error
                : new Error(String(error));

        Logger.error(
            err.message,
            loggerCtx,
            err.stack,
        );

        process.exit(1);
    });