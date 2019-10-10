const Nick = require('nickjs');
const _ = require('lodash');
const URLOpener = require('../utils/url-opener');
const utils = require('./utils');

const nick = new Nick({ printNavigation: false });
const args = process.argv.slice(2);
const handle = args[0];
const count = args[1] || 50;

(async () => {
  const tab = await nick.newTab();
  const urlOpener = new URLOpener(nick, tab);

  await urlOpener.open(`https://instagram.com/${handle}`);
  await tab.untilVisible("#react-root");
  await tab.inject('https://code.jquery.com/jquery-3.2.1.min.js');
  await tab.inject('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js');
  await tab.inject('https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.12.0/js/md5.min.js');
  //await tab.inject('https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.1/js.cookie.min.js');

  const res = await tab.evaluate((arg, done) => {
    const edges = [];
    const getPostEdges = edge => _.get(edge, 'edge_owner_to_timeline_media.edges', []);
    const userEdge = _.get(window._sharedData, 'entry_data.ProfilePage[0].graphql.user', {});
    const rhxGis = ''; // must be blank as of recently

    const account = {
      id: _.get(userEdge, 'id', null),
      username: _.get(userEdge, 'username', null),
      name: _.get(userEdge, 'full_name', null),
      bio: _.get(userEdge, 'biography', null),
      postCount: _.get(userEdge, 'edge_owner_to_timeline_media.count', null),
      followerCount: _.get(userEdge, 'edge_followed_by.count', null),
      followCount: _.get(userEdge, 'edge_follow.count', null),
      isPrivate: _.get(userEdge, 'is_private', null),
      isVerified: _.get(userEdge, 'is_verified', null),
      avatar: _.get(userEdge, 'profile_pic_url_hd', null),
    };

    // start with the first 12 posts on page already loaded
    _.forEach(getPostEdges(userEdge), function(edge) {
      if (edges.length >= arg.count) return false;
      edges.push(edge);
    });

    const fetchNextPage = (endCursor) => {

      const variables = JSON.stringify({
        id: account.id,
        first: 12,
        after: endCursor
      });

      const res = $.ajax({
        url: `https://www.instagram.com/graphql/query`,
        data: {
          query_hash: '42323d64886122307be10013ad2dcc44', // subject to change
          variables,
        },
        async: false,
        headers: {
          'x-instagram-gis': md5(`:${variables}`),
          //'x-requested-with': 'XMLHttpRequest',
          'x-csrftoken': md5((new Date()).getTime()),
        },
        xhrFields: { withCredentials: true },
      });

      let data;

      try {
        data = JSON.parse(res.responseText);
      } catch(e) {
        done(`json fetch failed with status code ${res.status}`);
      }

      return _.get(data, 'data.user', {});
    };

    // If we need more results
    if (arg.count - edges.length > 0) {

      let hasNextPage = _.get(userEdge, 'edge_owner_to_timeline_media.page_info.has_next_page', false);
      let endCursor = _.get(userEdge, 'edge_owner_to_timeline_media.page_info.end_cursor', null);

      // fetch results until we hit our desired total
      while (hasNextPage && arg.count - edges.length > 0) {
        const nextPage = fetchNextPage(endCursor);
        const nextPageEdges = getPostEdges(nextPage);

        _.forEach(nextPageEdges, function(edge) {
          if (edges.length >= arg.count) return false;
          edges.push(edge);
        });

        hasNextPage = _.get(nextPage, 'edge_owner_to_timeline_media.page_info.has_next_page', false);
        endCursor = _.get(nextPage, 'edge_owner_to_timeline_media.page_info.end_cursor', null);
      }

    }

    done(null, { account, edges });
  }, { count });

  const { account, edges } = res;
  const posts = [];

  _.forEach(edges, function(edge) {
    const postNode = _.get(edge, 'node', {});
    const post = {
      id: _.get(postNode, 'id', null),
      shortcode: _.get(postNode, 'shortcode', null),
      caption: _.get(postNode, 'edge_media_to_caption.edges[0].node.text', null),
      likesCount: _.get(postNode, 'edge_media_preview_like.count', null),
      viewsCount: _.get(postNode, 'video_view_count', null),
      commentsCount: _.get(postNode, 'edge_media_to_comment.count', null),
      mediaType: _.get(postNode, 'is_video', false) ? 'video' : 'image',
      imageUrl: _.get(postNode, 'display_url', null),
      videoUrl: _.get(postNode, 'video_url', null),
      createdAtTime: _.get(postNode, 'taken_at_timestamp', null),
      isSponsored: utils.isSponsoredMedia(postNode),
      account,
    };
    posts.push(post);
  });

  console.log(JSON.stringify(posts, null, 2));
})()
.then(() => {
  nick.exit();
})
.catch((err) => {
  console.log(`Something went wrong: ${err}`);
  nick.exit(1);
});
