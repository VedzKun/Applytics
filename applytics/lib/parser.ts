export type Education = {
  degree?: string;
  institution?: string;
  year?: string;
  field?: string;
};

export type WorkExperience = {
  title?: string;
  company?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

export type ParsedResume = {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  skills: string[];
  summary?: string;
  experienceYears: number;
  education: Education[];
  workExperience: WorkExperience[];
  certifications: string[];
  languages: string[];
};

// ─────────────────────────────────────────────────────────────
// Extraction Helpers
// ─────────────────────────────────────────────────────────────

function extractEmail(text: string): string | undefined {
  const m = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return m ? m[0].toLowerCase() : undefined;
}

function extractPhone(text: string): string | undefined {
  const patterns = [
    /\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
    /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[0].trim();
  }
  return undefined;
}

function extractLinkedIn(text: string): string | undefined {
  const m = text.match(/linkedin\.com\/in\/[\w-]+/i);
  return m ? `https://${m[0]}` : undefined;
}

function extractGitHub(text: string): string | undefined {
  const m = text.match(/github\.com\/[\w-]+/i);
  return m ? `https://${m[0]}` : undefined;
}

function extractLocation(text: string): string | undefined {
  const patterns = [
    /(?:location|address|city)[:\s]+([A-Za-z\s,]+)/i,
    /([A-Z][a-z]+,\s*[A-Z]{2})/,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1].trim();
  }
  return undefined;
}

