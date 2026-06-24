import { motion } from 'framer-motion'
import { NETWORKS } from '../config/chains'
import type { NetworkKey } from '../config/chains'

interface DocsProps { network: NetworkKey }

export default function Docs({ network }: DocsProps) {
  const net = NETWORKS[network]

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      content: `SourceCheck is a decentralized URL credibility oracle built on GenLayer.
      Anyone can submit a source URL and a claim. Multiple GenLayer validators independently
      fetch the URL, read the content, and use AI-powered consensus to reach a verdict:
      SUPPORTED, DISPUTED, or UNVERIFIABLE. The result is stored permanently onchain.`,
    },
    {
      id: 'how',
      title: 'How It Works',
      steps: [
        { n: '01', title: 'Submit', desc: 'User submits a URL and a claim via the frontend. A write transaction is sent to the SourceChecker contract.' },
        { n: '02', title: 'Leader fetches', desc: 'The leader validator fetches the URL content and runs an LLM prompt to determine if the content supports the claim.' },
        { n: '03', title: 'Validators verify', desc: 'Other validators independently re-run the same task and compare verdict labels. Consensus is required to accept the result.' },
        { n: '04', title: 'Verdict stored', desc: 'The agreed verdict (SUPPORTED / DISPUTED / UNVERIFIABLE) is written to contract storage along with a one-sentence summary.' },
      ],
    },
    {
      id: 'contracts',
      title: 'Smart Contracts',
      contracts: Object.keys(NETWORKS) as NetworkKey[],
    },
    {
      id: 'verdicts',
      title: 'Verdict Meanings',
      verdicts: [
        { label: 'SUPPORTED', color: 'text-green-700 bg-green-50 border-green-200', desc: 'The page content clearly and directly supports the submitted claim.' },
        { label: 'DISPUTED', color: 'text-red-700 bg-red-50 border-red-200', desc: 'The page content contradicts or does not support the claim.' },
        { label: 'UNVERIFIABLE', color: 'text-yellow-700 bg-yellow-50 border-yellow-200', desc: 'The URL could not be fetched, is paywalled, or the claim cannot be judged from this source.' },
      ],
    },
    {
      id: 'faq',
      title: 'FAQ',
      faqs: [
        { q: 'Do I need to pay?', a: 'You need a small amount of GEN tokens to cover gas on GenLayer testnet. Get them from the GenLayer faucet.' },
        { q: 'Can validators be wrong?', a: 'Validators require majority consensus. A single malicious or incorrect node cannot affect the verdict.' },
        { q: 'Is this permanent?', a: 'Verdicts on Bradbury testnet are persistent. StudioNet may reset periodically.' },
        { q: 'What URLs can I check?', a: 'Any publicly accessible URL. Paywalled, login-required, or blocked pages will return UNVERIFIABLE.' },
      ],
    },
  ]

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="font-display text-4xl font-extrabold text-purple-950 mb-3">
            Documentation
          </h1>
          <p className="text-purple-600/70 text-sm">
            Everything you need to understand and use SourceCheck.
          </p>
        </motion.div>

        <div className="space-y-10">
          {sections.map((s, i) => (
            <motion.section
              key={s.id}
              id={s.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="card-glass rounded-3xl p-8"
            >
              <h2 className="font-display text-xl font-bold text-purple-950 mb-4">{s.title}</h2>

              {'content' in s && (
                <p className="text-sm text-purple-700/80 leading-relaxed">{s.content}</p>
              )}

              {'steps' in s && (
                <div className="space-y-4">
                  {s.steps!.map(step => (
                    <div key={step.n} className="flex gap-4">
                      <div className="w-10 h-10 rounded-2xl shimmer-btn flex items-center justify-center shrink-0 text-white text-xs font-bold">
                        {step.n}
                      </div>
                      <div>
                        <p className="font-semibold text-purple-900 text-sm mb-0.5">{step.title}</p>
                        <p className="text-xs text-purple-600/70 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {'contracts' in s && (
                <div className="space-y-3">
                  {s.contracts!.map(key => {
                    const n = NETWORKS[key]
                    return (
                      <div key={key} className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-purple-700 uppercase tracking-widest">{n.name}</span>
                          <a
                            href={`${n.explorerUrl}/tx/${n.deployTx}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-purple-500 hover:text-purple-700 underline"
                          >
                            View deploy tx →
                          </a>
                        </div>
                        <code className="text-xs font-mono text-purple-800 break-all">{n.contractAddress}</code>
                      </div>
                    )
                  })}
                </div>
              )}

              {'verdicts' in s && (
                <div className="space-y-3">
                  {s.verdicts!.map(v => (
                    <div key={v.label} className={`rounded-2xl p-4 border ${v.color}`}>
                      <span className="text-xs font-bold tracking-widest block mb-1">{v.label}</span>
                      <p className="text-xs leading-relaxed opacity-80">{v.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {'faqs' in s && (
                <div className="space-y-4">
                  {s.faqs!.map(f => (
                    <div key={f.q}>
                      <p className="text-sm font-semibold text-purple-900 mb-1">{f.q}</p>
                      <p className="text-xs text-purple-600/70 leading-relaxed">{f.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  )
}
