import posthog from 'posthog-js';

export function initPosthog(): void {
  const apiKey = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  const apiHost = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) || 'https://eu.i.posthog.com';

  const shouldEnable =
    import.meta.env.MODE === 'production' ||
    import.meta.env.VITE_POSTHOG_ENABLE_IN_DEV === 'true';

  if (!shouldEnable || !apiKey) {
    return;
  }

  posthog.init(apiKey, {
    api_host: apiHost,
    autocapture: true,
    capture_pageview: true,
    persistence: 'localStorage+cookie',
    loaded: () => {
      posthog.capture('$pageview');
    },
  });
}


