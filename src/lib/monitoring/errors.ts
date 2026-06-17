type ErrorContext = Record<string, unknown>;

type ErrorReporter = {
  captureException: (error: unknown, context?: ErrorContext) => void;
  captureMessage: (message: string, level: "warning" | "error", context?: ErrorContext) => void;
};

const consoleReporter: ErrorReporter = {
  captureException: (error, context) => {
    console.error("[Error]", error, context ?? {});
  },
  captureMessage: (message, level, context) => {
    const logger = level === "warning" ? console.warn : console.error;
    logger(`[${level}]`, message, context ?? {});
  },
};

let reporter: ErrorReporter = consoleReporter;

export function setErrorReporter(nextReporter: ErrorReporter): void {
  reporter = nextReporter;
}

export function logError(error: unknown, context?: ErrorContext): void {
  reporter.captureException(error, context);
}

export function logWarning(message: string, context?: ErrorContext): void {
  reporter.captureMessage(message, "warning", context);
}
