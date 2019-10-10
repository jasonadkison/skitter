const _ = require('lodash');

module.exports = {

  getCSRFToken: (arg, done) => {
    const token = Cookies.get('csrftoken');
    if (!token) return done('Could not extract the CSRF token.');
    done(null, token);
  },

  getRhxGisToken: (arg, done) => {
    const token = _.get(window._sharedData, 'rhx_gis', null);
    if (!token) return done('Could not extract the rhx_gis token.');
    done(null, token);
  },

  isSponsoredMedia: (mediaEdge) => {
    if (_.get(mediaEdge, 'is_ad', false)) {
      return true;
    }

    if (_.get(mediaEdge, 'edge_media_to_sponsor_user.edges[0].node.sponsor.id', false)) {
      return true;
    }

    const caption = _.get(mediaEdge, 'edge_media_to_caption.edges[0].node.text', '');
    const hashtags = caption.match(/#[a-z]+/gi);

    if (_.isArray(hashtags)) {
      const formattedHashtags = hashtags.map(hashtag => hashtag.toLowerCase());
      if (
        _.includes(formattedHashtags, '#ad') ||
        _.includes(formattedHashtags, '#sponsored') ||
        _.includes(formattedHashtags, '#partner')
      ) {
        return true;
      }
    }

    return false;
  },

}
