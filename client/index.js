const http = require('http');
const https = require('https');

const xml2js = require('xml2js');
const { XMLRPCSchema } = require('../spec');

class XMLRPCClient {
  constructor(opts) {
    this.opts = opts;
  }

  async request(payload) {
    try {
      const XML = await this._serialize(payload);
    } catch (e) {
      console.error(e);
    }
  }

  async _serialize(payload) {
    try {
      const validatedXMLRPC = await XMLRPCSchema.validateAsync(payload);

      const xmlBuilder = new xml2js.Builder({ xmldec: 1.0 });
      return xmlBuilder.buildObject(validatedXMLRPC);
    } catch (e) {
      console.error(e);
    }
  }

  _deserialize() {}
}

module.exports.XMLRPCClient = XMLRPCClient;
