import { Badge, Button, defineDashboardExtension } from '@vendure/dashboard';
import { FileText, PackageCheck } from 'lucide-react';

type ColeteCustomFields = {
    coletePackageWeightKg?: number | null;
    coletePackageLengthCm?: number | null;
    coletePackageWidthCm?: number | null;
    coletePackageHeightCm?: number | null;
    coletePackageCount?: number | null;
    coletePackageContent?: string | null;
    coleteAwb?: string | null;
    coleteUniqueId?: string | null;
    coleteCourierName?: string | null;
    coleteServiceName?: string | null;
    coleteEstimatedPickupDate?: string | null;
    coleteAwbStatus?: string | null;
    coleteAwbError?: string | null;
};

function valueOrDash(value: unknown) {
    if (value === undefined || value === null || value === '') {
        return '-';
    }
    return String(value);
}

function ColeteAwbPanel({ context }: { context: any }) {
    const customFields: ColeteCustomFields =
        context.form?.watch?.('customFields') ?? context.entity?.customFields ?? {};

    const missingPackageFields = [
        ['Greutate', customFields.coletePackageWeightKg],
        ['Lungime', customFields.coletePackageLengthCm],
        ['Latime', customFields.coletePackageWidthCm],
        ['Inaltime', customFields.coletePackageHeightCm],
        ['Continut', customFields.coletePackageContent],
    ]
        .filter(([, value]) => value === undefined || value === null || value === '')
        .map(([label]) => label);

    const hasAwb = Boolean(customFields.coleteAwb);
    const packageCount = customFields.coletePackageCount ?? 1;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <PackageCheck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Pregatire colet</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Completeaza si salveaza campurile din tabul Colete Online, apoi generarea AWB va folosi aceste
                        valori.
                    </p>
                </div>
                <Badge variant={hasAwb ? 'default' : missingPackageFields.length ? 'secondary' : 'outline'}>
                    {hasAwb ? 'AWB generat' : missingPackageFields.length ? 'Date incomplete' : 'Pregatit'}
                </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <div className="text-xs text-muted-foreground">Greutate</div>
                    <div>{valueOrDash(customFields.coletePackageWeightKg)} kg</div>
                </div>
                <div>
                    <div className="text-xs text-muted-foreground">Colete</div>
                    <div>{valueOrDash(packageCount)}</div>
                </div>
                <div>
                    <div className="text-xs text-muted-foreground">Dimensiuni</div>
                    <div>
                        {valueOrDash(customFields.coletePackageLengthCm)} x{' '}
                        {valueOrDash(customFields.coletePackageWidthCm)} x{' '}
                        {valueOrDash(customFields.coletePackageHeightCm)} cm
                    </div>
                </div>
                <div>
                    <div className="text-xs text-muted-foreground">Continut</div>
                    <div>{valueOrDash(customFields.coletePackageContent)}</div>
                </div>
            </div>

            {missingPackageFields.length > 0 && (
                <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
                    Lipsesc: {missingPackageFields.join(', ')}.
                </div>
            )}

            <div className="rounded-md border p-3 text-sm">
                <div className="mb-2 flex items-center gap-2 font-medium">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Date AWB viitoare
                </div>
                <div className="grid gap-2 text-xs text-muted-foreground">
                    <div>AWB: {valueOrDash(customFields.coleteAwb)}</div>
                    <div>Colete unique ID: {valueOrDash(customFields.coleteUniqueId)}</div>
                    <div>Curier: {valueOrDash(customFields.coleteCourierName)}</div>
                    <div>Serviciu: {valueOrDash(customFields.coleteServiceName)}</div>
                    <div>Ridicare estimata: {valueOrDash(customFields.coleteEstimatedPickupDate)}</div>
                    <div>Status: {valueOrDash(customFields.coleteAwbStatus)}</div>
                </div>
            </div>

            <Button disabled className="w-full">
                Genereaza AWB
            </Button>
            <p className="text-[11px] text-muted-foreground">
                Buton placeholder: conectarea la Colete Online va fi adaugata in pasul urmator.
            </p>
        </div>
    );
}

defineDashboardExtension({
    pageBlocks: [
        {
            id: 'colete-awb-panel',
            title: 'Colete Online',
            location: {
                pageId: 'order-detail',
                column: 'side',
                position: {
                    blockId: 'fulfillment-details',
                    order: 'after',
                },
            },
            component: ColeteAwbPanel,
            requiresPermission: 'UpdateOrder',
        },
    ],
});
