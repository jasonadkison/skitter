const Nick = require('nickjs');
const deabbreviate = require('deabbreviate-number');
const URLOpener = require('../utils/url-opener');
const parse = require('node-html-parser').parse;
const nick = new Nick({ printNavigation: false });

const args = process.argv.slice(2);
const url = args[0];

const postType = ((url) => {
  if (/^https?:\/\/(www\.)?facebook\.com\/(photo(\.php|s)|permalink\.php|media|questions|notes|[^\/]+\/(activity|posts|photos))[\/?].*$/gm.test(url)) {
    return 'post';
  }
  if (/^https?:\/\/(www\.)?facebook\.com\/([^\/?].+\/)?video(s|\.php)[\/?].*$/gm.test(url)) {
    return 'video';
  }
})(url);

if (!postType) throw new Error('Could not determine the type of post');

(async (url) => {
  const tab = await nick.newTab();
  const urlOpener = new URLOpener(nick, tab);

  await urlOpener.open(url);
  await tab.untilVisible(".userContentWrapper");
  await tab.inject('https://code.jquery.com/jquery-3.2.1.min.js');

  const scrapePost = (arg, done) => {
    const wrapper = $('.userContentWrapper:first');
    if (!wrapper.length) return done('Could not find wrapper element');

    // the header contains their name and posted_at timestamp
    const header = $('div[id^="feed_subtitle_"]', wrapper);
    if (!header.length) return done('Could not find the header');

    // the content contains the post body
    const content = $('.userContent', wrapper);
    if (!content.length) return done('Could not find the content');

    // the footer contains the post stats
    const footer = $('form.commentable_item', wrapper);
    if (!footer.length) return done('Could not find the footer');

    const stats = (() => {
      const summary = $('[data-testid="fbFeedStoryUFI/feedbackSummary"]', footer);
      if (!summary.length) return done('Could not find the summary element');

      const reactions = $('[data-testid="UFI2ReactionsCount/root"] [data-testid="UFI2ReactionsCount/sentenceWithSocialContext"]', summary);
      if (!reactions.length) return done('Could not find the reactions element');

      const likes = $('[aria-label*="Like"]:first', footer);
      if (!likes.length) return done('Could not find the likes element');

      const comments = $('[data-testid="UFI2CommentsCount/root"]:first', footer);
      if (!comments.length) return done('Could not find the comments element');

      const shares = $('[data-testid="UFI2SharesCount/root"]:first', footer);
      if (!shares.length) return done('Could not find the shares element');

      return {
        reactions: reactions.text(),
        likes: likes.attr('aria-label').replace(/\slike(.*)/gi, ''),
        comments: comments.text().replace(/\scomment(.*)/gi, ''),
        shares: shares.text().replace(/\sshare(.*)/gi, ''),
        views: null,
      };
    })();

    const getPostMediaData = (() => {
      const imageWrapper = $('.userContent + div', wrapper);
      const image = $('[data-ploi]:first', imageWrapper).data('ploi');
      const type = image ? 'image' : 'text';

      return {
        type,
        image,
      };
    });

    const getVideoMediaData = (() => {
      const type = 'video';
      const image = $('div[id^=permalink_video] video + div img').attr('src');
      if (!image) return done('Could not get video image');
      return {
        type,
        image,
      };
    });

    const post = (() => {
      const id = $('input[name="ft_ent_identifier"]', footer).attr('value');
      const body = $(content.html().replace(/<(br)\s*?\/?>/g, '\n').replace('<br />', '\n')).text();
      const timestamp = $('abbr[data-utime]', header).data('utime');

      if (!id) return done('Could not get post id');
      if (!timestamp) return done('Could not get post timestamp');

      const data = {
        id,
        url: arg.url,
        body,
        timestamp,
      };

      const mediaData = arg.postType === 'post' ? getPostMediaData() : getVideoMediaData();

      return { ...data, ...mediaData };
    })();

    done(null, { post, stats });
  };

  const scrapeVideoViews = async (args, done) => {
    const { url } = args;

    $.ajax({ url })
      .then((html) => {
        const regex = /<span>([0-9,]+)\s(Views)<\/span>/gi;
        const videoViews = regex.exec(html)[1];

        done(null, videoViews);
      })
      .fail((xhr, status, error) => done(`scrapeVideoViews promise rejected, ${status}: ${error}`));
  };

  const post = await tab.evaluate(scrapePost, { url, postType });
  const videoViews = postType === 'video' ? await tab.evaluate(scrapeVideoViews, { url }) : null;
  post.stats.views = postType === 'video' ? videoViews : null;

  Object.keys(post.stats).forEach(key => post.stats[key] = deabbreviate(post.stats[key]));

  console.log(JSON.stringify(post, null, 2));
})(url)
.then((post) => {
  nick.exit();
})
.catch((err) => {
  console.error(`Something went wrong: ${err}`);
  nick.exit(1);
});
