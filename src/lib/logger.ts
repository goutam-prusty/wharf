import * as Sentry from '@sentry/nextjs';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogContext = Record<string, unknown>;

/**
 * Thin structured-logging facade.
 *
 * In development it prints readable, namespaced console output. In
 * production, warnings and errors are additionally forwarded to Sentry as
 * breadcrumbs/exceptions so operational issues surface in one place instead
 * of being scattered across `console.log` calls that vanish on redeploy.
 */
function log(level: LogLevel, message: string, context?: LogContext): void {
  const payload = { level, message, ...context, timestamp: new Date().toISOString() };

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console[level === 'debug' ? 'log' : level](
      `[wharf:${level}]`,
      message,
      context ?? '',
    );
  }

  if (level === 'warn' || level === 'error') {
    Sentry.addBreadcrumb({
      category: 'app',
      level: level === 'warn' ? 'warning' : 'error',
      message,
      data: context,
    });
  }

  if (level === 'error' && process.env.NODE_ENV === 'production') {
    Sentry.captureMessage(message, { level: 'error', extra: context });
  }

  void payload;
}

export const logger = {
  debug: (message: string, context?: LogContext) => log('debug', message, context),
  info: (message: string, context?: LogContext) => log('info', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  error: (message: string, context?: LogContext) => log('error', message, context),
  exception: (error: unknown, context?: LogContext) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[wharf:exception]', error, context ?? '');
    }
    Sentry.captureException(error, { extra: context });
  },
};
