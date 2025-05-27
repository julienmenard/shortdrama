import { newTracker, enableActivityTracking } from '@snowplow/browser-tracker';

// Initialize Snowplow tracker
export const initializeSnowplow = () => {
  try {
    newTracker('sp1', 'https://com-digitalvirgo-prod1.mini.snplow.net', {
      appId: 'test_dv_ww_verticaldrama_transformers',
      platform: 'web'
    });

    // Enable activity tracking
    enableActivityTracking({
      minimumVisitLength: 10,
      heartbeatDelay: 10
    });

    // Set snowplowReady flag after initialization
    (window as any).snowplowReady = true;
  } catch (error) {
    console.error('Failed to initialize Snowplow:', error);
    (window as any).snowplowReady = false;
  }
};

const isSnowplowAvailable = () => {
  return typeof (window as any).snowplow === 'function' && (window as any).snowplowReady === true;
};

// Track login events
export const trackLogin = (type: 'login' | 'logout', method: string, status: 'ok' | 'ko') => {
  if (!isSnowplowAvailable()) return;
  
  try {
    window.snowplow('trackSelfDescribingEvent', {
      event: {
        schema: 'iglu:com.dgp/dv_login/jsonschema/1-0-2',
        data: {
          type_of_action: type,
          method,
          status
        }
      }
    });
  } catch (error) {
    console.error('Failed to track login event:', error);
  }
};

// Track content consumption
export const trackContentConsumption = () => {
  if (!isSnowplowAvailable()) return;

  try {
    window.snowplow('trackSelfDescribingEvent', {
      event: {
        schema: 'iglu:com.dgp/dv_content_consumption/jsonschema/1-0-0',
        data: {}
      }
    });
  } catch (error) {
    console.error('Failed to track content consumption:', error);
  }
};

// Track user interaction
export const trackUserInteraction = () => {
  if (!isSnowplowAvailable()) return;

  try {
    window.snowplow('trackSelfDescribingEvent', {
      event: {
        schema: 'iglu:com.dgp/dv_user_interaction/jsonschema/1-0-0',
        data: {}
      }
    });
  } catch (error) {
    console.error('Failed to track user interaction:', error);
  }
};