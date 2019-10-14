# Skitter

Web scraping within docker containers using [NickJS](https://github.com/phantombuster/nickjs) and
headless chrome.

The main service is an express HTTP server with endpoints for each scraper. It handles running
scrapers in sibling worker containers.

# [Scrapers](#scrapers)

## [Demo](#demo)

### hackernews demo

Returns hackernews posts.

**Endpoint:** `/demo`

```bash
$ curl -XGET http://localhost:8080/demo
[
  {
    "title": "Hams Must Remove Repeaters from CA Mountaintops or Pay Huge Fees [pdf]",
    "url": "http://www.shastadefense.com/FAX-CalFireHamRadio20190923.pdf"
  },
  ...
]
```

## [Instagram](#instagram)

### [Instagram Account](#instagram-account)

Returns an Instagram account.

**Endpoint:** `/instagram/account/:handle`

```bash
$ curl -XGET http://localhost:8080/instagram/account/vancityreynolds
{
  "id": "1942463581",
  "username": "vancityreynolds",
  "name": "Ryan Reynolds",
  "bio": "Owner: @aviationgin",
  "postCount": 454,
  "followerCount": 33083449,
  "followCount": 195,
  "isPrivate": false,
  "isVerified": true,
  "avatar": "https://instagram.fdpa1-1.fna.fbcdn.net/vp/d2464592778252b3bb75e76d0e416b27/5E3D0765/t51.2885-19/s320x320/67563378_539439043460568_7186379751144030208_n.jpg?_nc_ht=instagram.fdpa1-1.fna.fbcdn.net"
}
```

### [Instagram Post](#instagram-post)

Returns an Instagram post.

**Endpoint:** `/instagram/post/:shortcode`

```bash
$ curl -XGET http://localhost:8080/instagram/post/B3KmuouB3Md
{
  "id": "2146698502980727581",
  "shortcode": "B3KmuouB3Md",
  "username": "vancityreynolds",
  "name": "Ryan Reynolds",
  "avatar": "https://instagram.fdpa1-1.fna.fbcdn.net/vp/d281754be00fb951e0d422e6dfdf6de5/5E349995/t51.2885-19/s150x150/67563378_539439043460568_7186379751144030208_n.jpg?_nc_ht=instagram.fdpa1-1.fna.fbcdn.net",
  "caption": "The best thing about working on Free Guy? Meeting Trevor Waititi. #FreeGuy #NewFriends \n@taikawaititi",
  "likesCount": 539028,
  "viewsCount": 3395414,
  "commentsCount": 4894,
  "mediaType": "video",
  "imageUrl": "https://instagram.fdpa1-1.fna.fbcdn.net/vp/7911b379366c221ef443a9a7d11fbef7/5DA12BFF/t51.2885-15/e35/70051568_2301649566628026_8515410434352952870_n.jpg?_nc_ht=instagram.fdpa1-1.fna.fbcdn.net&_nc_cat=1",
  "videoUrl": "https://instagram.fdpa1-1.fna.fbcdn.net/v/t50.16885-16/10000000_203466567321925_3231479795284523578_n.mp4?_nc_ht=instagram.fdpa1-1.fna.fbcdn.net&_nc_cat=101&oe=5DA11BEE&oh=84ca013beff9924d9d77f459306eebee",
  "createdAtTime": 1570126526,
  "isSponsored": false
}
```

### [Instagram Comments](#instagram-comments)

Returns a post's comments.

**Endpoint:** `/instagram/comments/:shortcode`

```bash
$ curl -XGET http://localhost:8080/instagram/comments/B3KmuouB3Md
[
  {
    "id": "17849038498631820",
    "createdAt": 1570743028,
    "text": "@autokineticnyc",
    "userId": "230184381",
    "userAvatar": "https://instagram.fdpa1-1.fna.fbcdn.net/vp/7d6b16f948316c26579068ff1c75c3d2/5E23953C/t51.2885-19/s150x150/66653354_440256546818344_6930934793097969664_n.jpg?_nc_ht=instagram.fdpa1-1.fna.fbcdn.net",
    "username": "a_digimon"
  },
  ...
]
```

### [Instagram Feed](#instagram-feed)

Returns a user's recent posts.

**Endpoint:** `/instagram/feed/:handle/:count`

```bash
$ curl -XGET http://localhost:8080/instagram/feed/vancityreynolds/20
[
  {
    "id": "2146790862041136155",
    "shortcode": "B3K7uozBDwb",
    "caption": "Thank you #NYCC2019 for the huge #FreeGuy welcome. We’re all still shaking. And Joe Keery is still a goddamn snack. July 3rd. 👕",
    "likesCount": 891905,
    "viewsCount": null,
    "commentsCount": 2377,
    "mediaType": "image",
    "imageUrl": "https://instagram.fdpa1-1.fna.fbcdn.net/vp/30c56e7ef06c7ef3f4db2f289553d110/5E2D3B10/t51.2885-15/e35/p1080x1080/70272979_674463866416975_8656042292228703769_n.jpg?_nc_ht=instagram.fdpa1-1.fna.fbcdn.net&_nc_cat=1",
    "videoUrl": null,
    "createdAtTime": 1570137435,
    "isSponsored": false,
    "account": {
      "id": "1942463581",
      "username": "vancityreynolds",
      "name": "Ryan Reynolds",
      "bio": "Owner: @aviationgin",
      "postCount": 454,
      "followerCount": 33076847,
      "followCount": 195,
      "isPrivate": false,
      "isVerified": true,
      "avatar": "https://instagram.fdpa1-1.fna.fbcdn.net/vp/d2464592778252b3bb75e76d0e416b27/5E3D0765/t51.2885-19/s320x320/67563378_539439043460568_7186379751144030208_n.jpg?_nc_ht=instagram.fdpa1-1.fna.fbcdn.net"
    }
  },
  ...
]
```

## [Facebook](#facebook)

### [Facebook Post](#facebook-post)

Returns a Facebook post

**Endpoint:** `/facebook/post?url=:url`

```bash
$ curl -XGET http://localhost:8080/facebook/post?url=https://www.facebook.com/Drake/videos/369537750369288
{
  "post": {
    "id": "10157393620784304",
    "url": "https://www.facebook.com/Drake/videos/369537750369288",
    "body": "EPISODE 2 TONIGHT. HBO Euphoria",
    "timestamp": 1561320290,
    "type": "video",
    "image": "https://scontent.fdpa1-1.fna.fbcdn.net/v/t15.5256-10/65303858_369537940369269_5753347626317643776_n.jpg?_nc_cat=103&_nc_oc=AQkeS-E_B-uTETWkyLKXku8nU3rVA4CtxXhMAHCzaqGuBjDSvkOc3yiX-fbGOIT3S0M&_nc_ht=scontent.fdpa1-1.fna&oh=944856e8bcbc766ae0313824e0257dc4&oe=5E1F4AFD"
  },
  "stats": {
    "reactions": 9000,
    "likes": 7800,
    "comments": 1600,
    "shares": "485",
    "views": "114,998"
  }
}
```

More scrapers will be added soon, feel free to submit yours via PR!

# [Development](#development)

Simple workflow - just run nodemon and the server will run in watch mode. This starts the server
outside of a container.

```bash
# start development
$ nodemon server
[nodemon] 1.19.3
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): server/**/*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node server`
Running on http://0.0.0.0:8080
```

If you edit worker files, you'll need to rebuild the worker image before running them.

```bash
# build worker image
$ docker build -t skitter/worker ./worker
```

You can also run scrapers independent of the server container using `docker run`.

```bash
# run a scraper directly on the worker container
$ docker run skitter/worker instagram/account vancityreynolds
```

# [Deploying](#deploying)

When you're ready to deploy the platform just build both images so the latest code changes can be
deployed.

```bash
# build both images
$ docker build -t skitter/server ./server
$ docker build -t skitter/worker ./worker
```

The server container requires access to the Docker socket of the host so it can issue commands
to run worker containers. It must be bind-mounted at runtime.

```bash
# run the server container with access to docker socket
$ docker run -it -v /var/run/docker.sock:/var/run/docker.sock -p 8080:8080 skitter/server

> skitter-server@1.0.0 start /var/app
> node server.js

Running on http://0.0.0.0:8080
```

## [Roadmap](#roadmap)
* Implement streams and real-time tailing of the scraper output.
* Add better error handling and payload delivery.
* Add proxy pool
* Add an actual UI
* Testing

## [Contributing](#contributing)

Bug reports and pull requests are welcome on GitHub at https://github.com/jasonadkison/skitter.
