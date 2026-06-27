import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import ExploreMenu from "@/components/layout/ExploreMenu";

export default function PrivacyPolicy() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-white">
            <Navbar />

            <div className="w-full border-b border-gray-200">
                <div className="w-full px-6 md:px-10 py-6 text-[15px] font-Inter text-[#6a6a6a] uppercase tracking-widest">
                    EXPLOREAZĂ // DESPRE NOI // POLITICA DE CONFIDENȚIALITATE
                </div>
            </div>

            <main className="flex flex-col md:flex-row w-full flex-1">
                <div className="w-full md:w-[320px] lg:w-[350px] shrink-0 bg-[#f0f4f8]">
                    <ExploreMenu />
                </div>

                <section id="privacy-policy" className="flex-1 w-full pb-20 pt-8 md:pt-12 px-6 md:px-12 lg:px-20 xl:px-32">
                    <h1 className="text-3xl md:text-4xl font-Inter text-black mb-10">
                        Politica de Confidențialitate
                    </h1>

                    <div className="w-full text-[15px] font-Inter leading-relaxed text-[#6a6a6a] space-y-6 max-w-5xl">
                        <div>
                            <p>La Beast Locker, confidentialitatea si protectia datelor personale reprezinta o prioritate.</p>
                            <p className="mt-4">Aceasta Politica de Confidentialitate explica modul in care colectam, utilizam, stocam si protejam datele personale ale utilizatorilor care interactioneaza cu website-ul nostru, cu paginile noastre de social media, cu campaniile sau cu serviciile oferite de Beast Locker.</p>
                            <p className="mt-4">Prezenta politica este realizata in conformitate cu Regulamentul (UE) 2016/679 privind protectia datelor cu caracter personal (“GDPR”), precum si cu legislatia aplicabila din Romania.</p>
                            <p className="mt-4">Prin utilizarea website-ului nostru, sunteti de acord cu termenii prezentei Politici de Confidentialitate.</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                DESPRE BEAST LOCKER
                            </h2>
                            <p className="mt-2">Beast Locker este un brand dedicat culturii sporturilor de contact, performantei si disciplinei, avand ca activitate comercializarea de echipamente sportive, apparel si accesorii.</p>
                            <p className="mt-4">Operatorul datelor cu caracter personal este:</p>
                            <ul className="mt-2 list-none pl-0 space-y-1">
                                <li>Denumire firma: BEAST LOCKER S.R.L.</li>
                                <li>CUI: 54859107</li>
                                <li>Nr. Registrul Comertului: J2026037508007</li>
                                <li>Sediu social: Aleea Muzicii 5-8 Bl. RO5-RO6 Sc. RO5 Et. 12 Ap. 6, Ramnicu Valcea</li>
                                <li>Email: thebeastlocker@gmail.com</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                ANGAJAMENTUL NOSTRU
                            </h2>
                            <p className="mt-2">Ne angajam sa prelucram datele personale intr-un mod legal, corect si transparent.</p>
                            <p className="mt-4">Colectam si utilizam datele personale doar atunci cand este necesar pentru:</p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>procesarea si livrarea comenzilor;</li>
                                <li>oferirea serviciilor de suport clienti;</li>
                                <li>imbunatatirea experientei utilizatorilor pe website;</li>
                                <li>transmiterea de informatii comerciale si promotionale;</li>
                                <li>administrarea campaniilor, giveaway-urilor sau evenimentelor;</li>
                                <li>prevenirea fraudelor si protejarea platformei;</li>
                                <li>respectarea obligatiilor legale si fiscale.</li>
                            </ul>
                            <p className="mt-4">Nu vindem si nu cedam datele personale catre terti in scop comercial.</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                CE DATE PERSONALE COLECTAM
                            </h2>
                            <p className="mt-2">Putem colecta urmatoarele categorii de date personale:</p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>Date de identificare, precum nume, prenume, username sau denumirea companiei.</li>
                                <li>Date de contact, precum adresa de email, numar de telefon, adresa de facturare si adresa de livrare.</li>
                                <li>Date privind comenzile si tranzactiile, precum produsele comandate, valoarea comenzilor, statusul comenzilor, metodele de plata si livrare.</li>
                                <li>Date tehnice, precum adresa IP, browser-ul utilizat, tipul dispozitivului, sistemul de operare, fusul orar si interactiunile cu website-ul.</li>
                                <li>Date privind utilizarea website-ului, inclusiv paginile accesate, timpul petrecut pe website, preferintele utilizatorului si interactiunile cu continutul nostru.</li>
                                <li>Date privind marketingul si comunicarea, precum preferintele pentru newslettere, reclame sau comunicari comerciale.</li>
                            </ul>
                            <p className="mt-4">Datele bancare sau ale cardurilor nu sunt stocate de Beast Locker. Platile sunt procesate prin furnizori externi securizati.</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                CUM COLECTAM DATELE
                            </h2>
                            <p className="mt-2">Datele personale pot fi colectate:</p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>atunci cand plasati o comanda;</li>
                                <li>atunci cand creati un cont;</li>
                                <li>atunci cand va abonati la newsletter;</li>
                                <li>atunci cand ne contactati;</li>
                                <li>atunci cand participati la concursuri, campanii sau evenimente;</li>
                                <li>atunci cand interactionati cu website-ul sau cu paginile noastre de social media.</li>
                            </ul>
                            <p className="mt-4">Anumite date tehnice sunt colectate automat prin cookies, analytics si tehnologii similare.</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                TEMEIUL LEGAL AL PRELUCRARII
                            </h2>
                            <p className="mt-2">Prelucrarea datelor personale se realizeaza in baza:</p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>executarii contractului dintre dumneavoastra si Beast Locker;</li>
                                <li>consimtamantului exprimat;</li>
                                <li>obligatiilor legale aplicabile;</li>
                                <li>interesului legitim al Beast Locker privind securitatea, dezvoltarea si administrarea activitatii.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                CUM UTILIZAM DATELE
                            </h2>
                            <p className="mt-2">Datele colectate pot fi utilizate pentru:</p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>procesarea comenzilor;</li>
                                <li>livrarea produselor;</li>
                                <li>emiterea facturilor;</li>
                                <li>comunicarea cu clientii;</li>
                                <li>solutionarea solicitarilor si reclamatiilor;</li>
                                <li>personalizarea experientei pe website;</li>
                                <li>transmiterea de comunicari comerciale;</li>
                                <li>analiza traficului si imbunatatirea serviciilor;</li>
                                <li>detectarea si prevenirea fraudelor;</li>
                                <li>respectarea obligatiilor legale.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                MARKETING, RECLAME SI COOKIES
                            </h2>
                            <p className="mt-2">Beast Locker poate transmite newslettere, oferte sau alte comunicari comerciale doar in masura in care utilizatorul si-a exprimat acordul.</p>
                            <p className="mt-4">Utilizatorii se pot dezabona oricand utilizand optiunea “unsubscribe” din email sau contactandu-ne direct.</p>
                            <p className="mt-4">Website-ul poate utiliza cookies si tehnologii similare pentru:</p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>functionarea corecta a platformei;</li>
                                <li>analiza traficului;</li>
                                <li>personalizarea continutului si reclamelor;</li>
                                <li>imbunatatirea experientei utilizatorilor.</li>
                            </ul>
                            <p className="mt-4">Utilizatorii isi pot modifica preferintele privind cookies din browser-ul utilizat.</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                CU CINE PARTAJAM DATELE
                            </h2>
                            <p className="mt-2">Datele personale pot fi partajate doar cu parteneri si furnizori necesari functionarii activitatii Beast Locker, precum:</p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>procesatori de plati;</li>
                                <li>firme de curierat;</li>
                                <li>platforme ecommerce;</li>
                                <li>furnizori IT si hosting;</li>
                                <li>servicii de marketing si analiza;</li>
                                <li>autoritati publice, daca legea impune acest lucru.</li>
                            </ul>
                            <p className="mt-4">Toate partile terte implicate au obligatia de a proteja datele personale conform legislatiei aplicabile.</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                TRANSFERUL DATELOR
                            </h2>
                            <p className="mt-2">In anumite situatii, datele personale pot fi transferate catre furnizori sau parteneri din afara Uniunii Europene.</p>
                            <p className="mt-4">In aceste cazuri, Beast Locker va adopta masuri adecvate pentru protejarea datelor, conform cerintelor GDPR.</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                CAT TIMP PASTRAM DATELE
                            </h2>
                            <p className="mt-2">Datele personale sunt pastrate doar pe perioada necesara indeplinirii scopurilor pentru care au fost colectate, precum si pentru respectarea obligatiilor legale, fiscale sau contabile.</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                DREPTURILE UTILIZATORILOR
                            </h2>
                            <p className="mt-2">Conform GDPR, utilizatorii beneficiaza de urmatoarele drepturi:</p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>dreptul de acces la date;</li>
                                <li>dreptul la rectificare;</li>
                                <li>dreptul la stergerea datelor;</li>
                                <li>dreptul la restrictionarea prelucrarii;</li>
                                <li>dreptul la opozitie;</li>
                                <li>dreptul la portabilitatea datelor;</li>
                                <li>dreptul de retragere a consimtamantului;</li>
                                <li>dreptul de a depune o plangere la ANSPDCP.</li>
                            </ul>
                            <p className="mt-4">Solicitarile privind datele personale pot fi trimise la thebeastlocker@gmail.com</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                SECURITATEA DATELOR
                            </h2>
                            <p className="mt-2">Beast Locker utilizeaza masuri tehnice si organizationale rezonabile pentru protejarea datelor personale impotriva accesului neautorizat, utilizarii abuzive, pierderii, distrugerii sau divulgarii.</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                MODIFICARI ALE POLITICII
                            </h2>
                            <p className="mt-2">Beast Locker isi rezerva dreptul de a modifica prezenta Politica de Confidentialitate. Orice modificare va fi publicata pe website.</p>
                        </div>

                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}