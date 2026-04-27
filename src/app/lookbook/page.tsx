import Announcement from '@/components/layout/Announcement';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/layout/PageHero';
import CartDrawer from '@/components/cart/CartDrawer';
import Reveal from '@/components/ui/Reveal';

export const metadata = {
  title: 'Lookbook',
  description:
    'A visual journey through the Delphine Mediterranean Summer ’26 collection — captured in light and motion.',
};

export default function LookbookPage() {
  return (
    <>
      <Announcement />
      <Nav />
      <main>
        <PageHero
          eyebrow={
            <>
              The Edit <span className="dot"></span> In Motion
            </>
          }
          title={
            <>
              The <em>Lookbook</em>
            </>
          }
          description="A series of moments captured in Mediterranean light — the spirit of Summer ’26 in motion."
        />

        <div className="lb-page">
          <Reveal>
            <div className="lb-stack">
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/lookbook/lb-1.jpg" alt="Look 01" />
                <p className="cap">
                  Look 01 <span className="diamond"></span> <em>Vermilion One Piece</em>
                </p>
              </div>
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/products/p3.jpg" alt="Look 02" />
                <p className="cap">
                  Look 02 <span className="diamond"></span> <em>Sun-Kissed One Piece</em>
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="lb-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/editorial/editorial-1.jpg" alt="Mediterranean light" />
            </div>
          </Reveal>

          <Reveal>
            <div className="lb-stack">
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/products/p1.jpg" alt="Look 03" />
                <p className="cap">
                  Look 03 <span className="diamond"></span> <em>Cherry Tomatoes</em>
                </p>
              </div>
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/products/p2.jpg" alt="Look 04" />
                <p className="cap">
                  Look 04 <span className="diamond"></span> <em>Little Boy Laces</em>
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="lb-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/lookbook/lb-2.jpg" alt="Off the coast" />
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
