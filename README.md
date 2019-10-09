# Skitter

Web scraping within a docker container using [NickJS](https://github.com/phantombuster/nickjs) and headless chrome.

## Building the image
`docker build -t skitter:1 .`

## Running scripts
Scripts are mounted in the container at runtime. This includes all the necessary dependencies so don't forget to `cd ./scripts && npm install`

### Run the hackernews demo
```bash
docker run -v "${PWD}/scripts":/skitter/scripts skitter:1 node demo.js

DevTools listening on ws://127.0.0.1:9222/devtools/browser/70a1df94-1de4-4880-8358-413883c518d5
> It took 112ms to start and connect to Chrome (1 tries)
> Tab 1: Navigation (open): https://news.ycombinator.com/
[
  {
    "title": "Ken Thompson's Unix Password",
    "url": "https://leahneukirchen.org/blog/archive/2019/10/ken-thompson-s-unix-password.html"
  },
  {
    "title": "No Radical Changes in GNU Project",
    "url": "https://lists.gnu.org/archive/html/info-gnu/2019-10/msg00005.html"
  },
  {
    "title": "China attacks Apple for allowing Hong Kong crowdsourced police activity app",
    "url": "https://techcrunch.com/2019/10/09/china-attacks-apple-for-allowing-hong-kong-crowdsourced-police-activity-app/"
  },
  ...
]
Job done!
```

### Instagram Post
```bash
docker run -v "${PWD}/scripts":/skitter/scripts skitter:1 node instagram/post.js https://www.instagram.com/p/B3KmuouB3Md/

> Tab 1: Navigation (scriptInitiated): https://staticxx.facebook.com/connect/xd_arbiter.php?version=44#channel=f3224491638f6a8&origin=https%3A%2F%2Fwww.instagram.com
> Tab 1: Navigation (open): https://www.instagram.com/p/B3KmuouB3Md/
{ id: '2146698502980727581',
  shortcode: 'B3KmuouB3Md',
  username: 'vancityreynolds',
  name: 'Ryan Reynolds',
  avatar: 'https://instagram.fdpa1-1.fna.fbcdn.net/vp/d281754be00fb951e0d422e6dfdf6de5/5E349995/t51.2885-19/s150x150/67563378_539439043460568_7186379751144030208_n.jpg?_nc_ht=instagram.fdpa1-1.fna.fbcdn.net',
  caption: 'The best thing about working on Free Guy? Meeting Trevor Waititi. #FreeGuy #NewFriends \n@taikawaititi',
  likesCount: 538725,
  viewsCount: 3387151,
  commentsCount: 4885,
  mediaType: 'video',
  imageUrl: 'https://instagram.fdpa1-1.fna.fbcdn.net/vp/7f79f02e62004d0b29c30613aa0420cb/5DA0833F/t51.2885-15/e35/70051568_2301649566628026_8515410434352952870_n.jpg?_nc_ht=instagram.fdpa1-1.fna.fbcdn.net&_nc_cat=1',
  videoUrl: 'https://instagram.fdpa1-1.fna.fbcdn.net/v/t50.16885-16/10000000_203466567321925_3231479795284523578_n.mp4?_nc_ht=instagram.fdpa1-1.fna.fbcdn.net&_nc_cat=101&oe=5DA0732E&oh=c70a8f67115cacdb7806feeb32f39742',
  createdAtTime: 1570126526,
  isSponsored: false }
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/jasonadkison/skitter.
