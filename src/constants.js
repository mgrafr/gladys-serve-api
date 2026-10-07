// -----------------------------------------------------------------------------
// Server api constants + the few Gladys values the SDK does not
// export.
//
// The standard Gladys feature categories / types / units come straight from
// the SDK (DEVICE_FEATURE_CATEGORIES, DEVICE_FEATURE_TYPES,
// DEVICE_FEATURE_UNITS) — only integration-specific values live here.
// -----------------------------------------------------------------------------
//
// -----------------------------------------------------------------------------
// SERVER API LOCAL(the webserver's own API, port 3004 by default).
//
// Read:  GET http://<ip>:<port>/ -> { statut: "OK"} 
// Read: GET  http://<ip>:<port>/backup -> download datas.tar.gz (databases)
// Read: GET http://<ip>:<port>/script/:${interpreteur}/:${name_script}
// 
// -----------------------------------------------------------------------------
export const SERVERAPI_DEFAULT_PORT = 3004;
