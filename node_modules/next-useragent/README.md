# next-useragent

`next-useragent` parses browser user-agent strings for [next.js](https://nextjs.org/).

## Installation

```
$ npm install next-useragent
```

## Usage

`next-useragent` is simple to use.  
Give access to user-agent details anywhere using `withUserAgent` method.

* Passed as an argument of getInitialProps method.
* Passed as property of React component.

### HOCs

```tsx
import React from 'react'
import dynamic from 'next/dynamic'
import { WithUserAgentProps, withUserAgent } from 'next-useragent'

const DesktopContent = dynamic(() => import('./desktop-content'))
const MobileContent = dynamic(() => import('./mobile-content'))

class IndexPage extends React.Component<WithUserAgentProps> {

  static async getInitialProps(ctx) {
    return { useragent: ctx.ua.source }
  }

  render() {
    const { ua, useragent } = this.props

    return (
      <>
        <p>{ useragent }</p>
        { ua.isMobile ? (
        <MobileContent />
        ) : (
        <DesktopContent />
        ) }
      </>
    )
  }
}

export default withUserAgent(IndexPage)
```

### Hooks

The `useUserAgent` returns `UserAgent` instance.

```tsx
import React from 'react'
import dynamic from 'next/dynamic'
import { useUserAgent } from 'next-useragent'

const DesktopContent = dynamic(() => import('./desktop-content'))
const MobileContent = dynamic(() => import('./mobile-content'))

export default props => {
  let ua;
  if (props.uaString) {
    ua = useUserAgent(props.uaString)
  } else {
    ua = useUserAgent(window.navigator.userAgent)
  }

  return (
    <div>
      <p>{ ua.source }</p>
      { ua.isMobile ? (
        <MobileContent />
      ) : (
        <DesktopContent />
      ) }
    </div>
  )
}

export function getServerSideProps(context) {
  return {
    props: {
      uaString: context.req.headers['user-agent']
    }
  }
}
```

### Parse function

The `parse` returns `UserAgent` instance.

This works on server side and inside conditions without ESLint throwing errors

```tsx
import React from 'react'
import dynamic from 'next/dynamic'
import { parse } from 'next-useragent'

const DesktopContent = dynamic(() => import('./desktop-content'))
const MobileContent = dynamic(() => import('./mobile-content'))

export default props => {
  let ua;
  if (props.uaString) {
    ua = parse(props.uaString)
  } else {
    ua = parse(window.navigator.userAgent)
  }

  return (
    <div>
      <p>{ ua.source }</p>
      { ua.isMobile ? (
        <MobileContent />
      ) : (
        <DesktopContent />
      ) }
    </div>
  )
}

export function getServerSideProps(context) {
  return {
    props: {
      uaString: context.req.headers['user-agent']
    }
  }
}
```

### parsed objects

The parsed objects looks like the following:

```
{
  source: 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12A365 Safari/600.1.4',
  deviceType: 'mobile',
  deviceVendor: 'Apple',
  os: 'iOS',
  osVersion: 8,
  browser: 'Mobile Safari',
  browserVersion: 8,
  isIphone: true,
  isIpad: false,
  isMobile: true,
  isTablet: false,
  isDesktop: false,
  isChrome: false,
  isFirefox: false,
  isSafari: true,
  isIE: false,
  isMac: false,
  isChromeOS: false,
  isWindows: false,
  isIos: false,
  isAndroid: false,
  isBot: false
}
```

## License

`next-useragent` is licensed under MIT License.  
See [LICENSE](https://github.com/tokuda109/next-useragent/blob/master/LICENSE) for more information.
