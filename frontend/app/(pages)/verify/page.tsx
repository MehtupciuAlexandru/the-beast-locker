"use client";

import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/footer";
import VerifyContent from "./verify-content";

export default function VerifyPage() {
    return (
        <>
            <Navbar />

            <Suspense fallback={<p className="text-center mt-20">Se verifică...</p>}>
                <VerifyContent />
            </Suspense>

            <Footer />
        </>
    );
}