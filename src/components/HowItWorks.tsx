const STEPS = [
  {
    number: "01",
    title: "Fund Your Wallet",
    description: "Add money to your Temp Number wallet using your Nigerian bank account, USSD, or any local payment method.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Choose a Service",
    description: "Select the service you want to verify (WhatsApp, Telegram, Google, etc.) and get a real USA number instantly.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Receive Your SMS Code",
    description: "Your temporary number is activated instantly. The verification SMS appears on your screen within seconds.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-slate-50 dark:bg-[#0d1424] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            How It Works
          </h2>
          <p className="text-slate-500 dark:text-gray-400 text-sm">
            Get your verification code in 3 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />

          {STEPS.map((step, i) => (
            <div key={i} className="relative bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/10 text-green-500 dark:text-green-400 rounded-xl mb-4">
                {step.icon}
              </div>
              <div className="absolute top-4 right-4 text-slate-200 dark:text-white/5 font-black text-3xl select-none">
                {step.number}
              </div>
              <h3 className="text-slate-900 dark:text-white font-semibold text-base mb-2">{step.title}</h3>
              <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
