const API_URL = 'https://6909e3d91a446bb9cc20771b.mockapi.io/products';

// Basic proxy handler supporting GET, POST, PUT, DELETE. For GET by id use ?id=123
exports.handler = async function (event, context) {
  // CORS headers
  const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  };

  const method = event.httpMethod || 'GET';

  // Handle preflight
  if (method === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: ''
    };
  }

  try {
    const id = event.queryStringParameters && event.queryStringParameters.id;
    const targetUrl = id ? `${API_URL}/${id}` : API_URL;

    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    // For write methods forward body
    if (method === 'POST' || method === 'PUT') {
      options.body = event.body;
    }

    const res = await fetch(targetUrl, options);
    const text = await res.text();

    return {
      statusCode: res.status,
      headers: Object.assign({ 'Content-Type': 'application/json' }, CORS_HEADERS),
      body: text
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Proxy error', details: err.message })
    };
  }
};
