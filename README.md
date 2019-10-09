# Skitter

Web scraping within a docker container using [NickJS](https://github.com/phantombuster/nickjs) and headless chrome.

## Building the image
`docker build -t skitter:1 .`

## Running scripts
Scripts are mounted in the container at runtime.

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
## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/jasonadkison/skitter.
