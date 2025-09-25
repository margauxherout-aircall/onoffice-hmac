const crypto = require('crypto');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { timestamp, token, resourcetype, actionid, secret } = JSON.parse(event.body);

    // Create the string exactly like PHP implode does
    const hmacString = timestamp + token + resourcetype + actionid;
    
    // Generate HMAC exactly like PHP: hash_hmac('sha256', string, secret, true)
    const hmac = crypto.createHmac('sha256', secret)
      .update(hmacString)
      .digest('base64');

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        hmac: hmac,
        hmacString: hmacString,
        timestamp: timestamp,
        token: token,
        resourcetype: resourcetype,
        actionid: actionid
      })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
