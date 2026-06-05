import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="bg-slate-50 dark:bg-[#0d1424] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl px-8 py-12 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full" />

          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to get your first number?
            </h2>
            <p className="text-green-100 text-base mb-7 max-w-xl mx-auto">
              Join thousands of Nigerians who already use Temp Number to
              verify their accounts without exposing their personal numbers.
            </p>
            <div className="flex justify-center">
              <Link
                href="/dashboard"
                className="bg-white text-green-600 font-semibold px-8 py-3 rounded-xl text-sm hover:bg-green-50 transition-colors"
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
