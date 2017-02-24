/**
 * botkit-storage-dynamodb - DynamoB driver for Botkit
 *
 * @param  {Object} config May contain a configured AWS aws-sdk object.
 * @return {Object} A storage object conforming to the Botkit storage interface
 */
module.exports = function(config) {
  config = config || {};
  config.namespace = config.namespace || 'botkit';
  config.AWS = config.AWS || require('aws-sdk');
  config.tableName = config.tableName || 'botkit';

  var storage = {};
  var client = new config.AWS.DynamoDB.DocumentClient();

  ['teams', 'channels', 'users'].forEach(function(method) {
    storage[method] = getStorageObj(client, config.tableName);
  })

  return storage;
};


/**
 * Function to generate a storage object for a given namespace
 *
 * @param {Object} client The DynamoDB client
 * @param {String} namespace The namespace to use for storing in DynamoDB
 * @returns {{get: get, save: save, all: all, allById: allById}}
 */
function getStorageObj(client, namespace) {
  return {
    get: function(id, cb) {
      var params = {
        TableName: namespace, 
        Key: { "id": id }
      }

      client.get(params, function(error, data) {
        console.log(error, data);
        cb(error, (data.Item) ? data.Item: undefined);
      })
    },
    save: function(object, cb) {
      if (!object.id) {
        return cb(new Error('The given object must have an id property namespace: ' + namespace + " object:" + JSON.stringify(object)), {});
      }

      var params = {
        TableName: namespace, 
        Item: object
      }

      client.put(params, function(error, data) {
        cb(error, data);
      })
    },
    remove: function(id, cb) {
      var params = {
        TableName: namespace, 
        Key: { "id": id }
      }

      client.delete(params, function(error, data) {
        cb(error, data);
      })
    },
    all: function(cb, options) {
      client.scan({
        TableName : namespace 
      }, function(error, data) {
        if (error) return cb(error, null); 
        cb(null, data.Items);
      })// scan
    }
  }// return

}// getStorageObj
