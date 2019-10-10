const Nick = require('nickjs');
const _ = require('lodash');
const URLOpener = require('../utils/url-opener');
const utils = require('./utils');
const nick = new Nick({ printNavigation: false });

const args = process.argv.slice(2);
const shortcode = args[0];

(async () => {
  const url = `https://instagram.com/p/${shortcode}`;
  const tab = await nick.newTab();
  const urlOpener = new URLOpener(nick, tab);

  await urlOpener.open(url);
  await tab.untilVisible("#react-root");
  await tab.inject('https://code.jquery.com/jquery-3.2.1.min.js');
  await tab.inject('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js');
  await tab.inject('https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.12.0/js/md5.min.js');

  const scraper = (arg, done) => {

    const extractCommentEdges = (payload) => {
      const edges = [];
      _.get(payload, 'shortcode_media.edge_media_to_comment.edges', []).map(edge => edges.push(edge));
      _.get(payload, 'shortcode_media.edge_media_to_parent_comment.edges', []).map(edge => edges.push(edge));
      return edges;
    };

    const extractPageInfo = (data) => {
      const option1 = _.get(data, 'shortcode_media.edge_media_to_comment.page_info', {});
      if (option1.end_cursor) return option1;

      return _.get(data, 'shortcode_media.edge_media_to_parent_comment.page_info', {});
    };

    const sharedData = window._sharedData || {};
    const payload = _.get(sharedData, 'entry_data.PostPage[0].graphql', {});
    const shortcode = _.get(payload, 'shortcode_media.shortcode', null);
    const pageInfo = extractPageInfo(payload);
    const results = [];

    _.forEach(extractCommentEdges(payload), function(commentEdge) {
      results.push(commentEdge);
    });

    // https://www.instagram.com/graphql/query/?query_hash=33ba35852cb50da46f5b5e889df7d159&variables={"shortcode":"Bf-I2P6grhd","first":20,"after":"XXXXXXXX"}
    const fetchNextPage = (endCursor) => {
      const variables = JSON.stringify({
        shortcode: shortcode,
        first: 1000,
        after: endCursor
      });

      const res = $.ajax({
        url: `https://www.instagram.com/graphql/query`,
        data: {
          query_hash: 'f0986789a5c5d17c2400faebf16efd0d', // subject to change
          variables,
        },
        async: false,
        headers: {
          'x-instagram-gis': md5(`:${variables}`),
          //'x-requested-with': 'XMLHttpRequest',
        },
        xhrFields: { withCredentials: true },
      });

      try {
        return _.get(JSON.parse(res.responseText), 'data', {});
      } catch(err) {
        done(`Failed to fetch next page of comments. Status ${res.status}: ${err.message}`);
      }
    };

    let hasNextPage = _.get(pageInfo, 'has_next_page', false);
    let endCursor = _.get(pageInfo, 'end_cursor', null);

    // If we have more results
    if (hasNextPage) {

      // fetch all results
      while (hasNextPage) {
        const nextPage = fetchNextPage(endCursor);
        const nextPageCommentEdges = extractCommentEdges(nextPage);
        const nextPageInfo = extractPageInfo(nextPage);

        _.forEach(nextPageCommentEdges, function(commentEdge) {
          results.push(commentEdge);
        });

        hasNextPage = _.get(nextPageInfo, 'has_next_page', false);
        endCursor = _.get(nextPageInfo, 'end_cursor', null);
      }

    }

    done(null, results);
  };

  const res = await tab.evaluate(scraper);

  // extract basic fields and sort results
  const nodes = _(_.map(res, 'node'))
    .map(item => _.pick(item, ['id', 'text', 'created_at', 'owner']))
    .sortBy(['created_at'])
    .reverse()
    .value();

  // normalize flat objects
  const comments = _.map(nodes, comment => ({
    id: _.get(comment, 'id', null),
    createdAt: _.get(comment, 'created_at', null),
    text: _.get(comment, 'text', null),
    userId: _.get(comment, 'owner.id', null),
    userAvatar: _.get(comment, 'owner.profile_pic_url', null),
    username: _.get(comment, 'owner.username', null),
  }));

  console.log(JSON.stringify(comments, null, 2));
})()
.then((post) => {
  nick.exit();
})
.catch((err) => {
  console.error(`Something went wrong: ${err}`);
  nick.exit(1);
});
