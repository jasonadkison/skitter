# Skitter

Web scraping within a docker container using [NickJS](https://github.com/phantombuster/nickjs) and headless chrome.

## Building the image
`docker build -t IMAGE:TAG .`

## Running scripts
Scripts are mounted at runtime.

`docker run -v "${PWD}/scripts":/skitter/scripts IMAGE:TAG node scripts/demo.js`

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/jasonadkison/skitter.

## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
