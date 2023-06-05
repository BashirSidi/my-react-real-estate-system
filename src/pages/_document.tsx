import React from 'react';
import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';
import { ServerStyleSheets } from '@material-ui/styles';
import { MuiTheme } from '../MuiTheme';
import {
  GOOGLE_TRACKING_ID, APP_ENV, GOOGLE_API_KEY, BRANCH_SDK_KEY,
  INTERCOM_APP_ID,
} from '../config';

type Props = {
  pageProps: any
};
class MyDocument extends Document<Props> {
  render(): JSX.Element {
    return (
      <Html style={{ fontSize: '62.5%' }}>
        <Head>
          <meta name="theme-color" content={MuiTheme.palette.primary.main} />
          <meta name="keywords" content="space, next, door" />
          <meta name="description" content="space next door" />
          <meta charSet="utf-8" />
          <script src="https://player.live-video.net/1.7.0/amazon-ivs-player.min.js" />
          <script src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`} />
          {
            APP_ENV === 'prod'
            && (
              <script
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer', '${GOOGLE_TRACKING_ID}');
              `,
                }}
                defer
              />
            )
          }
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `(function(b,r,a,n,c,h,_,s,d,k){if(!b[n]||!b[n]._q){for(;s<_.length;)c(h,_[s++]);d=r.createElement(a);d.async=1;d.src="https://cdn.branch.io/branch-latest.min.js";k=r.getElementsByTagName(a)[0];k.parentNode.insertBefore(d,k);b[n]=h}})(window,document,"script","branch",function(b,r){b[r]=function(){b._q.push([r,arguments])}},{_q:[],_v:1},"addListener applyCode autoAppIndex banner closeBanner closeJourney creditHistory credits data deepview deepviewCta first getCode init link logout redeem referrals removeListener sendSMS setBranchViewData setIdentity track validateCode trackCommerceEvent logEvent disableTracking".split(" "), 0);
              branch.init('${BRANCH_SDK_KEY}');
              `,
            }}
            defer
          />
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `
              window.intercomSettings = { app_id: '${INTERCOM_APP_ID}'};
              (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/${INTERCOM_APP_ID}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();`,
            }}
            defer
          />

        </Head>
        <body>
          {
            APP_ENV === 'prod'
            && (
              <noscript>
                <iframe
                  title="dd"
                  src={`https://www.googletagmanager.com/ns.html?id=${GOOGLE_TRACKING_ID}`}
                  height="0"
                  width="0"
                  style={{ display: 'none', visibility: 'hidden' }}
                />
              </noscript>
            )
          }
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () => originalRenderPage({
    enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
  });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};

export default MyDocument;
