class URLOpener {

  constructor(nick, tab) {
    this.nick = nick;
    this.tab = tab;
  }

  // Opens a page and handles unexpected redirects and statuses.
  async open(requestURL) {
    const [statusCode, httpStatus, responseURL] = await this.tab.open(requestURL);

    const params = { requestURL, responseURL, statusCode };

    // error out if instagram redirected to login page
    if (responseURL.includes('instagram.com/accounts/login')) {
      await this.raiseHttpException('Login page detected.', params);
    }

    if ((statusCode >= 300) || (statusCode < 200)) {
      await this.raiseHttpException('Unexpected HTTP status code encountered.', params)
    }
  }

  // throw an exception and stop execution
  async raiseHttpException(message = "Execution halted, Http exception occurred.", params = {}) {
    console.error(message);
    console.log(params);
    this.nick.exit(1);
  }
}

module.exports = URLOpener;
