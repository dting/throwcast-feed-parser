const request = require('request');
const parsePodcast = require('node-podcast-parser');
const logger = require('winston');
const _ = require('lodash');

const USER_AGENT = [
  'Mozilla/5.0',
  '(Macintosh; Intel Mac OS X 10_8_5)',
  'AppleWebKit/537.36',
  '(KHTML, like Gecko)',
  'Chrome/31.0.1650.63 Safari/537.36',
].join(' ');

const fetch = function fetch(feed) {
  return new Promise((resolve, reject) => {
    request(feed, (err, res, data) => {
      if (err) {
        logger.error('Network Error', err);
        return reject(err);
      }

      parsePodcast(data, (err, stationData) => {
        if (err) {
          logger.error('Parsing error', err);
          return reject(err);
        }

        const {
          categories,
          title,
          link,
          updated,
          description,
          image,
          episodes,
        } = stationData;
        console.log(episodes);
      });
    });
  });
};

const feeds = [
//  'http://feeds.themoth.org/themothpodcast',
  'http://feeds.serialpodcast.org/serialpodcast',
//  'http://www.npr.org/templates/rss/podlayer.php?id=1014',
//  'http://www.bloomberg.com/feeds/podcasts/masters_in_business.xml',

//  'http://podcasts.cstv.com/feeds/fantasyfootball.xml',
//  'http://podcasts.cstv.com/feeds/nba.xml',
];

feeds.forEach(fetch);
