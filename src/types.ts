export type Transaction = {
    id: string,
    amount: number,
    title: string,
    description: string,
    createdAt: string
}

export type CreateTransaction = {
    amount: number,
    title: string,
    description: string,
}

export type AutomaticTransaction = {
    id: string,
    amount: number,
    title: string,
    description: string,
    latestTransactionDate: string,
    durationMinutes: number,
    durationUnit: string
}

export type CreateAutomaticTransaction = {
    amount: number,
    title: string,
    description: string,
    durationMinutes: number,
    durationUnit: string
}

export type OrgUnit = {
    id: string,
    title: string,
    code: string,
    address: string
}

export type Organization = {
    id: string,
    title: string,
    code: string,
    address: string,
}

export type OrgUnitCreate = {
    title: string,
    code: string,
    address: string,
}

export type UserProfile = {
    id: string,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
}

export type ExportOptions = {
    option1: boolean,
    option2: boolean,
    option3: boolean,
    exportFrom: string,
    exportTo: string,
}