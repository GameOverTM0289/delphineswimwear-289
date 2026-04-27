import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';

export default function LookbookGrid() {
  return (
    <section className="lookbook">
      <Reveal>
        <div className="lb-head">
          <h2>
            The <em>Lookbook</em>
          </h2>
          <p className="lb-tag">
            A visual journey through the
            <br />
            Mediterranean Summer &rsquo;26 collection.
          </p>
        </div>
      </Reveal>
      <Reveal>
        <div className="lb-grid">
          <Link href="/lookbook" className="lb-a" aria-label="Open the lookbook">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/lookbook/lb-1.jpg" alt="Look 01" />
          </Link>
          <Link href="/lookbook" className="lb-b" aria-label="Open the lookbook">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/products/p3.jpg" alt="Look 02" />
          </Link>
          <Link href="/lookbook" className="lb-c" aria-label="Open the lookbook">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/products/p1.jpg" alt="Look 03" />
          </Link>
          <Link href="/lookbook" className="lb-d" aria-label="Open the lookbook">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/lookbook/lb-2.jpg" alt="Look 04" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
