import {OrgUnit} from "./types.ts";

export const ORG_UNITS: OrgUnit[] = [
    {
        id: crypto.randomUUID(),
        title: 'org-unit-1',
        code: 'code-1',
        address: 'address-1',
    },
    {
        id: crypto.randomUUID(),
        title: 'org-unit-2',
        code: 'code-2',
        address: 'address-2',
    },
    {
        id: crypto.randomUUID(),
        title: 'org-unit-3',
        code: 'code-3',
        address: 'address-3',
    },
]