# worker-fetch-tweets

Fetch tweets and store them in a CouchDB.

## Getting Started
Install the module with: `npm install worker-fetch-tweets`

```javascript
var worker_fetch_tweets = require('worker-fetch-tweets');
worker_fetch_tweets.listen({
  url: 'http://localhost:5984/mydb',
  configId: 'my-timeline',
  defaults: {
    type: 'tweet',
    published: true
  }
});
```

## Configuration
Create a document `my-timeline`:

```javascript
{
  "_id": "my-timeline",
   "consumer_key": "asd",
   "consumer_secret": "asd",
   "access_token_key": "123-asd",
   "access_token_secret": "asd"
}
```

## Starting
You can use the builtin script:

```bash
COUCH_URL=http://localhost:5984/heimat TWITTER_FEED_CONFIG_ID=my-timeline npm start
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality.
Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) null2 GmbH, 2013 Johannes J. Schmidt  
Licensed under the MIT license.
