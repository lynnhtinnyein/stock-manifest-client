export function extractErrorMessage(err: unknown): string {
    const toStr = (val: unknown): string => {
        if (typeof val === "string") return val;
        if (val instanceof Error) return val.message;
        try {
            return JSON.stringify(val);
        } catch {
            return String(val);
        }
    };

    const isObject = (value: unknown): value is Record<string, unknown> => {
        return typeof value === "object" && value !== null;
    };

    const hasProperty = <K extends string>(obj: unknown, key: K): obj is Record<K, unknown> => {
        return isObject(obj) && key in obj;
    };

    if (
        hasProperty(err, "response") &&
        hasProperty(err.response, "data") &&
        hasProperty(err.response.data, "errors") &&
        isObject(err.response.data.errors)
    ) {
        const values = Object.values(err.response.data.errors).flat();
        if (values.length > 0) {
            return toStr(values[0]);
        }
    }

    let message: unknown = null;

    if (hasProperty(err, "response") && hasProperty(err.response, "data")) {
        const data = err.response.data;
        if (hasProperty(data, "message")) {
            message = data.message;
        } else {
            message = data;
        }
    } else if (hasProperty(err, "message")) {
        message = err.message;
    }

    if (message === "Error") {
        return "Could not connect to server.";
    }

    if (message) {
        if (Array.isArray(message)) {
            return message.length > 0
                ? toStr(message[0])
                : "An unexpected error occurred on the server.";
        }
        return toStr(message);
    }

    return "An unexpected error occurred on the server.";
}
