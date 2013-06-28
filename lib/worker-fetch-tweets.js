/*
 * worker-fetch-tweets
 * https://github.com/null2/worker-fetch-tweets
 *
 * Copyright (c) 2013 Johannes J. Schmidt
 * Licensed under the MIT license.
 */

'use strict';

var Stream = require('user-stream');
var nano = require('nano');

exports.listen = function(options) {
  options = options || {};
  options.idPrefix = options.idPrefix || 'tweet-';
  options.configId = options.configId || 'twitter';
  options.defaults = options.defaults || {};

  if (!options.url) {
    throw('I need an url!');
  }

  var db = nano(options.url);
  var feed = db.follow({
    filter: '_doc_ids',
    include_docs: true,
    query_params: {
      doc_ids: JSON.stringify([options.configId])
    }
  });

  var stream;
  feed.on('change', function (change) {
    var doc = change.doc;

    if (doc.consumer_key && doc.consumer_secret && doc.access_token_key && doc.access_token_secret) {
      if (stream) {
        stream.destroy();
      }

      stream = new Stream({
        consumer_key: doc.consumer_key,
        consumer_secret: doc.consumer_secret,
        access_token_key: doc.access_token_key,
        access_token_secret: doc.access_token_secret
      });
      stream.on('data', function(json) {
        // tweet
        if (json.id && json.created_at && json.text) {
          json._id = options.idPrefix + json.id;
          for (var key in options.defaults) {
            json[key] = options.defaults[key];
          }
          db.insert(json);
        }
        // deletion
        if (json.delete && json.delete.status && json.delete.status.id) {
          var id = options.idPrefix + json.delete.status.id;
          db.head(id, function(err, _, headers) {
            if (!err && headers && headers.etag) {
              db.destroy(id, JSON.parse(headers.etag));
            }
          });
        }
      });
      stream.stream();
    }
  });

  feed.follow();

  return feed;
};
