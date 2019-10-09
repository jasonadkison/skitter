const _ = require('lodash');

module.exports = {

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
  }

}
