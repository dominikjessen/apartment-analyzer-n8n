import { ApartmentForm } from "./apartment-form";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="flex w-full min-h-dvh flex-1 flex-col items-center px-4 py-8 sm:px-6 sm:py-10">
        <ApartmentForm />
      </main>
    </div>
  );
}
