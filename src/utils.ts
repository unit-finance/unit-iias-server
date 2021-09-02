export function assertIsDefined<T>(val: T, name: string): asserts val is NonNullable<T> {
    if (val === undefined || val === null) {
        throw new Error(
            `Expected '${name}' to be defined, but received ${val}`
        )
    }
}

export function logInfo(message:string): void {
    console.log(`level=info service=unit.webhookserver msg=\"${message}\"`)
}

export function logError(message:string): void {
    console.log(`level=error service=unit.webhookserver msg=\"${message}\"`)
}