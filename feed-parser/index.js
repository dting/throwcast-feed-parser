const FeedParser = require('feedparser');
const request = require('request');
const logger = require('winston');
const _ = require('lodash');

const USER_AGENT = [
  'Mozilla/5.0',
  '(Macintosh; Intel Mac OS X 10_8_5)',
  'AppleWebKit/537.36',
  '(KHTML, like Gecko)',
  'Chrome/31.0.1650.63 Safari/537.36',
].join(' ');

const log = function log(err) {
  logger.error(err, err.stack);
};

const reshapePost = function reshapePost(post) {
  const podcast = {};
  const { title, author, pubdate, pubDate, link, guid, image, summary } = post;
  podcast.title = title;
  podcast.author = author;
  podcast.pubDate = pubDate || pubdate;
  podcast.link = link;
  podcast.image = image;
  podcast.guid = guid;
  podcast.summary = summary;
  podcast.media = post['rss:enclosure']['@'];
  return podcast;
};

const fetch = function fetch(feed) {
  const posts = [];

  // Define our streams
  const req = request(feed, { timeout: 10000, pool: false });
  req.setMaxListeners(50);
  // Some feeds do not respond without user-agent and accept headers.
  req.setHeader('user-agent', USER_AGENT);
  req.setHeader('accept', 'text/html,application/xhtml+xml');

  const feedparser = new FeedParser();

  // Define our handlers
  req.on('error', log);
  req.on('response', function handleResponse(res) {
    if (res.statusCode !== 200) return this.emit('error', new Error('Bad status code'));
    return res.pipe(feedparser);
  });

  feedparser.on('error', log);
  feedparser.on('end', () => {});
  feedparser.on('readable', function handleReadable() {
    console.log(this.meta);
    let post;
    while (post = this.read()) {
      logger.info(JSON.stringify(_.omit(post, [
        'comments',
        'source',
        'meta',
        'rss:@',
        'rss:guid',
        'rss:title',
        'rss:pubdate',
        'rss:link',
        'rss:description',
        'rss:category',
        'content:encoded',
        'media:content',
        'feedburner:origlink',
        'feedburner:origenclosurelink',
      ]), null, 2));
      posts.push(post);
    }
  });
};

const populateStation = function(stationUrl) {
  const req = request(stationUrl, { timeout: 10000, pool: false });
  req.setMaxListeners(50);
  // Some feeds do not respond without user-agent and accept headers.
  req.setHeader('user-agent', USER_AGENT);
  req.setHeader('accept', 'text/html,application/xhtml+xml');

  const feedparser = new FeedParser();

  // Define our handlers
  req.on('error', log);
  req.on('response', function handleResponse(res) {
    if (res.statusCode !== 200) return this.emit('error', new Error('Bad status code'));
    return res.pipe(feedparser);
  });

  feedparser.on('error', log);
  feedparser.on('end', () => {});
  feedparser.on('readable', function handleReadable() {
    const posts = [];
    console.log(this.meta);
    let post;
    while (post = this.read()) {
      console.log(this.meta);
      /*logger.info(JSON.stringify(_.omit(post, [
        'comments',
        'source',
        'meta',
        'rss:@',
        'rss:guid',
        'rss:title',
        'rss:pubdate',
        'rss:link',
        'rss:description',
        'rss:category',
        'content:encoded',
        'media:content',
        'feedburner:origlink',
        'feedburner:origenclosurelink',
      ]), null, 2));*/
      posts.push(post);
    }
    console.log(posts[0].meta);
  });
};

const feeds = [
  // 'http://feeds.themoth.org/themothpodcast',
  // 'http://feeds.serialpodcast.org/serialpodcast',
  // 'http://www.npr.org/templates/rss/podlayer.php?id=1014',
  // 'http://www.bloomberg.com/feeds/podcasts/masters_in_business.xml',
  //
  // 'http://podcasts.cstv.com/feeds/fantasyfootball.xml',
  'http://podcasts.cstv.com/feeds/nba.xml',
];

feeds.forEach(populateStation);
