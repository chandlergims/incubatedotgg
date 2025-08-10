'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="px-4 py-8 max-w-4xl">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using receipts.fun (the "Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p>
                receipts.fun is a decentralized token launch platform that enables users to create, trade, and manage cryptocurrency tokens on the Solana blockchain. The platform utilizes bonding curve mechanisms and integrates with Meteora for enhanced liquidity provision.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>You are responsible for maintaining the confidentiality of your wallet and private keys</li>
                <li>You agree to use the platform only for lawful purposes</li>
                <li>You will not engage in any activity that disrupts or interferes with the platform</li>
                <li>You understand that cryptocurrency trading involves significant risk</li>
                <li>You are solely responsible for any taxes or fees related to your transactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Risks and Disclaimers</h2>
              <p className="mb-4">
                <strong>High Risk Warning:</strong> Trading cryptocurrencies and using DeFi platforms involves substantial risk of loss. You should carefully consider whether such trading is suitable for you in light of your financial condition.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Token values can fluctuate dramatically and may become worthless</li>
                <li>Smart contracts may contain bugs or vulnerabilities</li>
                <li>Blockchain transactions are irreversible</li>
                <li>Regulatory changes may affect platform availability</li>
                <li>Network congestion may cause delays or failed transactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Platform Fees</h2>
              <p>
                The platform charges a 2% trading fee on transactions after token migration to Meteora. Creators may receive up to 90% of these trading fees, with the remainder going to platform operations and development.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
              <p>
                The platform and its original content, features, and functionality are owned by receipts.fun and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p>
                In no event shall receipts.fun, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, punitive, consequential, or special damages arising from your use of the platform, even if we have been advised of the possibility of such damages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless receipts.fun and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Termination</h2>
              <p>
                We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Governing Law</h2>
              <p>
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which the platform operates, without regard to conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us through our official communication channels.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
