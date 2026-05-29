import LayoutInterface from "@/interfaces/layoutInterface";

// Campaign pixel 1650946159536225 is scoped to this route only. Rendered as a
// server-side inline <script> so it's present in the SSR HTML and detected by
// Meta's Pixel Helper / Event Setup Tool. The base fbevents loader and the two
// site-wide pixels live in app/layout.tsx; the loader's `if(f.fbq)return` guard
// makes re-running it here a no-op on a normal (non-alpha) load. PageView uses
// trackSingle so it fires only to the campaign pixel — the site-wide pixels
// already got their PageView from the root layout.
const PIXEL_ENABLED =
  process.env.NEXT_PUBLIC_API_URL !== "https://alpha.quikkred.in";

const CollectionPartnerLayout = ({ children }: LayoutInterface) => (
  <>
    {PIXEL_ENABLED && (
      <script
        dangerouslySetInnerHTML={{
          __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1650946159536225');
fbq('trackSingle', '1650946159536225', 'PageView');`,
        }}
      />
    )}
    {PIXEL_ENABLED && (
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1650946159536225&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
    )}
    {children}
  </>
);

export default CollectionPartnerLayout;
