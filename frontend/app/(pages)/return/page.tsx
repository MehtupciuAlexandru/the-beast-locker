import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import ExploreMenu from "@/components/layout/ExploreMenu";

export default function ReturnsPage() {
    return (
        <>
            <Navbar />

            <main className="w-full bg-white text-black min-h-screen flex flex-col">
                <div className="w-full border-b border-gray-200">
                    <div className="w-full px-6 md:px-10 py-6 text-xs sm:text-sm text-gray-500 uppercase tracking-widest">
                        EXPLOREAZĂ // DESPRE NOI // CUMPĂRARE / RETUR
                    </div>
                </div>

                <div className="flex flex-col md:flex-row w-full flex-1">

                    <div className="w-full md:w-[320px] lg:w-[350px] shrink-0 bg-[#f0f4f8]">
                        <ExploreMenu />
                    </div>

                    <div className="flex-1 w-full pb-20 pt-8 md:pt-12 px-6 md:px-12 lg:px-20 xl:px-32">
                        <h1 className="text-3xl md:text-4xl font-medium text-black mb-10">
                            Cumpărare / Retur
                        </h1>

                        <div className="w-full text-base md:text-lg leading-relaxed text-gray-800 space-y-6 max-w-5xl">
                            <p className="font-bold text-black">
                                Urmează modificări semnificative ale politicii de retur!
                            </p>

                            <p>
                                Începând cu 01.04.2025, poți efectua un retur în termen de 30 de zile de la livrarea coletului. Termenul limită se aplică atât retururilor online, cât și în magazin. Aceste modificări se datorează preocupării noastre pentru disponibilitatea produselor pentru clienții noștri. În plus, toate retururile online vor fi achitate. Amintește-ți că în magazine poți returna produsele gratuit - ca întotdeauna! Toate comenzile plasate înainte de 01.04.2025 sunt acoperite de politica de retur care a fost în vigoare până acum.
                            </p>

                            <p>
                                Odată ce comanda ajunge la tine, ai la dispoziție 30 de zile în care te poți decide dacă produsul este pe placul tău. În cazul în care în comanda ta există articole pe care dorești să le returnezi, te rugăm să faci o cerere de retur. Se va percepe o taxă de retur în valoare de 9,99 RON.
                            </p>

                            <p>
                                Important! Produsele returnate nu trebuie să prezinte indicii că au fost purtate și este necesar să aibă toate etichetele originale atașate.
                            </p>

                            <p>
                                Produsele din categoria lenjerie intimă achiziționate din magazinele fizice NU se returnează și NU se probează. Lenjeria intimă se returnează în magazinele fizice DOAR dacă a fost achiziționată din magazinul online și doar în termenul legal de 14 zile (de la data primirii coletului), fără a prezenta vreun motiv. Această categorie de produse se poate returna în magazine strict în condițiile legii (nu sunt conforme, defecte de fabricație, etc.)
                            </p>

                            <p className="font-bold text-black pt-4">
                                Retur prin curierul FAN
                            </p>

                            <p>
                                Pentru a returna produsele prin curier, urmează aceste instrucțiuni.
                            </p>

                            <p>
                                Completează formularul de retur online disponibil în contul tău de client, selectează data și locul de preluare a coletului și așteaptă curierul.
                            </p>

                            <p>
                                Pentru comenzile plasate începând cu data de 01.04.2025, se va percepe o taxă de retur în valoare de 9,99 RON. Taxa pentru acest tip de retur va fi dedusă automat din suma rambursată (vei vedea acest lucru în rezumatul costurilor de retur și în detaliile returului din contul dumneavoastră).
                            </p>

                            <p>
                                Împachetează produsele într-o cutie de carton (de preferință cea originală în care ai primit coletul) și atașează factura, pe care o găsești în panoul clientului accesând detaliile comenzii. În loc de factură, poți atașa o bucată de hârtie cu numărul de comandă notat de mână. Curierul va avea o etichetă cu adresa pregătită pentru a fi lipită pe colet. Dacă returnezi coletul în ambalajul nostru, nu uita să îndepărtezi vechea etichetă de adresă.
                            </p>

                            <p>
                                Ridică chitanța poștală de la curier și păstreaz-o până când returul tău a fost procesat. Acest document confirmă că ai predat coletul curierului.
                            </p>

                            <p>
                                Dacă ai plătit comanda prin PayU, PayPal, GooglePay, Apple Pay suma minus taxa de retur va fi rambursată în contul din care au fost plătite achizițiile. Dacă ai plătit comanda la livrare, pe formularul de retur va exista o opțiune pentru a completa numărul contului tău bancar pentru rambursare.
                            </p>

                            <p className="font-bold text-black pt-4">
                                Returul se face pe propria cheltuială
                            </p>

                            <p>
                                Puteti trimite coletul dumneavoastra, platind costul integral de transport, la urmatoarea adresa:
                            </p>

                            <div className="pt-2">
                                <p>Aleea Muzicii nr.1</p>
                                <p>Ramnicu Valcea</p>
                                <p>Valcea, Romania, 240086</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}