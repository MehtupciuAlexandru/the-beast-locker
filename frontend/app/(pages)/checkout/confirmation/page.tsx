import Link from "next/link";

export default function CheckoutConfirmationPage() {
    return (
        <section className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-5 font-Inter">
            <div className="bg-white border border-[#d8d8d8] max-w-md w-full p-8 text-center">
                <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400 mb-3">
                    Checkout
                </p>

                <h1 className="text-lg font-Inter18Semibold text-[#1c1c1e] mb-4">
                    Plata a fost procesată
                </h1>

                <p className="text-xs text-neutral-500 leading-relaxed mb-7">
                    Comanda ta a fost înregistrată cu succes. Poți verifica detaliile acesteia în profilul tău.
                </p>

                <Link
                    href="/account"
                    className="inline-flex h-[44px] items-center justify-center bg-black px-7 text-[11px] font-Inter18Semibold uppercase tracking-[0.12em] text-white hover:bg-[#1c1c1e] transition-colors"
                >
                    Mergi la profil
                </Link>
            </div>
        </section>
    );
}