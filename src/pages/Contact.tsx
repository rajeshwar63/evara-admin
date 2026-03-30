export default function Contact() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-body">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading text-slate-900">
            Contact <span className="text-brand-500">Us</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            If you have questions about our Privacy Policy or your data, reach out to us.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Email</p>
                <a href="mailto:rajeshwar63@gmail.com" className="text-sm text-slate-700 hover:text-brand-500">
                  rajeshwar63@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">WhatsApp</p>
                <a href="https://wa.me/918309421405" className="text-sm text-slate-700 hover:text-brand-500">
                  +91 83094 21405
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Phone</p>
                <a href="tel:+919398574255" className="text-sm text-slate-700 hover:text-brand-500">
                  +91 93985 74255
                </a>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Address</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                Sipsea Beverages<br />
                3-69/44G, Singaipally, Hakimpet, NISA<br />
                Hyderabad, Telangana 500078, India
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">GSTIN</p>
              <p className="text-sm text-slate-700">36AFMFS5330L1ZJ</p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Evara App is a product of Sipsea Beverages
        </p>
      </div>
    </div>
  )
}
