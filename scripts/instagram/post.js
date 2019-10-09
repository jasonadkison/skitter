const Nick = require('nickjs');
const _ = require('lodash');
const URLOpener = require('../url-opener');
const utils = require('./utils');

const nick = new Nick();
const args = process.argv.slice(2);
const url = args[0];

(async () => {
  const tab = await nick.newTab();
  const urlOpener = new URLOpener(nick, tab);

  await urlOpener.open(url);
  await tab.untilVisible("#react-root > section > main > div > div > article > header > div canvas");
  await tab.inject('https://code.jquery.com/jquery-3.2.1.min.js');
  await tab.inject('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js');

  const scraper = (arg, done) => {
    const payload = _.get(window._sharedData || {}, 'entry_data.PostPage[0].graphql.shortcode_media', {});
    done(null, payload);
  };

  const res = await tab.evaluate(scraper);

  console.log({
    id: _.get(res, 'id', null),
    shortcode: _.get(res, 'shortcode', null),
    username: _.get(res, 'owner.username', null),
    name: _.get(res, 'owner.full_name', null),
    avatar: _.get(res, 'owner.profile_pic_url', null),
    caption: _.get(res, 'edge_media_to_caption.edges[0].node.text', null),
    likesCount: _.get(res, 'edge_media_preview_like.count', null),
    viewsCount: _.get(res, 'video_view_count', null),
    commentsCount: _.get(res, 'edge_media_preview_comment.count', null),
    mediaType: _.get(res, 'is_video', false) ? 'video' : 'image',
    imageUrl: _.get(res, 'display_url', null),
    videoUrl: _.get(res, 'video_url', null),
    createdAtTime: _.get(res, 'taken_at_timestamp', null),
    isSponsored: utils.isSponsoredMedia(res),
  });
})()
.then(() => {
  nick.exit();
})
.catch((err) => {
  console.log(`Something went wrong: ${err}`);
  nick.exit(1);
});
