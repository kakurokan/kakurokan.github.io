// Comandos de cartão (START) e textos do prompt, nas duas línguas.
export const GOTO = { about: 'about', sobre: 'about', projects: 'projects', projetos: 'projects', path: 'path', journey: 'path', percurso: 'path',
               contact: 'contact', contacto: 'contact', cv: 'cv', more: 'more', mais: 'more', contests: 'contests', competicoes: 'contests', education: 'education', formacao: 'education', stack: 'stack', themes: 'themes', temas: 'themes', now: 'now', agora: 'now', activity: 'activity', atividade: 'activity' };
export const TERM = {
  en: {
    help: `Available commands:
  <span class="y">DIR</span>              list files            (or ls)
  <span class="y">TYPE</span> file        show a file           (or cat)
  <span class="y">START</span> card       go to about, projects, journey, stack, cv, contact
  <span class="y">THEME</span> name       gameboy | vapor | pink | mint | night
  <span class="y">LANG</span> en|pt       change language
  <span class="y">WHOAMI</span>           who am I
  <span class="y">GITHUB</span>           open my GitHub
  <span class="y">GIT LOG</span>          my latest public commits
  <span class="y">NEOFETCH</span>         system info
  <span class="y">CLS</span>              clear the screen      (or clear)`,
    dir: ` Volume in drive C is LEO
 Directory of C:\\LEO

STACK    YML           412  31-10-26
COMPET~1 LOG            58  31-10-26
CV       PDF        48,213  31-10-26
<span class="c">PROJECTS     &lt;DIR&gt;             31-10-26</span>
        3 File(s)      48,683 bytes`,
    stack: `languages:
  - Java        <span class="c"># strongest</span>
  - Python      <span class="c"># in production on ENEI 2027</span>
  - C++, C, SQL, OCaml, TypeScript
backend:   [FastAPI, Spring Boot, SQLAlchemy, PostgreSQL, JWT]
infra:     [Docker Compose, GitHub Actions, Alembic, Prometheus, nginx]
practices: [TDD, JUnit 5, pytest, code review, benchmarking]`,
    comp: `SWERC 2025 (Lisbon) ...... represented UAlg
MIUP 2025 (Aveiro) ....... 0 problems
MIUP 2026 (Évora) ........ 4 problems, 13th of 20 teams`,
    syntax: 'The syntax of the command is incorrect.',
    notFound: 'The system cannot find the file specified.',
    opening: x => `Opening ${x}…`,
    startUsage: 'Usage: START about | projects | journey | stack | cv | contact',
    themeUsage: 'Usage: THEME gameboy | vapor | pink | mint | night',
    themeSet: x => `Theme: ${x}`,
    langUsage: 'Usage: LANG en | pt',
    unknown: c => `'${c}' is not recognized as an internal or external command. Type HELP.`,
    ver: '<span class="m">LéoOS</span> [Version 2027.07] — available from July 2027',
    sudo: 'Nice try. :)',
    hired: 'Permission granted. Opening contact…',
    gitUsage: 'Usage: GIT LOG',
    gitEmpty: 'No commits loaded yet. Try again in a moment.',
    neofetch: `<span class="m">  /\\_/\\  </span>  <span class="y">leo</span>@<span class="y">faro</span>
<span class="m"> ( o.o ) </span>  ----------
<span class="m">  &gt; ^ &lt;  </span>  <span class="y">OS</span>        LéoOS 2027.07
           <span class="y">Role</span>      software engineer (backend)
           <span class="y">Langs</span>     Java, Python, C++, SQL
           <span class="y">Stack</span>     FastAPI, Spring Boot, PostgreSQL, Docker
           <span class="y">Shipping</span>  ENEI 2027 platform
           <span class="y">Degree</span>    Informatics Eng., UAlg (17/20)
           <span class="y">Cat</span>       Koji`,
    banner: '<span class="m">LéoOS</span> [Version 2027.07]\n(C) Léo Souza. Algarve, Portugal.\n',
    hint: '<span class="c">Type HELP to see the commands.</span>\n'
  },
  pt: {
    help: `Comandos disponíveis:
  <span class="y">DIR</span>              lista ficheiros       (ou ls)
  <span class="y">TYPE</span> ficheiro    mostra um ficheiro    (ou cat)
  <span class="y">START</span> cartão     vai para sobre, projetos, percurso, stack, cv, contacto
  <span class="y">THEME</span> nome       gameboy | vapor | rosa | menta | noite
  <span class="y">LANG</span> en|pt       muda a língua
  <span class="y">WHOAMI</span>           quem sou eu
  <span class="y">GITHUB</span>           abre o meu GitHub
  <span class="y">GIT LOG</span>          os meus últimos commits públicos
  <span class="y">NEOFETCH</span>         informação do sistema
  <span class="y">CLS</span>              limpa o ecrã          (ou clear)`,
    dir: ` O volume na unidade C é LEO
 Diretório de C:\\LEO

STACK    YML           412  31-10-26
COMPET~1 LOG            58  31-10-26
CV       PDF        48.213  31-10-26
<span class="c">PROJETOS     &lt;DIR&gt;             31-10-26</span>
        3 ficheiro(s)      48.683 bytes`,
    stack: `linguagens:
  - Java        <span class="c"># a mais forte</span>
  - Python      <span class="c"># em produção no ENEI 2027</span>
  - C++, C, SQL, OCaml, TypeScript
backend:   [FastAPI, Spring Boot, SQLAlchemy, PostgreSQL, JWT]
infra:     [Docker Compose, GitHub Actions, Alembic, Prometheus, nginx]
práticas:  [TDD, JUnit 5, pytest, code review, benchmarking]`,
    comp: `SWERC 2025 (Lisboa) ...... pela UAlg
MIUP 2025 (Aveiro) ....... 0 problemas
MIUP 2026 (Évora) ........ 4 problemas, 13.º de 20 equipas`,
    syntax: 'Sintaxe do comando incorreta.',
    notFound: 'O sistema não consegue encontrar o ficheiro especificado.',
    opening: x => `A abrir ${x}…`,
    startUsage: 'Usa: START sobre | projetos | percurso | stack | cv | contacto',
    themeUsage: 'Usa: THEME gameboy | vapor | rosa | menta | noite',
    themeSet: x => `Tema: ${x}`,
    langUsage: 'Usa: LANG en | pt',
    unknown: c => `'${c}' não é reconhecido como comando. Escreve HELP.`,
    ver: '<span class="m">LéoOS</span> [Versão 2027.07] — disponível a partir de julho de 2027',
    sudo: 'Boa tentativa. :)',
    hired: 'Permissão concedida. A abrir o contacto…',
    gitUsage: 'Usa: GIT LOG',
    gitEmpty: 'Ainda não há commits carregados. Tenta daqui a pouco.',
    neofetch: `<span class="m">  /\\_/\\  </span>  <span class="y">leo</span>@<span class="y">faro</span>
<span class="m"> ( o.o ) </span>  ----------
<span class="m">  &gt; ^ &lt;  </span>  <span class="y">SO</span>        LéoOS 2027.07
           <span class="y">Papel</span>     engenheiro de software (backend)
           <span class="y">Línguas</span>   Java, Python, C++, SQL
           <span class="y">Stack</span>     FastAPI, Spring Boot, PostgreSQL, Docker
           <span class="y">Em curso</span>  plataforma do ENEI 2027
           <span class="y">Curso</span>     Eng. Informática, UAlg (17/20)
           <span class="y">Gato</span>      Koji`,
    banner: '<span class="m">LéoOS</span> [Versão 2027.07]\n(C) Léo Souza. Algarve, Portugal.\n',
    hint: '<span class="c">Escreve HELP para veres os comandos.</span>\n'
  }
};
