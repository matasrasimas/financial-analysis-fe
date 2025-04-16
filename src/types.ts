export type Transaction = {
    id: string,
    orgUnitId: string,
    amount: number,
    title: string,
    description: string,
    createdAt: string
}

export type CreateTransaction = {
    orgUnitId: string,
    amount: number,
    title: string,
    description: string,
    createdAt: string
}

export type TransactionError = {
    amount: string,
    title: string,
    createdAt: string
}

export type AutomaticTransaction = {
    id: string,
    orgUnitId: string,
    amount: number,
    title: string,
    description: string,
    duration: number,
    durationUnit: string
}

export type CreateAutomaticTransaction = {
    orgUnitId: string,
    amount: number,
    title: string,
    description: string,
    duration: number,
    durationUnit: string
}

export type AutomaticTransactionError = {
    amount: string,
    title: string,
    duration: string
}

export type OrgUnit = {
    id: string,
    orgId: string,
    title: string,
    code: string,
    address: string
}

export type Organization = {
    id: string,
    userId: string,
    title: string,
    code: string,
    address: string,
}

export type OrganizationCreate = {
    title: string,
    code: string,
    address: string,
}

export type OrgUnitCreate = {
    orgId: string,
    title: string,
    code: string,
    address: string,
}

export type ExportOptions = {
    option1: boolean,
    option2: boolean,
    option3: boolean,
    exportFrom: string,
    exportTo: string,
}

export type User = {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
}

export type UserCreate = {
    firstName: string,
    lastName: string,
    phoneNumber: string,
    email: string,
    password: string,
    repeatPassword: string,
}

export type UserLogin = {
    email: string,
    password: string,
}

export type UserProfileError = {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
}

export type DatePeriod = {
    from: string,
    to: string,
}

export type TransactionFromFile = {
    orgUnitId: string,
    amount: number,
    title: string,
    description: string,
    createdAt: string,
    amountError: string,
    titleError: string,
    createdAtError: string
}