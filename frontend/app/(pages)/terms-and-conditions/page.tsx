import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import ExploreMenu from "@/components/layout/ExploreMenu";

export default function TermsAndConditions() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-white">
            <Navbar />

            <div className="w-full border-b border-gray-200">
                <div className="w-full px-6 md:px-10 py-6 text-[15px] font-Inter text-[#6a6a6a] uppercase tracking-widest">
                    EXPLOREAZĂ // DESPRE NOI // TERMENI ȘI CONDIȚII
                </div>
            </div>

            <main className="flex flex-col md:flex-row w-full flex-1">
                <div className="w-full md:w-[320px] lg:w-[350px] shrink-0 bg-[#f0f4f8]">
                    <ExploreMenu />
                </div>

                <section id="terms-and-conditions" className="flex-1 w-full pb-20 pt-8 md:pt-12 px-6 md:px-12 lg:px-20 xl:px-32">
                    <h1 className="text-3xl md:text-4xl font-Inter text-black mb-10">
                        Termeni și Condiții
                    </h1>

                    <div className="w-full text-[15px] font-Inter leading-relaxed text-[#6a6a6a] space-y-6 max-w-5xl">
                        <div>
                            <p className="font-bold text-[#1c1c1E]">Ultima actualizare: / /2026</p>
                            <p className="mt-4">Prezentele Termeni si Conditii reglementeaza utilizarea website-ului Beast Locker, precum si relatia contractuala dintre Beast Locker si orice persoana care acceseaza website-ul, plaseaza o comanda sau utilizeaza serviciile oferite prin intermediul acestuia.</p>
                            <p className="mt-4">Prin accesarea si utilizarea website-ului, utilizatorul confirma faptul ca a citit, inteles si acceptat integral prezentele Termeni si Conditii.</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                1. INFORMATII DESPRE COMERCIAN
                            </h2>
                            <p className="mt-2">Website-ul www._____.ro este administrat de:</p>
                            <ul className="mt-2 list-none pl-0 space-y-1">
                                <li>Denumire societate: _____ CUI: _____ Nr. Registrul Comertului: _____ Sediu social: _____ Email: _____ Telefon: _____</li>
                            </ul>
                            <p className="mt-4">In cuprinsul prezentului document, societatea va fi denumita “Beast Locker”.</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                2. DEFINITII
                            </h2>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>“Website” reprezinta platforma online apartinand Beast Locker.</li>
                                <li>“Utilizator” reprezinta orice persoana care acceseaza website-ul.</li>
                                <li>“Client” reprezinta orice persoana fizica sau juridica ce plaseaza o comanda.</li>
                                <li>“Produse” reprezinta orice bunuri comercializate prin intermediul website-ului.</li>
                                <li>“Comanda” reprezinta solicitarea transmisa de Client pentru achizitionarea unor produse.</li>
                                <li>“Contract” reprezinta contractul la distanta incheiat intre Beast Locker si Client, fara prezenta fizica simultana a partilor.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                3. ACCEPTAREA TERMENILOR
                            </h2>
                            <p className="mt-2">Accesarea website-ului, crearea unui cont sau plasarea unei comenzi implica acceptarea neconditionata a prezentelor Termeni si Conditii.</p>
                            <p className="mt-4">Beast Locker isi rezerva dreptul de a modifica continutul prezentului document in orice moment, fara notificare prealabila.</p>
                            <p className="mt-4">Versiunea actualizata va fi publicata pe website si va produce efecte de la data publicarii.</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                4. PRODUSE SI DISPONIBILITATE
                            </h2>
                            <p className="mt-2">Beast Locker depune toate eforturile pentru ca informatiile si imaginile produselor prezentate pe website sa fie corecte si actualizate. Cu toate acestea:</p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>anumite caracteristici pot diferi usor fata de imaginile de prezentare;</li>
                                <li>culorile produselor pot varia in functie de dispozitivul utilizat;</li>
                                <li>disponibilitatea produselor poate varia fara notificare prealabila.</li>
                            </ul>
                            <p className="mt-4">Beast Locker isi rezerva dreptul de a modifica oricand preturile, descrierile sau disponibilitatea produselor.</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                5. PRETURI SI PLATI
                            </h2>
                            <p className="mt-2">Toate preturile afisate pe website sunt exprimate in RON si includ TVA, conform legislatiei aplicabile, daca nu este mentionat altfel.</p>
                            <p className="mt-4">Costurile de livrare sunt afisate separat in procesul de finalizare a comenzii.</p>
                            <p className="mt-4">Plata produselor se poate realiza prin:</p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>card bancar;</li>
                                <li>transfer bancar;</li>
                                <li>ramburs;</li>
                                <li>alte metode afisate pe website.</li>
                            </ul>
                            <p className="mt-4">Beast Locker isi rezerva dreptul de a anula comenzile considerate suspecte, incomplete sau frauduloase.</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                6. PLASAREA COMENZILOR
                            </h2>
                            <p className="mt-2">Prin finalizarea unei comenzi, Clientul confirma ca:</p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>toate datele furnizate sunt reale si corecte;</li>
                                <li>are capacitatea legala de a incheia contracte;</li>
                                <li>accepta termenii si conditiile website-ului.</li>
                            </ul>
                            <p className="mt-4">Transmiterea unei comenzi nu garanteaza automat acceptarea acesteia. Contractul se considera incheiat doar dupa confirmarea expresa a comenzii de catre Beast Locker.</p>
                            <p className="mt-4">Beast Locker isi rezerva dreptul de a refuza sau anula comenzi in urmatoarele situatii:</p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>stoc indisponibil;</li>
                                <li>erori de pret sau descriere;</li>
                                <li>suspiciuni de frauda;</li>
                                <li>imposibilitatea procesarii platii;</li>
                                <li>comportament abuziv al Clientului.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                7. LIVRAREA
                            </h2>
                            <p className="mt-2">Livrarea produselor se realizeaza prin intermediul firmelor de curierat partenere.</p>
                            <p className="mt-4">Termenele de livrare sunt estimative si pot varia in functie de:</p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>disponibilitatea produselor;</li>
                                <li>perioade aglomerate;</li>
                                <li>factori externi independenti de Beast Locker.</li>
                            </ul>
                            <p className="mt-4">Beast Locker nu poate fi responsabil pentru intarzieri cauzate de firmele de curierat sau de situatii de forta majora. Riscul asupra produselor se transfera Clientului la momentul livrarii.</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                8. DREPTUL DE RETRAGERE
                            </h2>
                            <p className="mt-2">Conform OUG nr. 34/2014, Clientii persoane fizice beneficiaza de dreptul de retragere din contract in termen de 14 zile calendaristice de la primirea produselor.</p>
                            <p className="mt-4">Pentru exercitarea dreptului de retragere, Clientul trebuie sa notifice Beast Locker la: @</p>
                            <p className="mt-4">Produsele returnate trebuie:</p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>sa fie in aceeasi stare;</li>
                                <li>sa nu prezinte urme de utilizare;</li>
                                <li>sa fie returnate cu etichetele si ambalajele originale.</li>
                            </ul>
                            <p className="mt-4">Beast Locker isi rezerva dreptul de a refuza retururile care nu respecta conditiile mentionate. Costurile de retur sunt suportate de Client, daca nu este specificat altfel. Rambursarea sumelor se va efectua in termenul prevazut de lege.</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                9. GARANTII
                            </h2>
                            <p className="mt-2">Produsele comercializate beneficiaza de garantia legala de conformitate conform legislatiei aplicabile din Romania.</p>
                            <p className="mt-4">Clientii au obligatia de a verifica produsele la momentul receptionarii si de a semnala eventualele probleme intr-un termen rezonabil.</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                10. PROPRIETATE INTELECTUALA
                            </h2>
                            <p className="mt-2">Toate materialele prezente pe website, inclusiv:</p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>logo-uri;</li>
                                <li>design-uri;</li>
                                <li>texte;</li>
                                <li>imagini;</li>
                                <li>videoclipuri;</li>
                                <li>grafica;</li>
                                <li>elemente vizuale;</li>
                                <li>denumiri comerciale;</li>
                            </ul>
                            <p className="mt-4">reprezinta proprietatea Beast Locker sau a partenerilor sai si sunt protejate de legislatia privind drepturile de autor si proprietatea intelectuala.</p>
                            <p className="mt-4">Este interzisa copierea, distribuirea, modificarea sau utilizarea continutului fara acordul scris al Beast Locker.</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                11. LIMITAREA RASPUNDERII
                            </h2>
                            <p className="mt-2">Beast Locker nu poate fi responsabil pentru:</p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>erori tehnice ale website-ului;</li>
                                <li>intreruperi temporare;</li>
                                <li>pierderi indirecte;</li>
                                <li>utilizarea necorespunzatoare a produselor;</li>
                                <li>incompatibilitati tehnice;</li>
                                <li>actiuni ale tertilor.</li>
                            </ul>
                            <p className="mt-4">Utilizarea website-ului se face pe propria raspundere a utilizatorului.</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                12. FORTA MAJORA
                            </h2>
                            <p className="mt-2">Beast Locker nu raspunde pentru neexecutarea obligatiilor contractuale cauzata de evenimente de forta majora, inclusiv:</p>
                            <ul className="mt-2 list-disc space-y-1 pl-6">
                                <li>razboi;</li>
                                <li>incendii;</li>
                                <li>inundatii;</li>
                                <li>pandemii;</li>
                                <li>defectiuni tehnice;</li>
                                <li>blocaje logistice;</li>
                                <li>acte ale autoritatilor.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                13. PROTECTIA DATELOR
                            </h2>
                            <p className="mt-2">Prelucrarea datelor personale se realizeaza conform Politicii de Confidentialitate disponibile pe website.</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                14. LEGEA APLICABILA
                            </h2>
                            <p className="mt-2">Prezentele Termeni si Conditii sunt guvernate de legislatia romana.</p>
                            <p className="mt-4">Eventualele litigii vor fi solutionate pe cale amiabila, iar in cazul imposibilitatii solutionarii amiabile, competenta revine instantelor judecatoresti din Romania.</p>
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1c1c1E] pt-4 text-base uppercase tracking-wider">
                                15. CONTACT
                            </h2>
                            <p className="mt-2">Pentru orice informatii sau solicitari:</p>
                            <ul className="mt-2 list-none pl-0 space-y-1">
                                <li>BEAST LOCKER Email: _____ Telefon: _____ Adresa: _____</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}