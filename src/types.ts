export type Transaction = {
    id: string,
    orgUnitId: string,
    userId: string,
    amount: number,
    title: string,
    description: string,
    createdAt: string,
    isLocked: boolean
}

export type CreateTransaction = {
    orgUnitId: string,
    userId: string,
    amount: number,
    title: string,
    description: string,
    createdAt: string,
    isLocked: boolean
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
    durationUnit: string,
    nextTransactionDate: string
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
    yearlyGoal: number
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

export type Invitation = {
    id: string,
    senderId: string,
    receiverId: string,
    organizationId: string,
    createdAt: string,
    isAccepted: boolean
}

export type Statistics = {
    from: string,
    to: string,
    xValues: string[],
    previousYearYValues: number[],
    currentYearYValues: number[],
    currentYearNumberOfTransactions: number,
    previousYearNumberOfTransactions: number,
    goalCompletionPercentage: number,
    currentYearTotalAmount: number,
    previousYearTotalAmount: number,
    top5MostFrequentTransactions: TransactionCountPair[],
    mostProfitableMonth: string,
    mostProfitableMonthAmount: number,
    mostUnprofitableMonth: string,
    mostUnprofitableMonthAmount: number,
    averageTrendPercentage: number,
    monthsByAmounts: MonthByAmount[],
    currentYearTransactions: Transaction[]
}

export type TransactionCountPair = {
    transaction: Transaction,
    count: number
}

export type MonthByAmount = {
    month: string,
    amount: number,
    sortIndex: number,
}