function guessName(text: string): string | undefined {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return undefined;
  const first = lines[0];
  // Name is usually 2-4 words, letters only
  if (/^[A-Za-z\s,.'-]{2,50}$/i.test(first) && first.split(/\s+/).length <= 4) {
    return first;
  }
  const m = text.match(/name[:\-]\s*([A-Za-z\s,.'-]+)/i);
  return m ? m[1].trim() : undefined;
}

const KNOWN_SKILLS = [
  // JavaScript / TypeScript Ecosystem
  'javascript', 'typescript', 'js', 'ts', 'ecmascript', 'es6', 'es2015',
  'react', 'react.js', 'reactjs', 'react native', 'react-native', 'reactnative',
  'next.js', 'nextjs', 'next', 'remix', 'gatsby', 'astro',
  'node', 'node.js', 'nodejs', 'express', 'express.js', 'expressjs', 'nestjs', 'nest.js', 'nest',
  'fastify', 'koa', 'hapi', 'adonis', 'adonisjs',
  'vue', 'vue.js', 'vuejs', 'vue 3', 'nuxt', 'nuxt.js', 'nuxtjs',
  'angular', 'angularjs', 'angular 2', 'angular 17',
  'svelte', 'sveltekit', 'solid', 'solidjs', 'qwik',
  'jquery', 'backbone', 'ember', 'ember.js',
  'webpack', 'vite', 'rollup', 'parcel', 'esbuild', 'turbopack',
  'babel', 'swc', 'typescript compiler', 'tsc',
  'npm', 'yarn', 'pnpm', 'bun',
  
  // Python Ecosystem
  'python', 'python3', 'django', 'flask', 'fastapi', 'pyramid',
  'tornado', 'bottle', 'cherrypy', 'web2py',
  'celery', 'asyncio', 'uvicorn', 'gunicorn',
  'sqlalchemy', 'alembic', 'pydantic', 'marshmallow',
  
  // Java / JVM Ecosystem
  'java', 'java 8', 'java 11', 'java 17', 'java 21',
  'spring', 'spring boot', 'springboot', 'spring framework', 'spring mvc', 'spring data',
  'spring cloud', 'spring security', 'hibernate', 'jpa',
  'maven', 'gradle', 'ant',
  'kotlin', 'scala', 'groovy', 'clojure',
  'micronaut', 'quarkus', 'vertx', 'vert.x', 'dropwizard',
  'jakarta ee', 'java ee', 'jsp', 'jsf', 'servlets',
  
  // .NET Ecosystem
  'c#', 'csharp', 'c sharp', '.net', 'dotnet', 'asp.net', 'asp.net core',
  '.net core', '.net 6', '.net 7', '.net 8', 'blazor',
  'entity framework', 'ef core', 'linq', 'xamarin', 'maui',
  'wpf', 'winforms', 'uwp',
  'f#', 'fsharp', 'vb.net', 'visual basic',
  
  // Systems Programming
  'c', 'c++', 'cpp', 'c++11', 'c++14', 'c++17', 'c++20',
  'rust', 'go', 'golang', 'zig',
  'assembly', 'webassembly', 'wasm',
  
  // Mobile Development
  'ios', 'swift', 'swiftui', 'objective-c', 'cocoa', 'cocoapods',
  'android', 'android studio', 'jetpack compose',
  'flutter', 'dart', 'ionic', 'cordova', 'phonegap',
  'xamarin', 'react native', 'expo',
  
  // Ruby Ecosystem
  'ruby', 'ruby on rails', 'rails', 'ror', 'sinatra', 'hanami',
  'rspec', 'minitest', 'bundler', 'rake',
  
  // PHP Ecosystem
  'php', 'php 8', 'laravel', 'symfony', 'codeigniter', 'yii',
  'wordpress', 'drupal', 'joomla', 'magento',
  'composer', 'phpunit',
  
  // Databases - SQL
  'sql', 'mysql', 'postgresql', 'postgres', 'mariadb',
  'sqlite', 'microsoft sql server', 'mssql', 't-sql', 'sql server',
  'oracle', 'oracle db', 'pl/sql',
  'cockroachdb', 'vitess', 'yugabytedb',
  
  // Databases - NoSQL
  'mongodb', 'mongo', 'mongoose', 'cassandra', 'couchdb',
  'dynamodb', 'firestore', 'firebase', 'realm',
  'neo4j', 'arangodb', 'orientdb', 'graph database',
  
  // Caching & In-Memory
  'redis', 'memcached', 'hazelcast', 'ignite', 'valkey',
  
  // Search & Analytics
  'elasticsearch', 'elastic', 'opensearch', 'solr',
  'algolia', 'meilisearch', 'typesense',
  
  // Message Queues & Streaming
  'kafka', 'apache kafka', 'rabbitmq', 'activemq', 'zeromq',
  'pulsar', 'nats', 'mqtt', 'redis streams',
  'amazon sqs', 'azure service bus', 'google pub/sub',
  
  // Cloud Platforms
  'aws', 'amazon web services', 'azure', 'microsoft azure', 'gcp', 'google cloud', 'google cloud platform',
  'heroku', 'digitalocean', 'linode', 'vultr', 'netlify', 'vercel',
  'cloudflare', 'cloudflare workers', 'aws lambda', 'azure functions',
  
  // AWS Services
  's3', 'ec2', 'rds', 'dynamodb', 'lambda', 'cloudfront',
  'route53', 'elb', 'elastic beanstalk', 'ecs', 'eks', 'fargate',
  'cloudformation', 'cloudwatch', 'sns', 'sqs', 'api gateway',
  'cognito', 'iam', 'vpc', 'step functions', 'eventbridge',
  
  // Azure Services
  'azure devops', 'azure active directory', 'azure sql', 'cosmos db',
  'azure storage', 'azure app service', 'azure kubernetes', 'aks',
  
  // GCP Services
  'compute engine', 'cloud storage', 'cloud functions', 'cloud run',
  'bigquery', 'dataflow', 'pub/sub', 'gke', 'cloud sql',
  
  // Containers & Orchestration
  'docker', 'docker compose', 'podman', 'containerd',
  'kubernetes', 'k8s', 'helm', 'kustomize', 'istio', 'linkerd',
  'rancher', 'openshift', 'nomad', 'docker swarm',
  
  // Infrastructure as Code
  'terraform', 'terragrunt', 'pulumi', 'cloudformation', 'cdk',
  'ansible', 'puppet', 'chef', 'saltstack',
  'bicep', 'arm templates',
  
  // CI/CD
  'jenkins', 'github actions', 'gitlab ci', 'circleci', 'travis ci',
  'azure pipelines', 'teamcity', 'bamboo', 'drone',
  'argo cd', 'flux', 'spinnaker', 'harness',
  'ci/cd', 'continuous integration', 'continuous deployment',
  
  // Version Control
  'git', 'github', 'gitlab', 'bitbucket', 'svn', 'mercurial',
  'git flow', 'trunk based development',
  
  // Monitoring & Observability
  'prometheus', 'grafana', 'datadog', 'new relic', 'dynatrace',
  'splunk', 'elk', 'elk stack', 'logstash', 'kibana',
  'loki', 'jaeger', 'zipkin', 'opentelemetry', 'otel',
  'sentry', 'bugsnag', 'rollbar', 'pagerduty',
  
  // Frontend Technologies
  'html', 'html5', 'css', 'css3', 'sass', 'scss', 'less', 'stylus',
  'tailwind', 'tailwindcss', 'bootstrap', 'material-ui', 'mui',
  'chakra ui', 'ant design', 'bulma', 'foundation',
  'styled-components', 'emotion', 'css modules', 'postcss',
  'bem', 'css-in-js',
  
  // State Management
  'redux', 'redux toolkit', 'mobx', 'zustand', 'jotai', 'recoil',
  'vuex', 'pinia', 'ngrx', 'rxjs',
  
  // Testing
  'jest', 'mocha', 'chai', 'jasmine', 'vitest',
  'react testing library', 'enzyme', 'cypress', 'playwright',
  'selenium', 'webdriver', 'puppeteer',
  'junit', 'testng', 'mockito', 'pytest', 'unittest',
  'rspec', 'phpunit', 'karma', 'protractor',
  'postman', 'insomnia', 'pact', 'contract testing',
  'tdd', 'bdd', 'test driven development', 'behavior driven development',
  
  // API Technologies
  'rest', 'restful', 'api', 'graphql', 'apollo', 'relay',
  'grpc', 'protobuf', 'protocol buffers', 'thrift',
  'soap', 'xml-rpc', 'json-rpc', 'websockets', 'socket.io',
  'openapi', 'swagger', 'postman', 'api design',
  
  // Machine Learning & AI
  'machine learning', 'ml', 'deep learning', 'ai', 'artificial intelligence',
  'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'sklearn',
  'pandas', 'numpy', 'scipy', 'matplotlib', 'seaborn',
  'jupyter', 'jupyter notebook', 'colab',
  'opencv', 'computer vision', 'nlp', 'natural language processing',
  'transformers', 'hugging face', 'bert', 'gpt', 'llm',
  'langchain', 'llamaindex', 'vector database', 'pinecone', 'weaviate',
  'mlflow', 'kubeflow', 'sagemaker', 'vertex ai',
  'xgboost', 'lightgbm', 'catboost', 'random forest',
  'neural networks', 'cnn', 'rnn', 'lstm', 'gan',
  
  // Data Engineering
  'spark', 'apache spark', 'pyspark', 'hadoop', 'hive',
  'airflow', 'apache airflow', 'dagster', 'prefect',
  'dbt', 'fivetran', 'airbyte', 'kafka', 'flink',
  'snowflake', 'databricks', 'redshift', 'bigquery',
  'etl', 'elt', 'data pipeline', 'data warehouse',
  
  // Design & UI/UX
  'figma', 'sketch', 'adobe xd', 'invision', 'zeplin',
  'photoshop', 'illustrator', 'after effects', 'premiere pro',
  'ui design', 'ux design', 'interaction design', 'user research',
  'wireframing', 'prototyping', 'usability testing',
  
  // Project Management & Collaboration
  'agile', 'scrum', 'kanban', 'lean', 'safe',
  'jira', 'confluence', 'trello', 'asana', 'monday',
  'notion', 'clickup', 'linear', 'shortcut',
  'slack', 'microsoft teams', 'zoom', 'miro', 'mural',
  
  // Security
  'oauth', 'oauth2', 'jwt', 'saml', 'openid connect',
  'ssl', 'tls', 'https', 'encryption', 'hashing',
  'penetration testing', 'vulnerability assessment', 'owasp',
  'security audits', 'compliance', 'gdpr', 'hipaa', 'soc2',
  'vault', 'hashicorp vault', 'secrets management',
  
  // Operating Systems & Tools
  'linux', 'unix', 'ubuntu', 'debian', 'centos', 'rhel', 'fedora',
  'macos', 'windows', 'windows server',
  'bash', 'shell', 'zsh', 'fish', 'powershell',
  'vim', 'emacs', 'nano', 'vscode', 'visual studio code',
  'intellij', 'pycharm', 'webstorm', 'eclipse', 'netbeans',
  
  // Blockchain & Web3
  'blockchain', 'ethereum', 'solidity', 'smart contracts',
  'web3', 'nft', 'defi', 'cryptocurrency', 'bitcoin',
  'hyperledger', 'truffle', 'hardhat', 'metamask',
  
  // Other Languages
  'elixir', 'phoenix', 'erlang', 'haskell', 'ocaml',
  'lua', 'perl', 'r', 'matlab', 'julia',
  'shell scripting', 'batch scripting',
  
  // Soft Skills & Methodologies
  'leadership', 'team management', 'mentoring', 'coaching',
  'communication', 'presentation', 'technical writing',
  'problem solving', 'critical thinking', 'analytical',
  'microservices', 'monolith', 'event driven', 'serverless',
  'domain driven design', 'ddd', 'solid', 'design patterns',
  'clean code', 'refactoring', 'code review', 'pair programming',
];

function extractSkills(text: string): string[] {
  const skills: string[] = [];
  const lowered = text.toLowerCase();

  // Try to find skills section
  const skillsSection = text.match(/(?:skills|technical skills|technologies|tech stack)[:\s]*([\s\S]{0,500})/i);
  if (skillsSection) {
    const block = skillsSection[1].split(/\n\n/)[0];
    block.split(/[;,|·•\n]/).forEach(s => {
      const t = s.trim().toLowerCase();
      if (t && t.length > 1 && t.length < 40) skills.push(t);
    });
  }

  // Also scan for known skills throughout
  KNOWN_SKILLS.forEach(k => {
    const regex = new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lowered) && !skills.includes(k)) {
      skills.push(k);
    }
  });

  // Dedupe and clean
  return Array.from(new Set(skills.map(s => s.replace(/\s+/g, ' ').trim()))).filter(Boolean);
}

function extractExperienceYears(text: string): number {
  // Look for explicit mentions
  const patterns = [
    /(\d+)\+?\s*years?\s*(?:of)?\s*(?:experience|exp)/i,
    /experience[:\s]*(\d+)\+?\s*years?/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return parseInt(m[1], 10);
  }

  // Try to calculate from work history dates
  const dateRanges = text.matchAll(/(\d{4})\s*[-–]\s*(?:(\d{4})|present|current|now)/gi);
  let totalYears = 0;
  for (const match of dateRanges) {
    const start = parseInt(match[1], 10);
    const end = match[2] ? parseInt(match[2], 10) : new Date().getFullYear();
    totalYears += Math.max(0, end - start);
  }
  return totalYears;
}

function extractEducation(text: string): Education[] {
  const education: Education[] = [];
  const degrees = [
    /(?:bachelor|b\.?s\.?|b\.?a\.?|b\.?sc\.?|b\.?tech)/i,
    /(?:master|m\.?s\.?|m\.?a\.?|m\.?sc\.?|m\.?tech|mba)/i,
    /(?:ph\.?d\.?|doctorate|doctoral)/i,
    /(?:associate|a\.?s\.?|a\.?a\.?)/i,
  ];

  const lines = text.split(/\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const degreePattern of degrees) {
      if (degreePattern.test(line)) {
        const yearMatch = line.match(/\b(19|20)\d{2}\b/);
        education.push({
          degree: line.trim(),
          year: yearMatch ? yearMatch[0] : undefined,
        });
        break;
      }
    }
  }

  return education;
}

function extractWorkExperience(text: string): WorkExperience[] {
  const experiences: WorkExperience[] = [];
  
  // Look for work experience section
  const expSection = text.match(/(?:experience|work history|employment)[:\s]*([\s\S]*?)(?=(?:education|skills|certifications|$))/i);
  if (!expSection) return experiences;

  const section = expSection[1];
  const blocks = section.split(/\n{2,}/);

  for (const block of blocks) {
    if (block.trim().length < 10) continue;
    const lines = block.split('\n').filter(l => l.trim());
    if (lines.length === 0) continue;

    const dateMatch = block.match(/(\d{4})\s*[-–]\s*(?:(\d{4})|present|current|now)/i);
    experiences.push({
      title: lines[0]?.trim(),
      company: lines[1]?.trim(),
      duration: dateMatch ? dateMatch[0] : undefined,
    });
  }

  return experiences.slice(0, 10); // Limit to prevent noise
}

function extractCertifications(text: string): string[] {
  const certs: string[] = [];
  const certSection = text.match(/(?:certifications?|certificates?|credentials?)[:\s]*([\s\S]{0,500})/i);
  if (certSection) {
    certSection[1].split(/\n/).forEach(line => {
      const t = line.trim();
      if (t && t.length > 3 && t.length < 100) certs.push(t);
    });
  }
  return certs.slice(0, 10);
}

function extractLanguages(text: string): string[] {
  const langs: string[] = [];
  const langSection = text.match(/(?:languages?)[:\s]*([\s\S]{0,200})/i);
  if (langSection) {
    langSection[1].split(/[,;\n]/).forEach(l => {
      const t = l.trim();
      if (t && t.length > 1 && t.length < 30) langs.push(t);
    });
  }
  return langs.slice(0, 10);
}

function extractSummary(text: string): string | undefined {
  const patterns = [
    /(?:summary|profile|about me|objective|professional summary)[:\s]*([\s\S]{0,500})/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      const summary = m[1].split(/\n\n/)[0].trim();
      if (summary.length > 20) return summary;
    }
  }
  return undefined;
}

// ─────────────────────────────────────────────────────────────
// Main Parser
// ─────────────────────────────────────────────────────────────

export function parseResumeFromText(raw: string): ParsedResume {
  const text = raw.replace(/\r/g, '');

  return {
    name: guessName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    location: extractLocation(text),
    linkedin: extractLinkedIn(text),
    github: extractGitHub(text),
    portfolio: undefined,
    skills: extractSkills(text),
    summary: extractSummary(text),
    experienceYears: extractExperienceYears(text),
    education: extractEducation(text),
    workExperience: extractWorkExperience(text),
    certifications: extractCertifications(text),
    languages: extractLanguages(text),
  };
}

export default parseResumeFromText;
