import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="relative isolate min-h-[80vh] overflow-hidden bg-white dark:bg-[rgb(9_17_33)]">
      <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden="true" />
      <Container>
        <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
          <p className="font-display text-[10rem] font-extrabold leading-none text-brand/15 dark:text-accent/20 sm:text-[14rem]">
            404
          </p>
          <h1 className="-mt-6 max-w-xl font-display text-3xl font-extrabold tracking-tight text-ink dark:text-white sm:text-4xl">
            We searched everywhere. This opportunity doesn’t exist.
          </h1>
          <p className="mt-3 max-w-md text-sm text-ink-mute dark:text-slate-400">
            It may have expired, been taken down, or the link is incorrect. Head back to the homepage to find what you need.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/" variant="primary" size="lg">Back to homepage</Button>
            <Button href="/opportunities" variant="outline" size="lg">Browse all opportunities</Button>
          </div>
          <div className="mt-12 text-xs text-ink-mute dark:text-slate-500">
            Still stuck? <Link href="/contact" className="text-brand link-underline dark:text-accent">Tell us what you were looking for</Link>.
          </div>
        </div>
      </Container>
    </div>
  );
}
