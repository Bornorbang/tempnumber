import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-page)]">
      <Navbar />
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Contact Us
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-base">
            Have a question or need help? We&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <a
            href="mailto:support@tempnumber.ng"
            className="flex items-center gap-4 p-5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl hover:border-green-500/40 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-900 dark:text-white font-semibold text-sm">Email Support</p>
              <p className="text-slate-500 dark:text-gray-400 text-xs mt-0.5">support@tempnumber.ng</p>
            </div>
          </a>

          <a
            href="https://wa.me/2348000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl hover:border-green-500/40 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-900 dark:text-white font-semibold text-sm">WhatsApp</p>
              <p className="text-slate-500 dark:text-gray-400 text-xs mt-0.5">Chat with us directly</p>
            </div>
          </a>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl p-6">
          <h2 className="text-slate-900 dark:text-white font-semibold text-base mb-5">Send a Message</h2>
          <form
            action="mailto:support@tempnumber.ng"
            method="get"
            encType="text/plain"
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 dark:text-gray-400 text-xs font-medium mb-1.5">Your Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  className="w-full bg-slate-100 dark:bg-[#1a2235] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500/50 transition-colors placeholder:text-slate-400 dark:placeholder:text-gray-600"
                />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-gray-400 text-xs font-medium mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="w-full bg-slate-100 dark:bg-[#1a2235] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500/50 transition-colors placeholder:text-slate-400 dark:placeholder:text-gray-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-500 dark:text-gray-400 text-xs font-medium mb-1.5">Subject</label>
              <input
                type="text"
                name="subject"
                required
                placeholder="How can we help?"
                className="w-full bg-slate-100 dark:bg-[#1a2235] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500/50 transition-colors placeholder:text-slate-400 dark:placeholder:text-gray-600"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-gray-400 text-xs font-medium mb-1.5">Message</label>
              <textarea
                name="body"
                required
                rows={5}
                placeholder="Describe your issue or question..."
                className="w-full bg-slate-100 dark:bg-[#1a2235] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500/50 transition-colors resize-none placeholder:text-slate-400 dark:placeholder:text-gray-600"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-400 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
}
