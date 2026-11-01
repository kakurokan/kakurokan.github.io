// Projetos do cartão "Projects". Texto simples ou { en, pt }.
export const PROJECTS = [
  { slug: 'enei-2027', name: { en: 'ENEI 2027 Platform', pt: 'Plataforma ENEI 2027' },
    meta: { en: 'Volunteer backend developer · Jun 2026 – present · hybrid', pt: 'Backend developer voluntário · jun 2026 – presente · híbrido' },
    desc: { en: 'Backend of the website and ticketing API for ENEI, the National Gathering of Informatics Students, coming to Faro. Domain-driven FastAPI, SQLAlchemy 2 and PostgreSQL.',
            pt: 'Backend do site e da API de bilhetes do ENEI, o Encontro Nacional de Estudantes de Informática, que vem a Faro. FastAPI com Domain-Driven Design, SQLAlchemy 2 e PostgreSQL.' },
    stats: [ ['12', { en: 'PRs merged', pt: 'PRs aceites' }], ['13', { en: 'PRs reviewed', pt: 'PRs revistos' }],
             ['500+', { en: 'test suite', pt: 'testes na suite' }], ['4', { en: 'migrations', pt: 'migrações' }] ],
    points: [
      { en: 'Built the authentication and account flows: JWT auth middleware, password recovery, remember-me, terms acceptance and an admin-promotion CLI.',
        pt: 'Fiz a autenticação e as contas: middleware JWT, recuperação de password, remember-me, aceitação de termos e uma CLI para promover administradores.' },
      { en: 'Designed the HMAC-signed, PII-free ticket QR payload, so a ticket can be verified without exposing personal data.',
        pt: 'Desenhei o QR dos bilhetes assinado com HMAC e sem dados pessoais, para validar um bilhete sem expor quem o comprou.' },
      { en: 'Wrote 25+ of the 500+ tests. Every change passes GitHub Actions CI (lint, tests, smoke test) before deploy.',
        pt: 'Escrevi mais de 25 dos mais de 500 testes. Cada alteração passa no CI do GitHub Actions (lint, testes, smoke test) antes do deploy.' },
      { en: 'Worked on an 8-service Docker Compose stack with Prometheus monitoring; my 4 Alembic migrations are CI-checked as reversible and drift-free.',
        pt: 'Trabalho numa stack Docker Compose de 8 serviços monitorizada com Prometheus; as minhas 4 migrações Alembic são validadas em CI como reversíveis e sem drift.' }
    ],
    tags: ['Python', 'TDD', 'FastAPI', 'SQLAlchemy 2', 'PostgreSQL', 'DDD', 'Alembic', 'Docker Compose', 'Prometheus', 'CI/CD'],
    links: [ ['website', 'https://www.eneifaro.pt/'] ],
    repo: 'https://github.com/Dep-tech-coenei-faro-27/event-site' },
  { slug: 'fintlist', name: 'FintList',
    meta: { en: 'High-performance int list · co-developed with a classmate', pt: 'Lista de int de alto desempenho · feita com um colega' },
    desc: { en: 'A doubly linked list for primitive int stored in three parallel arrays instead of node objects, which cuts allocations and garbage-collector pressure.',
            pt: 'Uma lista duplamente ligada para int primitivos guardada em três arrays paralelos em vez de objetos nó, o que corta alocações e pressão no garbage collector.' },
    stats: [ ['~8×', { en: 'faster addAt/removeAt', pt: 'mais rápida em addAt/removeAt' }], ['~10M', { en: 'elements', pt: 'elementos' }],
             ['1.63', { en: 'doubling ratio (vs 2.10)', pt: 'doubling ratio (vs 2,10)' }] ],
    points: [
      { en: 'Reuses free slots, caches the last access and starts each traversal from the head, the tail or the last accessed node, whichever is closer.',
        pt: 'Reutiliza posições livres, guarda o último acesso e começa cada percurso pela cabeça, pela cauda ou pelo último nó acedido, o que estiver mais perto.' },
      { en: "About 8× faster addAt/removeAt than the course's linked list at ~10M elements. Both are O(n): the gain comes from smaller constant factors, not from a complexity change.",
        pt: 'Cerca de 8× mais rápida em addAt/removeAt do que a lista ligada da cadeira com ~10M elementos. As duas são O(n): o ganho vem de constantes menores, não de mudar a complexidade.' },
      { en: 'Benchmarked with Monte Carlo random positions and doubling-ratio tests (mean ratio for addAt 1.63 vs 2.10).',
        pt: 'Medida com posições aleatórias Monte Carlo e testes de doubling ratio (razão média em addAt de 1,63 contra 2,10).' },
      { en: "Its iterative deepCopy handled lists far larger than the course list's recursive copy, which overflowed the stack.",
        pt: 'O deepCopy iterativo aguentou listas muito maiores do que a cópia recursiva da lista da cadeira, que rebentava a stack.' }
    ],
    tags: ['Java', 'TDD', 'Maven', 'JUnit 5', 'GitHub Actions', { en: 'Benchmarks', pt: 'Benchmarks' }],
    repo: 'https://github.com/kakurokan/FintList' },
  { slug: 'maritime-navigation', name: { en: 'Maritime Navigation Simulator', pt: 'Simulador de Navegação Marítima' },
    meta: { en: 'Route planning simulator · 3-person team · Apr – Jun 2026', pt: 'Simulador com planeamento de rotas · equipa de 3 · abr – jun 2026' },
    desc: { en: 'A discrete-time maritime traffic simulator with a Swing GUI, built test-first.',
            pt: 'Um simulador de tráfego marítimo em tempo discreto com interface Swing, feito com testes primeiro.' },
    points: [
      { en: 'Dijkstra route planning on a graph that contains no obstacle-crossing edges.',
        pt: 'Rotas planeadas com Dijkstra num grafo sem arestas que atravessem obstáculos.' },
      { en: 'Design patterns: Strategy (pluggable routing algorithms), State (ship life cycle), Mediator (a control tower that resolves collisions), Iterator (on-time ship departures), Command (GUI actions).',
        pt: 'Padrões: Strategy (algoritmos de rota intercambiáveis), State (ciclo de vida do navio), Mediator (uma torre de controlo que resolve colisões), Iterator (partidas a horas), Command (ações da interface).' },
      { en: 'Collision avoidance: ship areas are circles, priority goes by trip code, and the yielding ship waits and then resumes its route.',
        pt: 'Evitar colisões: as áreas dos navios são círculos, a prioridade vai pelo código da viagem e o navio que cede espera e depois retoma a rota.' },
      { en: 'The GUI reads read-only simulation snapshots, so the interface stays decoupled from the navigation logic.',
        pt: 'A interface lê snapshots só de leitura da simulação, por isso fica desacoplada da lógica de navegação.' }
    ],
    tags: ['Java', 'TDD', 'Swing', 'JUnit 5', 'Maven', 'GitHub Actions', 'Design patterns'],
    repo: 'https://github.com/kakurokan/Maritime_Navigation' },
  { slug: 'hashing-trees', name: { en: 'Hash Table & Tree Library', pt: 'Biblioteca de Hash Tables e Árvores' },
    meta: { en: 'Co-built with a classmate', pt: 'Feita com um colega' },
    desc: { en: 'Two non-linear data structures in Java 17, measured under their worst-case loads.',
            pt: 'Duas estruturas de dados não lineares em Java 17, medidas nos seus piores casos.' },
    stats: [ ['1.31', { en: 'max/min depth ratio', pt: 'razão de profundidade máx/mín' }], ['1.0', { en: 'comparisons per hit', pt: 'comparações por acerto' }],
             ['0.0', { en: 'comparisons per miss', pt: 'comparações por falha' }] ],
    points: [
      { en: "A weight-balanced tree whose searches rotate frequently used keys toward the root. After 100,000 sorted insertions (a plain BST's worst case), the max/min depth ratio stayed at 1.31.",
        pt: 'Uma árvore equilibrada por peso em que as pesquisas rodam as chaves mais usadas para a raiz. Depois de 100 000 inserções ordenadas (o pior caso de uma BST simples), a razão entre profundidade máxima e mínima ficou em 1,31.' },
      { en: 'A multi-level hash table with double hashing and a Bloom-filter-style marker per bucket. Across 10 million keys, lookups averaged 1.0 key comparisons on hits and 0.0 on misses.',
        pt: 'Uma hash table multinível com double hashing e um marcador estilo Bloom filter por bucket. Com 10 milhões de chaves, as pesquisas fizeram em média 1,0 comparações nos acertos e 0,0 nas falhas.' }
    ],
    tags: ['Java 17', 'TDD', 'Maven', 'JUnit 5', 'GitHub Actions'],
    repo: 'https://github.com/kakurokan/non-linear_and_hashing_data_structures' },
  { slug: 'bookswipe', name: 'BookSwipe',
    desc: { en: "Tinder-style app for books: swipe on the ones you like and get recommendations. I'm building the backend in Java with Spring Boot; the React/TypeScript frontend is my teammate's.",
            pt: 'App ao estilo Tinder para livros: deslizas nos que gostas e recebes recomendações. Estou a fazer o backend em Java com Spring Boot; o frontend em React e TypeScript é do meu colega de equipa.' },
    tags: ['Java', 'TDD', 'Spring Boot', 'REST'],
    repo: 'https://github.com/kakurokan/BookSwipe' }
];

// lista compacta do cartão "More projects"
export const MORE = [
  { name: 'DNS Client from Scratch', url: 'https://github.com/kakurokan/DNSClient', tech: 'Python · UDP sockets · Wireshark',
    desc: { en: 'Builds DNS query packets byte by byte.', pt: 'Constrói os pacotes de consulta DNS byte a byte.' } },
  { name: 'PuzzleAI Collection', url: 'https://github.com/kakurokan/PuzzleAI-Collection', tech: 'Java · TDD · Best-First search · JUnit 5',
    desc: { en: 'Ball Sort solver.', pt: 'Solver de Ball Sort.' } },
  { name: 'SWERC Team Notebook', url: 'https://github.com/kakurokan/SwercNotebookUALG', tech: 'C++',
    desc: { en: "The team's reference notebook of graph, DP, segment-tree, string and number-theory algorithms.",
            pt: 'O caderno de referência da equipa, com algoritmos de grafos, DP, segment trees, strings e teoria dos números.' } }
];
