const http = require('http');
const https = require('https');
const Joi = require('@hapi/joi');

const xml2js = require('xml2js');
const { XMLRPCSchema } = require('../spec');

/** Class representing a XML-RPC Client. */
class XMLRPCClient {
  /**
   * Create a XML-RPC Client.
   * @param {Object} options - The Options Object passed to XML-RPC Client.
   */
  constructor(options) {
    this.options = options;
  }

  async request(payload) {
    try {
      const clientOptions = this._buildRequestOptions();
      console.log(clientOptions);
      const transport =
        clientOptions.transport_protocol == 'https' ? https : http;

      const XML = await this._serialize(payload);

      // Calculate XML buffered length for Content-Length request header.
      clientOptions.headers['Content-Length'] = Buffer.byteLength(XML, 'utf8');

      return new Promise((resolve, reject) => {
        const req = transport.request(clientOptions, res => {
          let body = [];
          res.on('data', chunk => {
            body.push(chunk);
          });
          res.on('end', () => {
            const response = this._deserialize(Buffer.concat(body).toString());
            resolve(JSON.stringify(response));
          });
        });

        req.on('error', err => {
          reject(err);
        });

        req.write(XML, 'utf8');

        req.end();
      });
    } catch (e) {
      console.error(e);
    }
  }

  async _serialize(data) {
    try {
      const validatedXMLRPC = await XMLRPCSchema.validateAsync(data);

      const xmlBuilder = new xml2js.Builder({ xmldec: 1.0 });
      return xmlBuilder.buildObject(validatedXMLRPC);
    } catch (e) {
      console.error(e);
    }
  }

  _deserialize(data) {
    let parsedData;
    // Deserialize raw XML (data) to JSON (parsedData)
    xml2js.parseString(data, (err, result) => {
      if (err) throw Error(err);
      else parsedData = result;
    });
    return parsedData;
  }

  _buildRequestOptions() {
    // Validate user set options
    const validOptions = this._validateRequiredClientOptions(this.options);
    if (validOptions.error) throw Error(validOptions.error);

    // Beging building options for Request method
    let options = validOptions.value;

    // Set Base Headers
    let headers = {
      'User-Agent': 'Tiny XML-RPC Client',
      'Content-Type': 'text/xml',
      Accept: 'text/xml',
      'Accept-Charset': 'UTF8',
      Connection: 'Keep-Alive'
    };

    // Convert User/Password to base64 for Basic Authentication
    if (options.basic_auth != null) {
      const auth = `${options.basic_auth.user}:${options.basic_auth.password}`;
      headers['Authorization'] = `Basic  ${new Buffer.from(auth).toString('base64')}`;
    }
    // Set Headers with or without Basic Auth.
    options.headers = headers;

    // Set http/s to default POST method
    options.method = 'POST';

    return options;
  }

  _validateRequiredClientOptions(client_options) {
    const ClientOptionSchema = Joi.object({
      hostname: Joi.string()
        .required()
        .messages({
          'any.required':
            "'hostname' is required for XML-RPC client options. Example: 'vpn.example.com'"
        }),
      port: Joi.number()
        .port()
        .required()
        .messages({
          'any.required':
            "'port' is required for XML-RPC client options. Example: 443"
        }),
      path: Joi.string()
        .required()
        .messages({
          'any.required':
            "'path' is required for XML-RPC client options. Example: /RPC2"
        }),
      transport_protocol: Joi.string()
        .valid(...['http', 'https'])
        .required()
        .messages({
          'any.any':
            "'transport_protocol' is required for XML-RPC client options. This is needed to distinguish insecure (http) or secure (https) connection. Example: https"
        }),
      basic_auth: Joi.object({
        user: Joi.string()
          .required()
          .messages({
            'any.required':
              "'user' is required for XML-RPC client options when using Basic Authentication."
          }),
        password: Joi.string()
          .required()
          .messages({
            'any.required':
              "'password' is required for XML-RPC client options when using Basic Authentication."
          })
      })
    }).unknown(true);

    return ClientOptionSchema.validate(client_options);
  }
}

module.exports.XMLRPCClient = XMLRPCClient;
