/**
 * Everyday words visitors use, mapped onto the chunks that answer them.
 * Keys are chunk-id prefixes (see knowledge.ts): `project:<slug>`,
 * `blog:<slug>`, `cv:<section>`, `about:<section>`. Every chunk whose id
 * starts with a key gets that key's terms added to its searchable `aliases`.
 *
 * Tune here when the retrieval eval misses — never by editing content.
 */
export const ALIASES: Record<string, string> = {
  // ── Projects ──
  'project:wednesday':
    'wednesday grocery groceries supermarket half price halfprice coles woolworths specials ios iphone app store prediction forecast predictor accuracy',
  'project:multi-agent-laravel-migrator':
    'mikhai migrator migration copilot php laravel legacy langgraph agents multi agent pipeline codegen named after',
  'project:pretriage':
    'pretriage triage patient patients clinic clinician doctor medical health healthcare intake voice elevenlabs',
  'project:niks-automotive':
    'niks nik automotive mechanic car booking bookings invoice invoicing client',
  'project:locker-iq':
    'lockeriq locker lockers bpo attendance device qr phone tracking django',
  'project:oneec':
    'cooppay coop electric cooperative bill payment payments philippines mobile react native',
  'project:proposal-ai':
    'proposalai proposal proposals generator generation agent langchain openai',
  'project:trust-ledger':
    'trustledger trust fund ledger laravel vue modernisation migration power bi',

  // ── Blog ──
  'blog:': 'blog post posts article articles writing wrote written read',
  'blog:shipping-wednesday': 'wednesday launch shipped shipping lessons learned app store',
  'blog:groq-vs-openai-pretriage': 'groq openai switch switched latency pretriage speed cost provider',
  'blog:llm-codegen-migration-pipeline': 'codegen code generation llm free form templates migration pipeline laravel ripped',

  // ── CV ──
  'cv:header':
    'contact email phone linkedin github website location sydney bankstown',
  'cv:professional-summary':
    'summary about overview who is ernest background introduce yourself tell me about him',
  'cv:technical-skills':
    'skills stack tech technologies languages frameworks tools knows know python typescript react nextjs fastapi langgraph supabase docker aws',
  'cv:experience':
    'experience work job jobs employer worked company lightweight intern internship role career years professional',
  'cv:projects':
    'projects built portfolio sqrly pos point of sale saas multi tenant',
  'cv:education':
    'education study studied studying degree uni university masters master bachelor school college graduate graduating crown phinma',

  // ── About notes ──
  'about:who-ernest-is': 'who is ernest about him background',
  'about:experience':
    'experience years how long how many years professional senior junior',
  'about:what-hes-looking-for':
    'hire hiring available availability job role roles open to work looking for graduate junior full time freelance collab visa work rights',
  'about:this-website':
    'website site portfolio this site connect 4 connect four game minimax engine ai opponent system log terminal theme dark mode light mode chat mikhai how was this built',
  'about:contact': 'contact email reach get in touch linkedin github cv resume',
  'about:work-rights-location-and-relocation':
    'visa work rights relocate relocation remote hybrid location move',
}
