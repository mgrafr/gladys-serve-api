// -----------------------------------------------------------------------------
// Integration configuration.
//
// The configuration is filled in by the user in Gladys, from the `config_schema`
// declared in `gladys-assistant-integration.json`. The SDK fetches it for you
// (`gladys.getConfig()`) and notifies you of every change through
// `gladys.onConfigUpdated()`.
//
// This module only provides defaults and normalizes the received object, so the
// rest of the code never has to deal with `undefined`.
// -----------------------------------------------------------------------------
export const DEFAULT_CONFIG = {
  
  local_port: null,
  verbose_logs: false,
};

// Log level of the container, before the user config is applied. Gladys does not
// inject LOG_LEVEL, so this is normally undefined (the SDK then logs at `info`);
// it is set when the integration runs locally or in the test suite, and that
// choice must survive a config update.
const INITIAL_LOG_LEVEL = process.env.LOG_LEVEL;

/**
 * Merge the user config with the defaults.
 * @param {Record<string, unknown>} raw config returned by the SDK
 * @returns {object} the normalized config
 */
export function normalizeConfig(raw = {}) {
  return {
    ...DEFAULT_CONFIG,
    local_port: Number(raw.local_port) || null,
    // GLADYS_PREFER_LOCAL is the reserved (read-only) key behind the standard
    // "Prefer the local connection" toggle Gladys shows for a dual-channel
    // integration. Absent means "not answered yet": the local API is preferred
    // whenever it is configured, since it costs nothing and is not rate-limited.
        verbose_logs: raw.verbose_logs === true,
  };
}

