// Everything about site structure lives here.
// To add a page: create the .md file under src/pages/work/<project>/ and add it to `pages` below.

export const SITE = {
  name: 'Tee Lakkhananukun',
  fullName: 'Chatchawan (Tee) Lakkhananukun',
  role: 'Lead AI Engineer',
  email: 't.lakkhananukun@gmail.com',
  linkedin: 'https://www.linkedin.com/in/chatchawan-lakkhananukun-75880a55/',
  github: 'https://github.com/chatchawan90',
  // While true, sentences marked <span class="tbc"> are highlighted so you can check them.
  // Enable only when there are specific details marked for review.
  draft: false,
};

export type Page = { slug: string; title: string; blurb: string; status?: 'draft' | 'planned' };
export type Project = {
  id: string;
  sym: string;
  title: string;
  oneLiner: string;
  pages: Page[];
};

export const PROJECTS: Project[] = [
  {
    id: 'quoting-ai',
    sym: 'Qt',
    title: 'QT AI Agents',
    oneLiner: 'Helping sales turn a complicated customer request into a quote, while keeping track of the details that need checking.',
    pages: [
      { slug: '', title: 'Overview', blurb: 'The business problem, the architecture, and what changed.' },
      { slug: 'orchestration', title: 'Operating agents in production', blurb: 'Email threads, saved state, changing requirements and the point where CS takes over.' },
      { slug: 'runtime', title: 'Keeping the work moving', blurb: 'Fargate workers, failed tool calls, stale queued work and an estimated operating budget.' },
      { slug: 'evaluations', title: 'Releasing a change to the AI', blurb: 'The 200-chain product dataset, review feedback and the workflow checks planned next.' },
      { slug: 'rag', title: 'When a similar product is wrong', blurb: 'Finding the right item in a large catalogue takes more than matching the name on the bottle.' },
      { slug: 'rollout', title: 'Making QT smaller so people would use it', blurb: 'Pulling back the first release, introducing standalone search and learning from CS corrections.' },
    ],
  },
  {
    id: 'sales-models',
    sym: 'Rc',
    title: 'Sales recommendation platform',
    oneLiner: 'Helping a salesperson work out which customers are worth contacting, what they might need, and why now is a good time.',
    pages: [
      { slug: '', title: 'Overview', blurb: 'From scores to sales actions.' },
      { slug: 'mlops', title: 'The model improved. Should we release it?', blurb: 'How I would check whether a better test result translates into a model we can trust in daily use.' },
      { slug: 'feature-pipelines', title: 'What the model knew at the time', blurb: 'Following late-arriving orders from source records into training data and daily predictions.' },
      { slug: 'monitoring', title: 'When the recommendations feel wrong', blurb: 'Tracing a sales complaint through data quality, delayed outcomes and model behaviour.' },
      { slug: 'decisions', title: 'From predictions to decisions', blurb: 'Why nine models do not need nine live services, and where business rules belong.' },
      { slug: 'adoption', title: 'The salesperson who ignored the list', blurb: 'A story about what a salesperson knows that the recommendation system does not.' },
    ],
  },
  {
    id: 'operations',
    sym: 'Op',
    title: 'Operations platform',
    oneLiner: 'Working through the purchasing, delivery and billing details that sit between receiving an order and getting paid.',
    pages: [
      { slug: '', title: 'Overview', blurb: 'The ERP in the middle and everything around it.' },
      { slug: 'system-design', title: 'Why is the order still stuck?', blurb: 'The different things sales, finance and the warehouse need to know.' },
      { slug: 'architecture', title: 'A system a small team can operate', blurb: 'Where state belongs, how changes reach the ERP, and what it takes to recover safely.' },
      { slug: 'date-picker', title: 'It started with a date picker', blurb: 'How a small request led me to the underlying data, shared holidays and the other workflows that would depend on them.' },
    ],
  },
  {
    id: 'envsearch',
    sym: 'Es',
    title: 'EnvSearch',
    oneLiner: 'A public English and Thai regulation-search project, with cited answers, an evaluation set and tools for Claude Desktop.',
    pages: [{ slug: '', title: 'Overview', blurb: 'Making retrieval, source evidence and refusals visible in a public project.' }],
  },
  {
    id: 'verda',
    sym: 'Vd',
    title: 'Verda',
    oneLiner: 'A pool villa being renovated for short stays, and the questions I am working through before opening.',
    pages: [{ slug: '', title: 'Overview', blurb: 'Preparing a place of my own for guests.' }],
  },
];

export const pageUrl = (projectId: string, slug: string) =>
  `/work/${projectId}/${slug ? slug + '/' : ''}`;
