const Nick = require('nickjs');
const _ = require('lodash');
const URLOpener = require('../utils/url-opener');
const utils = require('./utils');
const nick = new Nick({ printNavigation: false });

const args = process.argv.slice(2);
const handle = args[0];

(async () => {
  const url = `https://instagram.com/${handle}`;
  const tab = await nick.newTab();
  const urlOpener = new URLOpener(nick, tab);

  await urlOpener.open(url);
  await tab.untilVisible("#react-root");
  await tab.inject('https://code.jquery.com/jquery-3.2.1.min.js');
  await tab.inject('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js');

  const scraper = (arg, done) => {
    const payload = _.get(window._sharedData || {}, 'entry_data.ProfilePage[0].graphql.user', {});
    done(null, payload);
  };

  const res = await tab.evaluate(scraper);

  const account = {
    id: _.get(res, 'id', null),
    username: _.get(res, 'username', null),
    name: _.get(res, 'full_name', null),
    bio: _.get(res, 'biography', null),
    postCount: _.get(res, 'edge_owner_to_timeline_media.count', null),
    followerCount: _.get(res, 'edge_followed_by.count', null),
    followCount: _.get(res, 'edge_follow.count', null),
    isPrivate: _.get(res, 'is_private', null),
    isVerified: _.get(res, 'is_verified', null),
    avatar: _.get(res, 'profile_pic_url_hd', null),
  };

  console.log(JSON.stringify(account, null, 2));
})()
.then((post) => {
  nick.exit();
})
.catch((err) => {
  console.error(`Something went wrong: ${err}`);
  nick.exit(1);
});
