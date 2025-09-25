const crypto = require('crypto');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { timestamp, token, resourcetype, actionid, secret } = JSON.parse(event.body);

    if (!timestamp || !token || !resourcetype || !actionid || !secret) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing parameters' }) };
    }

    const hmacString = timestamp + token + resourcetype + actionid;
    const hmac = crypto.createHmac('sha256', secret).update(hmacString).digest('base64');

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ hmac: hmac })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  }
};
