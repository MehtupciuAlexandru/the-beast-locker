import { Injector, RequestContext } from '@vendure/core';
import { FileBasedTemplateLoader, LoadTemplateInput } from '@vendure/email-plugin';

export class SynchronizedTemplateLoader extends FileBasedTemplateLoader {
    private lock: Promise<void> = Promise.resolve();

    async loadTemplate(injector: Injector, ctx: RequestContext, input: LoadTemplateInput): Promise<string> {
        await this.lock;

        let releaseLock: () => void;
        this.lock = new Promise(resolve => { releaseLock = resolve; });

        try {
            return await super.loadTemplate(injector, ctx, input);
        } finally {
            releaseLock!();
        }
    }
}