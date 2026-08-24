import { IconBag, IconCup, IconSearch } from "./icons";
import { Steam } from "./ui";

export default function Header({
  cartCount,
  onCartOpen,
  onSearchClick,
}: {
  cartCount: number;
  onCartOpen: () => void;
  onSearchClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-cream-100/8 bg-espresso-950/85 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between gap-4 md:h-[74px]">
        {/* wordmark */}
        <a href="#top" className="group flex items-center gap-3">
          <span className="relative grid h-10 w-10 place-items-center rounded-full border border-caramel-500/40 bg-espresso-850 text-caramel-400 transition-colors group-hover:border-caramel-500">
            <IconCup className="h-5 w-5" />
            <Steam className="left-1/2 top-0.5 -translate-x-1/2 scale-[0.6]" />
          </span>
          <span className="leading-none">
            <span className="font-display text-[22px] font-semibold tracking-[0.08em] text-cream-50">
              CINDER
            </span>
            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.42em] text-cream-500">
              Coffee Roasters
            </span>
          </span>
        </a>

        {/* nav */}
        <nav className="hidden items-center gap-7 text-sm font-bold text-cream-300 md:flex">
          <a href="#shelf" className="transition-colors hover:text-caramel-300">
            The Shelf
          </a>
          <a href="#hero" className="transition-colors hover:text-caramel-300">
            Roast of the Week
          </a>
          <a href="#visit" className="transition-colors hover:text-caramel-300">
            Visit
          </a>
        </nav>

        {/* actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onSearchClick}
            aria-label="Search coffees"
            className="btn-press hidden h-10 w-10 place-items-center rounded-full border border-cream-100/15 text-cream-300 transition-colors hover:border-caramel-500/60 hover:text-caramel-300 sm:grid"
          >
            <IconSearch className="h-[17px] w-[17px]" />
          </button>
          <button
            type="button"
            onClick={onCartOpen}
            className="btn-press relative flex h-10 items-center gap-2 rounded-full bg-caramel-500 pl-4 pr-4.5 text-sm font-extrabold text-espresso-950 transition-colors hover:bg-caramel-400"
          >
            <IconBag className="h-[17px] w-[17px]" strokeWidth={2} />
            Bag
            {cartCount > 0 && (
              <span
                key={cartCount}
                className="anim-pop absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-cherry-500 px-1 text-[11px] font-extrabold text-cream-50"
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
