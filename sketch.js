// ── Langue ────────────────────────────────────────────────────────────────────
// 'fr' ou 'en' : ?lang=en dans l'URL, sinon dernier choix, sinon langue du navigateur.
// Tout texte affiché peut être une chaîne (identique dans les deux langues)
// ou un objet { fr: "…", en: "…" } lu avec tr().
let lang = detectLang();

function detectLang() {
  let q = new URLSearchParams(location.search).get('lang');
  if (q === 'fr' || q === 'en') return q;
  try {
    let saved = localStorage.getItem('lang');
    if (saved === 'fr' || saved === 'en') return saved;
  } catch (e) {}
  return /^fr/i.test(navigator.language || '') ? 'fr' : 'en';
}

function setLang(l) {
  lang = l;
  try { localStorage.setItem('lang', l); } catch (e) {}
  document.documentElement.lang = l;
  if (l === 'en') loadEnglishImages();
}

function tr(v) {
  return (v && typeof v === 'object') ? (v[lang] || v.fr) : v;
}

// Textes de l'interface
const UI = {
  back:        { fr: "← Retour",  en: "← Back" },
  category:    { fr: "Catégorie", en: "Category" },
  year:        { fr: "Année",     en: "Year" },
  client:      { fr: "Client",    en: "Client" },
  description: { fr: "Description", en: "Description" },
  about:       { fr: "À propos",  en: "About" },
  cvHint:      { fr: "Touchez le CV pour l'agrandir", en: "Tap the CV to enlarge" },
};
function t(key) { return tr(UI[key]); }

// Catégories de projets : la valeur française sert de clé de filtre, seul l'affichage est traduit
const CATEGORIES_EN = {
  'Tous': 'All', 'Édition': 'Editorial', 'Affiche': 'Poster',
  'Identité visuelle': 'Visual identity', 'Perso': 'Personal'
};
function catLabel(c) {
  return lang === 'en' ? (CATEGORIES_EN[c] || c) : c;
}

// ── Sections ──────────────────────────────────────────────────────────────────
const sections = [
  { label: { fr: "À propos", en: "About" },   color:[210,204,138], title: { fr: "À propos de moi", en: "About me" } },
  { label: { fr: "Projets",  en: "Projects" }, color:[103,184,76],  title: { fr: "Projets", en: "Projects" } },
  { label: { fr: "Vidéo",    en: "Video" },    color:[140,200,191], title: { fr: "Vidéo",   en: "Video" } },
  { label: "Eclectique Lab",                   color:[118,135,218], title: "Eclectique Lab" },
  { label: "Contact",                          color:[116,86,189],  title: "Contact" }
];
const N = sections.length;

// ── Images ────────────────────────────────────────────────────────────────────
let imgs     = [];
let cartonImg;
// Versions anglaises du carton et des dossiers (texte « servez-vous ! » traduit).
// Fichiers optionnels : assets/carton_en.png et assets/dossier_0_en.png … dossier_4_en.png,
// même cadrage que les originaux. Tant qu'ils manquent, les images françaises sont utilisées.
let cartonImgEn = null;
let imgsEn      = [];
let englishImagesRequested = false;
let aproposImg = null;
let cvImg              = null;
let localVideoFrame    = null;
let carouselPdfFrame   = null;
let figmaFrame         = null;
let instagramFrame     = null;

// ── Projets Graphisme ─────────────────────────────────────────────────────────
// categorie : "Affiche" | "Identité" | "Illustration" | "Motion" | "Typographie" | …
const GRAPHISME_PROJETS = [
  { imgs: ['assets/graphisme_1a.jpg','assets/graphisme_1b.jpg','assets/graphisme_1c.jpg','assets/graphisme_1d.png'], titre: 'Mémoire', annee: '2025', client: '', categorie: 'Édition', desc: { fr: "Mon mémoire interroge la possibilité du design japonais de s'imposer comme une référence mondiale à l'instar du graphisme suisse.\nJ'analyse dedans l'historique culturel et esthétique, j'explore les caractéristiques visuelles et philosophiques qui font la singularité du design nippon.", en: "My thesis asks whether Japanese design could become a global reference, as Swiss graphic design did.\nIn it, I analyse its cultural and aesthetic history and explore the visual and philosophical traits that make Japanese design unique." } },
  { imgs: ['assets/graphisme_2a.jpg','assets/graphisme_2b.jpg','assets/graphisme_2c.jpg','assets/graphisme_2d.jpg','assets/graphisme_2e.jpg','assets/graphisme_2f.jpg'], titre: 'Eusapie', annee: '2024', client: '', categorie: 'Édition', desc: { fr: "Inspiré par l'œuvre d'Italo Calvino, ce projet rend hommage à l'univers onirique des Villes invisibles. L'illustration représente la ville d'Eusapie, dont le billet a été gravé en taille-douce.", en: "Inspired by the work of Italo Calvino, this project pays tribute to the dreamlike world of Invisible Cities. The illustration depicts the city of Eusapia, whose banknote was engraved in intaglio." } },
  { imgs: ['assets/graphisme_3a.jpg','assets/graphisme_3b.jpg','assets/graphisme_3c.jpg'], titre: 'Exercice de type', annee: '2025', client: '', categorie: 'Édition', desc: { fr: "Inspiré du livre «Exercices de style», ce livre-expérimentation explore les familles typographiques. Une même phrase est réinterprétée en styles variés.", en: "Inspired by the book «Exercises in Style», this experimental book explores typeface families. A single sentence is reinterpreted in a variety of styles." } },
  { imgs: ['assets/graphisme_4a.jpg','assets/graphisme_4b.jpg','assets/graphisme_4c.jpg','assets/graphisme_4d.jpg','assets/graphisme_4e.jpg'], titre: 'Polar', annee: '2024', client: '', categorie: 'Édition', desc: { fr: "Projet de classe sur le thème du polar : deux linogravures originales ont été créées inspirées par l'univers sombre du genre. Ces illustrations, aux contrastes marqués capturent l'essence des polars policiers : meurtre, énigme et tension.", en: "Class project on the theme of crime fiction: two original linocuts inspired by the dark world of the genre. With their strong contrasts, these illustrations capture the essence of detective novels: murder, mystery and suspense." } },
  { imgs: ['assets/graphisme_5a.jpg','assets/graphisme_5b.jpg','assets/graphisme_5c.jpg','assets/graphisme_5d.mp4'], titre: 'Octobre Rose', annee: '2024', client: 'General Electric', categorie: 'Affiche', desc: { fr: "Création d'une affiche collaborative pour la campagne Octobre Rose 2024 des Bénévoles de GE Vernova. Réalisée à l'aide de tampons en linogravure, cette initiative a permis à des cadres, dirigeants et bénévoles de l'association de créer chacun 30 affiches uniques.", en: "A collaborative poster for the GE Vernova Volunteers' 2024 Pink October campaign. Made with linocut stamps, this initiative allowed managers, executives and volunteers of the association to each create 30 unique posters." } },
  { imgs: ['assets/graphisme_6a.jpg','assets/graphisme_6b.jpg','assets/graphisme_6c.jpg'], titre: 'Big Brother', annee: '2025', client: '', categorie: 'Affiche', desc: { fr: "Réalisée sur des chutes de papier noir, cette sérigraphie en rouge et blanc s'inspire de l'univers dystopique de 1984 pour interroger notre époque. Elle évoque l'omniprésence de la surveillance, entre contrôle invisible et résistance visuelle.", en: "Printed on offcuts of black paper, this red and white screen print draws on the dystopian world of 1984 to question our times. It evokes the omnipresence of surveillance, between invisible control and visual resistance." } },
  { preview: 'https://www.youtube.com/embed/Ua2Eo687CJM?controls=1', titre: 'Transport 9HA.02 2ᵉ unité', annee: '2019', client: 'General Electric', categorie: 'General Electric', desc: { fr: "Réalisation et montage pour la 2ᵉ turbine à gaz 9HA.02 produite à Belfort.", en: "Filming and editing for the 2nd 9HA.02 gas turbine produced in Belfort." } },
  { preview: 'https://www.youtube.com/embed/A3pA9tl60HA?controls=1', titre: '30th 9HA',                   annee: '2021', client: 'General Electric', categorie: 'General Electric', desc: { fr: "Réalisation et montage pour la 30ᵉ turbine à gaz produite à Belfort.", en: "Filming and editing for the 30th gas turbine produced in Belfort." } },
  { imgs: ['assets/graphisme_7a.jpg','assets/graphisme_7b.jpg','assets/graphisme_7c.jpg','assets/graphisme_7d.jpg'], titre: 'Move to Zero', annee: '2022', client: 'Nike', categorie: 'Communication', desc: { fr: "Conception d'une communication visuelle et éditoriale pour Move to Zero, l'initiative écologique de Nike. Ce projet fictif explore une identité graphique engagée, composée d'une dichotomie entre les anciennes baskets et le recyclage.", en: "Visual and editorial communication for Move to Zero, Nike's environmental initiative. This fictional project explores a committed graphic identity built on a contrast between old sneakers and recycling." } },
  { imgs: ['assets/graphisme_8a.jpg','assets/graphisme_8b.jpg','assets/graphisme_8c.jpg','assets/graphisme_8d.jpg'], titre: 'Révolution écolo', annee: '2025', client: '', categorie: 'Édition', desc: { fr: "Création et découpages de fruits en papier et mise en page d'un article Télérama, sur le thème de la pâtisserie responsable. Ce projet fictif nous parle de l'importance de consommer des fruits de saison.", en: "Paper fruit cut-outs and the layout of a Télérama article on sustainable pastry-making. This fictional project highlights the importance of eating seasonal fruit." } },
  { imgs: ['assets/graphisme_9a.jpg','assets/graphisme_9b.jpg','assets/graphisme_9c.jpg','assets/graphisme_9d.jpg','assets/graphisme_9e.jpg','assets/graphisme_9f.jpg','assets/graphisme_9g.jpg','assets/graphisme_9h.jpg'], titre: 'Boot Configuration Data', annee: '2025', client: 'Sacred Bones Records', categorie: 'Identité visuelle', desc: { fr: "Création d'une identité visuelle fictive dans le cadre d'une intégration au label Sacred Bones Records du groupe Master Boot Records. Les visuels ont été conçus à partir de fragments issus d'un ancien disque dur démonté, pour créer une esthétique à la fois industrielle et technologique, en écho direct à l'identité sonore du groupe.", en: "A fictional visual identity for the band Master Boot Records joining the Sacred Bones Records label. The visuals were made from fragments of an old dismantled hard drive, creating an aesthetic that is both industrial and technological, a direct echo of the band's sound." } },
  { imgs: ['assets/graphisme_10a.jpg','assets/graphisme_10b.jpg','assets/graphisme_10c.jpg','assets/graphisme_10d.jpg','assets/graphisme_10e.pdf'], titre: 'Year One', annee: '2025', client: 'General Electric', categorie: 'General Electric', desc: { fr: "Création de trois propositions de logos pour la collection anniversaire des t-shirts célébrant le premier anniversaire de GE Vernova en Europe. Chaque proposition explore une direction graphique distincte : détail manches, dynamisme et mouvement, référence à l'Europe, héritage et modernité.", en: "Three logo proposals for the anniversary T-shirt collection celebrating GE Vernova's first year in Europe. Each proposal explores a distinct graphic direction: sleeve detail, energy and movement, a nod to Europe, heritage and modernity." } },
  { imgs: ['assets/graphisme_11a.jpg'], titre: 'France procuration', annee: '2024', client: '', categorie: 'UI/UX', desc: { fr: "Application mobile conçue pour simplifier et moderniser la démarche de procuration lors des élections législatives de 2024. Grâce à une authentification sécurisée via la nouvelle carte d'identité, les utilisateurs peuvent créer leur procuration directement depuis leur smartphone sans avoir à se déplacer en commissariat. Pratique et rapide, cette solution réduit les contraintes administratives et facilite l'accès au vote notamment pour les personnes absentes ou empêchées. En rendant la procuration plus simple et accessible l'application contribue également à lutter contre l'abstention en encourageant une plus large participation.", en: "A mobile app designed to simplify and modernise proxy voting for the 2024 French legislative elections. With secure authentication through the new identity card, users can set up their proxy vote directly from their smartphone, without going to a police station. Quick and convenient, it cuts red tape and makes voting easier, especially for people who are away or unable to vote in person. By making proxy voting simpler and more accessible, the app also helps fight abstention by encouraging wider participation." }, figma: 'https://www.figma.com/proto/OkDimolgd5hduBvD9zPEc9/Untitled?page-id=0%3A1&node-id=1-4&p=f&viewport=403%2C442%2C0.18&t=vLrECDGW3nLeCSAC-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1%3A4' },
  { imgs: ['assets/graphisme_12a.png','assets/graphisme_12b.jpg','assets/graphisme_12c.png'], titre: 'Jurabio', annee: '2022', client: '', categorie: 'Identité visuelle', desc: { fr: "Étiquette conçue pour un ensemble de 6 étiquettes distinctes de vin jurabio, destiné à financer une sortie scolaire.", en: "One of a set of 6 distinct labels for Jurabio wine, sold to fund a school trip." } },
  { imgs: ['assets/graphisme_13a.jpg','assets/graphisme_13b.jpg','assets/graphisme_13c.jpg','assets/graphisme_13d.jpg'], titre: '9HA.02 World Premiere', annee: '2018', client: 'General Electric', categorie: 'General Electric', desc: { fr: "Réalisation d'une illustration vectorielle en monochrome représentant le convoi exceptionnel de la turbine à gaz 9HA.02. Ce travail s'inscrit dans la création d'objets commémoratifs destinés aux acteurs institutionnels ayant contribué à la réussite de son transport hors normes.", en: "A monochrome vector illustration of the oversized convoy carrying the 9HA.02 gas turbine. It was part of a set of commemorative items for the institutional partners who made this exceptional transport a success." } },
  { imgs: ['assets/graphisme_14a.jpg','assets/graphisme_14b.jpg','assets/graphisme_14c.jpg','assets/graphisme_14d.jpg','assets/graphisme_14e.jpg','assets/graphisme_14f.jpg','assets/graphisme_14g.jpg','https://www.instagram.com/p/DVOTCHjCDbp/'], titre: 'Du design au service de l\'exclusion', annee: '2026', client: '', categorie: 'Perso', desc: { fr: "Série de stickers détournant les codes des étiquettes de colis et de panneaux d'avertissement pour dénoncer l'architecture hostile à Paris.", en: "A series of stickers that hijack the codes of parcel labels and warning signs to denounce hostile architecture in Paris." } },
];
let graphismeImgs        = [];        // thumbnail par projet (première image)
let graphismeCarouselImgs = [];       // tableau d'images par projet (pour carousel)
let graphismeCarouselIdx = 0;         // index image active dans le carousel
let graphismeSelected    = -1;
let graphismeCategory    = 'Tous';   // filtre actif

// ── Projets Eclectique Lab ────────────────────────────────────────────────────────
const ECLECTIQUE_PROJETS = [
  { img: 'assets/eclectique_1.jpg', titre: 'Répare Grêle', annee: '2026', client: 'Répare Grêle', desc: { fr: "Réalisation d'une vidéo promotionnelle et d'une série de prises de vue pour le site web de l'entreprise Répare grêle", en: "A promotional video and a photo shoot for the Répare Grêle company website" }, lien: 'https://www.reparegrele.fr/', preview: 'https://www.youtube.com/embed/HjFh3WrojNg?controls=1' },
  { img: 'assets/eclectique_3.jpg', titre: 'A l\'ombre de la Canopée', annee: '2025', client: 'Domaine de La Canopée', desc: { fr: "Conception et réalisation d'une vidéo promotionnelle présentant les hébergements insolites du domaine La Canopée", en: "Concept and production of a promotional video showcasing the unusual accommodation at the La Canopée estate" }, lien: 'https://youtu.be/w8glPcoBUS8', preview: 'https://www.youtube.com/embed/w8glPcoBUS8?controls=1' },
  { img: 'assets/eclectique_2.jpg', titre: 'Necronomicon - Une convention pleine de surprises...', annee: '2025', client: 'Fam Atelier', desc: { fr: "Réalisation d'un réel promotionnel", en: "A promotional reel" }, lien: 'https://youtube.com/shorts/r2ML2_FiLps', preview: 'https://www.youtube.com/embed/r2ML2_FiLps?controls=1', ratio: '9/16' },
  { img: 'assets/eclectique_4.jpg', titre: 'Ma première convention', annee: '2024', client: 'Fam Atelier', desc: { fr: "Réalisation d'un réel promotionnel et de prises de vue pour la banque d'images de la créatrice", en: "A promotional reel and photos for the creator's image library" }, lien: 'https://www.instagram.com/p/C5v21eFqsy6/', preview: 'https://www.youtube.com/embed/Slz6MCmRK2U?controls=1', ratio: '9/16' },
];
let eclectiqueImgs = [];

// ── Projets Vidéo ─────────────────────────────────────────────────────────────
const VIDEO_PROJETS = [
  { titre: 'Justice Stress td glitch', desc: { fr: "Expérimentation Touch Designer", en: "Touch Designer experiment" },                                                       preview: 'https://www.youtube.com/embed/Z5_4tqdT93E?controls=1' },
  { titre: 'AVD réactivité',    desc: { fr: "Expérimentation Touch Designer", en: "Touch Designer experiment" },                                                            preview: 'https://www.youtube.com/embed/XQvi5ktRcAg?controls=1' },
  { titre: 'La cuisine des canailles', desc: { fr: "Animation réalisée pour une émission fictive produite par France 5", en: "Animation made for a fictional show produced by France 5" },         preview: 'https://www.youtube.com/embed/MvwvVDYP2OI?controls=1' },
  { titre: 'Lettres singulières', desc: { fr: 'Vidéo expérimentale autour du thème « Lettres singulières »', en: "Experimental video on the theme « Lettres singulières » (Singular letters)" },                             preview: 'https://www.youtube.com/embed/a9yZYQJA1yI?controls=1' },
  { titre: 'Drone.mp4',         desc: '',                                                                                      preview: 'https://www.youtube.com/embed/6aifvWqVX4Y?controls=1' },
  { titre: 'NOËL',              desc: '',                                                                                      preview: 'https://www.youtube.com/embed/OpSgMS-tf70?controls=1' },
  { titre: 'SUMMER 2020',       desc: '',                                                                                      preview: 'https://www.youtube.com/embed/kdGB1i9vqvM?controls=1' },
  { titre: 'ERROR…',           desc: '',                                                                                      preview: 'https://www.youtube.com/embed/17wJPSq5w18?controls=1' },
  { titre: 'Untilted 1',        desc: '',                                                                                      preview: 'https://www.youtube.com/embed/bscLG_QGDXQ?controls=1' },
  { titre: 'Quarantine',        desc: { fr: "Travail d'anglais réalisé pendant le confinement", en: "English class project made during lockdown" },                                      preview: 'https://www.youtube.com/embed/-rcqlSjoguU?controls=1' },
  { titre: 'Dublin',             desc: '',                                                                                      preview: 'https://www.youtube.com/embed/_BwLKqk1t5g?controls=1' },
];
let eclectiqueSelected = -1;  // projet ouvert en détail
let detailProgress     = 0;   // animation ouverture détail 0→1
let detailTarget       = 0;
let detailCloseTimer   = null;
let sheetCloseTimer    = null;
let previewFrame       = null;   // iframe d'aperçu site

// ── Défilement (une seule fiche ouverte à la fois) ───────────────────────────
let gridScrollY      = 0;  // grille Projets / Vidéo / Eclectique (interpolé)
let gridScrollTarget = 0;
let textScrollY      = 0;  // texte long : bio À propos, description d'un projet
let textScrollTarget = 0;
const IMG_W  = 440;
const IMG_H  = 440;

// ── Thème ────────────────────────────────────────────────────────────────────
let darkMode = false;
let themeBtnClickCount = 0;
let easterEggAudio = null;
let easterEggActive      = false;
let debugCopiedAt        = -9999;
let easterEggFolderIdx   = 0;
let easterEggLastSwitch  = 0;
let easterEggLastFlash   = -1;

// ── État ──────────────────────────────────────────────────────────────────────
let displayAlpha  = new Array(N+1).fill(0);
let hovered       = -1;
let activeFolder  = -1;
let sheetProgress = 0;
let sheetTarget   = 0;

// ── Animation d'entrée ────────────────────────────────────────────────────────
let introY      = -800;
let introVY     = 0;
let introPlayed  = (sessionStorage.getItem('introPlayed') === '1');
let introLanded  = introPlayed;
if (introPlayed) introY = 0;
let hoverCount   = 0;    // nombre de dossiers survolés
let lastHovered  = -1;   // dernier dossier survolé
let soundCtx     = null; // Web Audio context pour les sons

// ── Zones de survol ───────────────────────────────────────────────────────────
// Polygones en pixels, repère centré sur le canvas (0,0 = centre écran).
// L'image des dossiers mesure IMG_W×IMG_H px → elle va de -220 à +220 sur x et y.
// folder = index du dossier à ouvrir (plusieurs zones peuvent pointer vers le même dossier).
const FOLDER_ZONES = [
  { on: true, folder: 0, pts: [[-115,-61],[-130,-13],[6,44],[30,33],[32,16],[-52,-20],[-85,-49]] }, // À propos
  { on: true, folder: 1, pts: [[-91,-53],[-86,-74],[-53,-60],[-29,-35],[59,3],[58,20],[31,33],[32,15],[-54,-24],[-73,-43],[-92,-54]] }, // Projets
  { on: true, folder: 2, pts: [[-58,-88],[-62,-68],[-44,-55],[-26,-36],[61,2],[60,19],[87,8],[89,-10],[6,-45],[-23,-72]] }, // Vidéo
  { on: true, folder: 3, pts: [[-27,-100],[13,-78],[30,-61],[117,-22],[115,-6],[104,0],[87,7],[89,-10],[2,-49],[-23,-73],[-34,-80]] }, // Eclectique Lab
  { on: true, folder: 4, pts: [[0,-113],[34,-98],[60,-73],[146,-35],[145,-19],[132,-13],[116,-7],[118,-23],[31,-62],[8,-84],[-6,-92]] }, // Contact
];

// ╔══════════════════════════════════════════════════════════════════╗
// ║  BOÎTE À OUTILS — activer/désactiver selon les besoins          ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  DEBUG_ZONES      : affiche les hitboxes colorées + overlay      ║
// ║                     Clic hors hitbox → copie "X Y" presse-papier ║
// ║  DEBUG_OPEN_SHEET : clic gauche sur une hitbox → ouvre la fiche  ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  NEXT_SHEET_PEEK  : pixels visibles de la feuille suivante       ║
// ║                     au-dessus de la fiche active                 ║
// ╚══════════════════════════════════════════════════════════════════╝
const DEBUG_ZONES      = false; // ← mettre true pour activer
const DEBUG_OPEN_SHEET = true;  // ← ouvrir la fiche au clic (si DEBUG_ZONES = true)

const NEXT_SHEET_PEEK    = 28; // px visibles de la feuille suivante au-dessus de la fiche active
const NEXT_SHEET_OFFSET_X =  5; // décalage horizontal de la feuille suivante (px vers la droite)

// ── Son froissement de papier ────────────────────────────────────────────────
function playRustle() {
  try {
    if (!soundCtx) soundCtx = new (window.AudioContext || window.webkitAudioContext)();
    let ctx      = soundCtx;
    let duration = 0.18;
    let bufSize  = ctx.sampleRate * duration;
    let buffer   = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    let data     = buffer.getChannelData(0);

    // Bruit blanc avec enveloppe (fade in rapide, fade out lent)
    for (let i = 0; i < bufSize; i++) {
      let env = i < bufSize * 0.1
        ? i / (bufSize * 0.1)
        : 1 - (i - bufSize * 0.1) / (bufSize * 0.9);
      data[i] = (Math.random() * 2 - 1) * env * 0.048;
    }

    // Filtre passe-bas pour adoucir (papier = fréquences basses/moyennes)
    let source  = ctx.createBufferSource();
    source.buffer = buffer;
    let filter  = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 0.8;
    let gain    = ctx.createGain();
    gain.gain.value = 0.18;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } catch(e) {}
}

// ── Mise en page responsive ───────────────────────────────────────────────────
// Mode compact = téléphone ou fenêtre étroite : fiches plein écran, une colonne
function isCompact() {
  return width < 700;
}

// Échelle du carton (et de ses zones de survol) pour qu'il tienne à l'écran
function cartonScale() {
  return min(1, width / 400, (height - 150) / IMG_H);
}

// Taille de texte adaptée à la fenêtre
function fs(size) {
  return size * constrain(min(width / 1280, height / 800), 0.85, 1);
}

function easeInOut(t) {
  return t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
}

// Polyfill roundRect pour Safari < 15.4 et anciens Android
function ctxRoundRect(ctx, x, y, w, h, r) {
  r = min(r, w / 2, h / 2);
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y,     x + w, y + r,     r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x,     y + h, x,     y + h - r, r);
  ctx.lineTo(x,     y + r);
  ctx.arcTo(x,     y,     x + r, y,         r);
  ctx.closePath();
}

// Détection point dans polygone (ray casting) — pour les zones non rectangulaires
function pointInPoly(px, py, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    let xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
    if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi))
      inside = !inside;
  }
  return inside;
}

// Retourne les dimensions réelles (w, h) et le décalage vertical (cy) de chaque fiche à e=1
function getSheetDims(i) {
  if (isCompact()) return { w: width - 24, h: height - 76, cy: 22 };
  if (i === 0) return { w: min(width*0.78, 900), h: min(height*0.84, 720), cy: -20 };
  if (i === 4) return { w: min(width*0.82, 960), h: min(height*0.88, 760), cy: -20 };
  return            { w: min(width*0.88, 1020), h: min(height*0.88, 760), cy: -10 };
}

// Position (cx, cy) et taille (fw, fh) de la fiche i selon l'avancement de l'ouverture
function sheetGeom(i) {
  let e  = easeInOut(sheetProgress);
  let sd = getSheetDims(i);
  return {
    e,
    cx: lerp(map(i, 0, N-1, -IMG_W*0.1,  IMG_W*0.15), 0,     e),
    cy: lerp(map(i, 0, N-1, -IMG_H*0.15, IMG_H*0.1),  sd.cy, e),
    fw: lerp(180, sd.w, e),
    fh: lerp(200, sd.h, e)
  };
}

// Ombre + fond de la fiche (à appeler après translate(cx, cy))
function drawSheetBase(g, col, withShadow = true) {
  let { e, fw, fh } = g;
  if (withShadow && e > 0.1) {
    noStroke(); fill(0,0,0, e*80);
    rect(-fw/2+12, -fh/2+12, fw, fh, 12);
  }
  strokeWeight(2.5); stroke(42,31,15);
  fill(col[0], col[1], col[2]);
  rect(-fw/2, -fh/2, fw, fh, lerp(4,10,e));
}

// Titre de fiche + filet dessous ; renvoie la position y du filet
function drawSheetTitle(label, fw, fh, pad, a, size) {
  noStroke(); fill(42,28,10, a);
  textAlign(LEFT, TOP); textStyle(BOLD); textSize(size);
  text(label, -fw/2+pad, -fh/2+pad);
  let ly = -fh/2 + pad + size + 12;
  stroke(42,28,10, a*0.3); strokeWeight(1.4);
  line(-fw/2+pad, ly, fw/2-pad, ly);
  return ly;
}

// Bouton ✕ : visible en mode compact ; sur ordinateur la zone reste cliquable mais invisible
function drawCloseButton(fw, fh, a) {
  let x = fw/2 - 22, y = -fh/2 + 22;
  addHit('close', x - 22, y - 22, 44, 44);
  if (!isCompact()) return;
  noStroke(); fill(250,247,240, a*0.85);
  circle(x, y, 30);
  stroke(42,28,10, a*0.8); strokeWeight(2);
  line(x-5, y-5, x+5, y+5);
  line(x+5, y-5, x-5, y+5);
}

// Bouton « ← Retour » de la page détail
function drawBackButton(fw, fh, pad, da, tc) {
  let x = -fw/2 + pad, y = -fh/2 + pad + 10;
  let hov = mouseIn(x - 10, y - 16, 140, 32);
  addHit('back', x - 10, y - 16, 140, 32);
  noStroke(); fill(tc[0], tc[1], tc[2], hov ? da : da*0.65);
  textAlign(LEFT, CENTER); textStyle(hov ? BOLD : NORMAL); textSize(hov ? 14 : 13);
  text(t('back'), x, y);
}

// ── Zones cliquables ──────────────────────────────────────────────────────────
// Enregistrées pendant le dessin (converties en coordonnées écran), testées au
// clic ou au tap : les zones correspondent toujours exactement à ce qui est affiché.
let hitZones = [];

function toScreen(x, y, w, h) {
  let m = drawingContext.getTransform(), d = pixelDensity();
  return { x: (m.a*x + m.e)/d, y: (m.d*y + m.f)/d, w: m.a*w/d, h: m.d*h/d };
}

function addHit(type, x, y, w, h, data) {
  hitZones.push(Object.assign(toScreen(x, y, w, h), { type, data }));
}

function hitAt(px, py) {
  for (let i = hitZones.length - 1; i >= 0; i--) {
    let z = hitZones[i];
    if (px >= z.x && px <= z.x + z.w && py >= z.y && py <= z.y + z.h) return z;
  }
  return null;
}

// Souris dans le rectangle (coordonnées locales du dessin en cours)
function mouseIn(x, y, w, h) {
  let r = toScreen(x, y, w, h);
  return mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h;
}

// ── Défilement ────────────────────────────────────────────────────────────────
// Borne le scroll de la grille ; renvoie le scroll maximum
function clampGridScroll(contentH, visH) {
  let m = max(0, contentH - visH);
  gridScrollTarget = constrain(gridScrollTarget, 0, m);
  gridScrollY      = constrain(gridScrollY,      0, m);
  return m;
}

function drawScrollbar(x, top, visH, contentH, scrollY, a) {
  let tH = max(30, visH * visH / contentH);
  let tY = top + (scrollY / (contentH - visH)) * (visH - tH);
  noStroke(); fill(42,28,10, a*0.12);
  rect(x, top, 4, visH, 2);
  fill(42,28,10, a*0.35);
  rect(x, tY, 4, tH, 2);
}

// Nombre de lignes après retour à la ligne automatique (même logique que textWrap(WORD))
function countLines(str, w) {
  let n = 0;
  for (let para of str.split('\n')) {
    let line = '';
    n++;
    for (let word of para.split(' ')) {
      let test = line ? line + ' ' + word : word;
      if (line && textWidth(test) > w) { n++; line = word; }
      else line = test;
    }
  }
  return n;
}

// Texte long dans une zone fixe, défilable (textScrollY) s'il dépasse
// (taille, style et couleur du texte à régler avant l'appel)
function drawScrollText(str, x, y, w, h, leading, a) {
  textAlign(LEFT, TOP); textLeading(leading); textWrap(WORD);
  let contentH = countLines(str, w) * leading;
  let maxS = max(0, contentH - h);
  textScrollTarget = constrain(textScrollTarget, 0, maxS);
  textScrollY      = constrain(textScrollY,      0, maxS);
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(x - 2, y - 6, w + 4, h + 6);
  drawingContext.clip();
  text(str, x, y - textScrollY, w);
  drawingContext.restore();
  if (maxS > 0) drawScrollbar(x + w + 6, y, h, contentH, textScrollY, a);
}

// Coupe le texte avec « … » s'il dépasse w (taille et style courants)
function fitText(str, w) {
  if (textWidth(str) <= w) return str;
  while (str.length > 1 && textWidth(str + '…') > w) str = str.slice(0, -1);
  return str.trimEnd() + '…';
}

// ── Page détail (Projets, Eclectique Lab) ─────────────────────────────────────
// Format du média : vidéo 16:9 ou 9:16, sinon image 4:3
function detailRatio(p) {
  if (!p.preview) return 4/3;
  return p.ratio === '9/16' ? 9/16 : 16/9;
}

// Zones média + infos (repère centré sur la fiche).
// Ordinateur : deux colonnes (split = part du média). Compact : média en haut, infos dessous.
function detailLayout(fw, fh, split, ratio) {
  if (isCompact()) {
    let pad = 16, w = fw - pad*2;
    let top = -fh/2 + pad + 30;                   // sous « ← Retour »
    let mh  = min(w / ratio, fh * 0.42);
    let iy  = top + mh + 28;                      // place pour les points du carousel
    return { pad,
             media: { x: -fw/2 + pad, y: top, w, h: mh },
             info:  { x: -fw/2 + pad, y: iy,  w, h: fh/2 - pad - iy } };
  }
  let pad = 36, avail = fw - pad*3;
  let colY = -fh/2 + pad + 40, colH = fh - pad*2 - 40;
  let mw = avail * split;
  return { pad,
           media: { x: -fw/2 + pad,          y: colY, w: mw,         h: colH },
           info:  { x: -fw/2 + pad*2 + mw,   y: colY, w: avail - mw, h: colH } };
}

// Colonne d'infos : titre (lien éventuel), champs [libellé, valeur], description défilable
// pal = { tc, sc } : couleurs [r,g,b] du texte principal et secondaire
function drawDetailInfo(box, titre, fields, desc, da, pal, lien) {
  titre = tr(titre);
  desc  = tr(desc);
  let compact = isCompact();
  let { x, y, w, h } = box;
  let tc = pal.tc, sc = pal.sc;
  let iy = y + (compact ? 0 : 10);

  // Titre (cliquable si lien)
  let ts = compact ? 20 : 26;
  noStroke(); fill(tc[0], tc[1], tc[2], da);
  textAlign(LEFT, TOP); textStyle(BOLD); textSize(ts); textWrap(WORD);
  text(titre, x, iy, w, compact ? 52 : 80);
  if (lien) {
    addHit('link', x, iy, w, 40, lien);
    if (mouseIn(x, iy, w, 40)) {
      stroke(tc[0], tc[1], tc[2], da*0.7); strokeWeight(1.5);
      line(x, iy + ts + 6, x + min(textWidth(titre), w), iy + ts + 6);
    }
  }

  // Filet
  let lineY = iy + (compact ? 54 : 70);
  stroke(tc[0], tc[1], tc[2], da*0.2); strokeWeight(1);
  line(x, lineY, x + w, lineY);

  // Champs : empilés (ordinateur) ou côte à côte (compact)
  for (let k = 0; k < fields.length; k++) {
    let fx = compact ? x + k * w/2 : x;
    let fy = compact ? lineY + 12 : lineY + 14 + k * 46;
    noStroke(); fill(sc[0], sc[1], sc[2], da);
    textStyle(NORMAL); textSize(12);
    text(fields[k][0], fx, fy);
    fill(tc[0], tc[1], tc[2], da);
    textStyle(BOLD); textSize(14);
    text(fitText(fields[k][1], compact ? w/2 - 8 : w), fx, fy + 16);
  }

  // Description
  let dly = compact ? lineY + 50 : lineY + 14 + fields.length * 46;
  noStroke(); fill(sc[0], sc[1], sc[2], da);
  textStyle(NORMAL); textSize(12);
  text(t('description'), x, dly);
  fill(tc[0], tc[1], tc[2], da);
  textSize(13);
  drawScrollText(desc, x, dly + 18, w, y + h - (dly + 18), 20, da);
}

// Projet ouvert en page détail (ou null)
function currentDetailProject() {
  if (activeFolder === 1 && graphismeSelected  >= 0) return GRAPHISME_PROJETS[graphismeSelected];
  if (activeFolder === 3 && eclectiqueSelected >= 0) return ECLECTIQUE_PROJETS[eclectiqueSelected];
  return null;
}

// Projets du filtre actif, triés du plus récent au plus ancien
function getGraphismeProjets() {
  return GRAPHISME_PROJETS
    .filter(p => graphismeCategory === 'Tous' || p.categorie === graphismeCategory)
    .sort((a, b) => parseInt(b.annee) - parseInt(a.annee));
}

// ── Preload ───────────────────────────────────────────────────────────────────
function preload() {
  cartonImg = loadImage('assets/carton.png');
  loadImage('assets/cv.jpg',      img => { cvImg      = shrink(img, 1600); }, () => {});
  loadImage('assets/apropos.jpg', img => { aproposImg = shrink(img, 1200); }, () => {});

  for (let i = 0; i < N; i++) {
    imgs[i] = loadImage('assets/dossier_' + i + '.png');
  }
}

// ── Setup ─────────────────────────────────────────────────────────────────────
function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.elt.style.touchAction = 'none'; // empêche le scroll natif sur le canvas
  setupTouch(cnv.elt);
  document.documentElement.lang = lang;
  if (lang === 'en') loadEnglishImages();
  document.fonts.load('400 16px PPFormula').then(() => textFont('PPFormula'));
  document.fonts.load('700 16px PPFormula').then(() => textFont('PPFormula'));
  textFont('PPFormula');
  displayAlpha[N] = 255;
  createSocialIcons();
  // Miniatures Projets (première image ou miniature YouTube), chargées sans bloquer.
  // Les images des carrousels ne sont chargées qu'à l'ouverture du projet (loadCarousel).
  for (let i = 0; i < GRAPHISME_PROJETS.length; i++) {
    let p    = GRAPHISME_PROJETS[i];
    let ytId = p.preview && getYTId(p.preview);
    let src  = p.imgs ? p.imgs[0] : ytId ? 'https://img.youtube.com/vi/' + ytId + '/mqdefault.jpg' : null;
    graphismeImgs[i] = null;
    graphismeCarouselImgs[i] = [];
    if (src) loadImage(src, img => { graphismeImgs[i] = shrink(img, 800); }, () => {});
  }

  // Images Eclectique Lab
  for (let i = 0; i < ECLECTIQUE_PROJETS.length; i++) {
    let src = ECLECTIQUE_PROJETS[i].img;
    eclectiqueImgs[i] = null;
    if (src) loadImage(src, img => { eclectiqueImgs[i] = shrink(img, 1000); }, () => {});
  }

  // Miniatures YouTube
  for (let i = 0; i < VIDEO_PROJETS.length; i++) {
    let id = getYTId(VIDEO_PROJETS[i].preview);
    videoThumbs[i] = null;
    if (id) loadImage('https://img.youtube.com/vi/' + id + '/mqdefault.jpg', img => { videoThumbs[i] = img; }, () => {});
  }
}

// Charge (une seule fois, à la première utilisation de l'anglais) les images anglaises
function loadEnglishImages() {
  if (englishImagesRequested) return;
  englishImagesRequested = true;
  loadImage('assets/carton_en.png', img => { cartonImgEn = img; }, () => {});
  for (let i = 0; i < N; i++)
    loadImage('assets/dossier_' + i + '_en.png', img => { imgsEn[i] = img; }, () => {});
}

// Réduit une image trop large (mémoire et vitesse d'affichage, surtout sur téléphone)
function shrink(img, maxW) {
  if (img.width > maxW) img.resize(maxW, 0);
  return img;
}

// Charge une seule fois les images du carrousel d'un projet (les vidéos, PDF et liens
// Instagram du carrousel sont affichés en iframe, pas chargés comme images)
function loadCarousel(idx) {
  let p = GRAPHISME_PROJETS[idx];
  if (!p.imgs || graphismeCarouselImgs[idx].length) return;
  p.imgs.forEach((src, j) => {
    graphismeCarouselImgs[idx][j] = null;
    if (/\.(jpe?g|png|gif|webp)$/i.test(src))
      loadImage(src, img => { graphismeCarouselImgs[idx][j] = shrink(img, 1400); }, () => {});
  });
}

function createSocialIcons() {
  // Conteneur icônes sociales
  let div = createElement('div');
  div.id('social-icons');
  div.style('position', 'fixed');
  div.style('bottom', '18px');
  div.style('left', '50%');
  div.style('transform', 'translateX(-50%)');
  div.style('display', 'flex');
  div.style('gap', '18px');
  div.style('z-index', '1');

  // LinkedIn
  socialLink(div, 'https://www.linkedin.com/in/th%C3%A9o-lahaye/', '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>');

  // Instagram
  socialLink(div, 'https://www.instagram.com/eclectique_lab/', '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>');

  div.parent(document.body);

  // Bouton langue : affiche la langue vers laquelle on bascule
  let langBtn = createElement('button');
  langBtn.id('lang-btn');
  langBtn.attribute('aria-label', 'Changer de langue / Switch language');
  langBtn.style('background', 'none');
  langBtn.style('border', 'none');
  langBtn.style('cursor', 'pointer');
  langBtn.style('padding', '0');
  langBtn.style('width', '36px');
  langBtn.style('height', '36px');
  langBtn.style('font-family', 'PPFormula, sans-serif');
  langBtn.style('font-weight', '700');
  langBtn.style('font-size', '14px');
  langBtn.style('letter-spacing', '0.04em');
  langBtn.style('color', 'rgba(60,40,20,0.8)');
  langBtn.html(lang === 'fr' ? 'EN' : 'FR');
  langBtn.mousePressed(() => {
    setLang(lang === 'fr' ? 'en' : 'fr');
    langBtn.html(lang === 'fr' ? 'EN' : 'FR');
  });
  langBtn.parent(div);

  // Bouton thème soleil/lune
  let themeBtn = createElement('button');
  themeBtn.id('theme-btn');
  themeBtn.style('background', 'none');
  themeBtn.style('border', 'none');
  themeBtn.style('cursor', 'pointer');
  themeBtn.style('padding', '0');
  themeBtn.style('width', '36px');
  themeBtn.style('height', '36px');
  themeBtn.style('display', 'flex');
  themeBtn.style('align-items', 'center');
  themeBtn.style('justify-content', 'center');
  themeBtn.style('opacity', '0.7');
  themeBtn.style('transition', 'opacity 0.2s');
  updateThemeIcon(themeBtn);
  easterEggAudio = new Audio('assets/music.mp3');
  easterEggAudio.loop = true;

  themeBtn.mousePressed(() => {
    darkMode = !darkMode;
    updateThemeIcon(themeBtn);
    setIconColor(darkMode ? 'rgba(200,185,160,0.8)' : 'rgba(60,40,20,0.8)');

    themeBtnClickCount++;
    if (themeBtnClickCount === 20) {
      easterEggAudio.currentTime = 0;
      easterEggAudio.play();
      easterEggActive = true;
      easterEggBtn.style('display', 'flex');
      updateEasterEggIcon(easterEggBtn);
    }
  });
  themeBtn.parent(div);

  // Bouton play/pause easter egg (caché jusqu'au déclenchement)
  let easterEggBtn = createElement('button');
  easterEggBtn.style('background', 'none');
  easterEggBtn.style('border', 'none');
  easterEggBtn.style('cursor', 'pointer');
  easterEggBtn.style('padding', '0');
  easterEggBtn.style('width', '36px');
  easterEggBtn.style('height', '36px');
  easterEggBtn.style('display', 'none');
  easterEggBtn.style('align-items', 'center');
  easterEggBtn.style('justify-content', 'center');
  easterEggBtn.style('opacity', '0.7');
  easterEggBtn.style('transition', 'opacity 0.2s');
  easterEggBtn.mousePressed(() => {
    if (easterEggAudio.paused) {
      easterEggAudio.play();
      easterEggActive = true;
    } else {
      easterEggAudio.pause();
      easterEggActive = false;
    }
    updateEasterEggIcon(easterEggBtn);
  });
  easterEggBtn.parent(div);


}

// Lien icône (svgPaths = contenu du <svg> 24×24)
function socialLink(parent, href, svgPaths) {
  let a = createElement('a');
  a.attribute('href', href);
  a.attribute('target', '_blank');
  a.style('display', 'flex');
  a.style('align-items', 'center');
  a.style('justify-content', 'center');
  a.style('width', '36px');
  a.style('height', '36px');
  a.html('<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="rgba(60,40,20,0.8)">' + svgPaths + '</svg>');
  a.parent(parent);
}

// Couleur des icônes du bas (SVG + bouton langue)
function setIconColor(c) {
  document.querySelectorAll('#social-icons svg').forEach(s => s.setAttribute('fill', c));
  let lb = document.getElementById('lang-btn');
  if (lb) lb.style.color = c;
}

function updateEasterEggIcon(btn) {
  let c = darkMode ? 'rgba(200,185,160,0.85)' : 'rgba(60,40,20,0.85)';
  if (easterEggAudio && !easterEggAudio.paused) {
    btn.html(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${c}"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`);
  } else {
    btn.html(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${c}"><polygon points="5,3 19,12 5,21"/></svg>`);
  }
}

function updateThemeIcon(btn) {
  if (darkMode) {
    // Icône soleil
    btn.html('<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="rgba(200,185,160,0.85)" stroke="rgba(200,185,160,0.85)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5" stroke="none"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>');
  } else {
    // Icône lune
    btn.html('<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="rgba(60,40,20,0.85)"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>');
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Garder l'état de l'intro lors du resize
  if (introLanded) {
    introY  = 0;
    introVY = 0;
  }
  // Replacer l'aperçu vidéo (rotation du téléphone, redimensionnement)
  let p = currentDetailProject();
  if (previewFrame && p && p.preview) showPreviewFrame(p.preview, p.ratio);
}

// ── Draw ──────────────────────────────────────────────────────────────────────
function draw() {
  hitZones = [];

  if (easterEggActive) {
    background(floor(millis() / 500) % 2 === 0 ? color(255) : color(0));
  } else {
    background(darkMode ? color(26,20,16) : color(245,242,235));
  }

  // Grain léger (points aléatoires semi-transparents, plus rapide que loadPixels)
  if (!introLanded || sheetProgress < 0.1) {
    noStroke();
    for (let k = 0; k < 400; k++) {
      let x = random(width), y = random(height);
      let v = random(180, 220);
      fill(v, v, v, random(8, 22));
      rect(x, y, 1.5, 1.5);
    }
  }

  // ── Physique rebond intro ──────────────────────────────────────────────────
  if (!introLanded && !introPlayed) {
    let gravity = 4.5;
    let bounce  = 0.45;
    introVY += gravity;
    introY  += introVY;
    if (introY >= 0) {
      introY  = 0;
      introVY = -introVY * bounce;
      if (abs(introVY) < 2.5) {
        introVY     = 0;
        introY      = 0;
        introLanded = true;
        introPlayed = true;
        sessionStorage.setItem('introPlayed', '1');
      }
    }
  }

  // Masquer les icônes sociales quand une fiche est ouverte
  let socialDiv = document.getElementById('social-icons');
  if (socialDiv) socialDiv.style.opacity = sheetProgress > 0.3 ? '0' : '1';

  sheetProgress  = lerp(sheetProgress,  sheetTarget,       0.25);
  detailProgress = lerp(detailProgress, detailTarget,      0.12);
  gridScrollY    = lerp(gridScrollY,    gridScrollTarget, 0.12);
  textScrollY    = lerp(textScrollY,    textScrollTarget, 0.12);

  // ── Alphas images ──────────────────────────────────────────────────────────
  for (let i = 0; i < N; i++) {
    let target = 0;
    if (sheetTarget < 0.5) {
      if (i === hovered) target = 255;
    } else {
      if (i === activeFolder) target = 255;
    }
    displayAlpha[i] = target;
  }
  // Carton = inverse du dossier le plus visible
  let maxFA = 0;
  for (let i = 0; i < N; i++) maxFA = max(maxFA, displayAlpha[i]);
  displayAlpha[N] = 255 - maxFA;

  // ── Dessin ────────────────────────────────────────────────────────────────
  let cs = cartonScale();

  // Ombre portée sous le carton (disparaît une fois posé)
  if (!introLanded) {
    let shadowScale = map(introY, -800, 0, 0.05, 0.5) * cs;
    let shadowAlpha = map(introY, -800, 0, 0, 45);
    noStroke(); fill(0, 0, 0, shadowAlpha);
    ellipse(width/2, height/2 + IMG_H*0.48*cs, IMG_W * shadowScale, 14 * shadowScale);
  }

  push();
  translate(width/2, height/2 + introY);
  scale(cs);
  imageMode(CENTER);

  if (displayAlpha[N] > 1) {
    tint(255, displayAlpha[N]);
    image((lang === 'en' && cartonImgEn) || cartonImg, 0, 0, IMG_W, IMG_H);
  }

  // Avance le dossier bouncing easter egg toutes les 0.2s
  if (easterEggActive && sheetTarget < 0.5 && millis() - easterEggLastSwitch > 200) {
    easterEggFolderIdx = (easterEggFolderIdx + 1) % N;
    easterEggLastSwitch = millis();
  }

  // Dossier survolé par-dessus tout
  for (let i = 0; i < N; i++) {
    let alpha = displayAlpha[i];
    let yOff = 0;
    if (easterEggActive && sheetTarget < 0.5 && i === easterEggFolderIdx) {
      alpha = 255;
      yOff = -18;
    }
    if (alpha > 1) {
      push();
      translate(0, yOff);
      tint(255, alpha);
      image((lang === 'en' && imgsEn[i]) || imgs[i], 0, 0, IMG_W, IMG_H);
      pop();
    }
  }
  noTint();

  pop();

  // Overlay sombre + feuille suivante + feuille active
  if (sheetProgress > 0.05) {
    // 1. Overlay
    noStroke(); fill(0, 0, 0, sheetProgress * 160);
    rect(0, 0, width, height);

    // 2. Feuille suivante en arrière-plan (cliquable)
    if (sheetProgress > 0.8 && activeFolder < N - 1) {
      let nextI   = activeFolder + 1;
      let nextCol = sections[nextI].color;
      let sd      = getSheetDims(activeFolder);
      let offY    = sd.cy - NEXT_SHEET_PEEK;
      push();
      translate(width/2 + NEXT_SHEET_OFFSET_X, height/2 + offY);
      noStroke(); fill(0,0,0,50);
      rect(-sd.w/2+10, -sd.h/2+10, sd.w, sd.h, 10);
      strokeWeight(2); stroke(42,31,15);
      fill(nextCol[0], nextCol[1], nextCol[2]);
      rect(-sd.w/2, -sd.h/2, sd.w, sd.h, 10);
      noStroke(); fill(42,28,10,200);
      textAlign(LEFT,TOP); textStyle(BOLD); textSize(20);
      text(tr(sections[nextI].title), -sd.w/2 + (isCompact() ? 16 : 40), -sd.h/2+30);
      pop();
    }

    // 3. Feuille active par-dessus
    push(); translate(width/2, height/2);
    drawAnimatedSheet(activeFolder);
    pop();
  }

  drawDebugZones();

  // Label survol
  if (sheetProgress < 0.1 && hovered >= 0 && introLanded) drawHoverLabel(hovered);

  // Curseur main sur les éléments cliquables (le ✕ invisible sur ordinateur n'en a pas)
  let z = sheetProgress > 0.5 ? hitAt(mouseX, mouseY) : null;
  cursor(z && (z.type !== 'close' || isCompact()) ? HAND : ARROW);

  // Sync couleur icônes sociales avec le clignotement easter egg (seulement au changement)
  if (easterEggActive) {
    let flashWhiteIcons = floor(millis() / 500) % 2 === 0 ? 1 : 0;
    if (flashWhiteIcons !== easterEggLastFlash) {
      easterEggLastFlash = flashWhiteIcons;
      let iconFill = flashWhiteIcons ? 'rgba(42,28,10,0.8)' : 'rgba(200,185,160,0.8)';
      setIconColor(iconFill);
    }
  }
}

// ── Label au survol ───────────────────────────────────────────────────────────
function drawHoverLabel(i) {
  let sec = sections[i];
  // Au dessus du carton, centré
  let lx = width/2;
  let ly = height/2 - IMG_H*cartonScale()/2 - (isCompact() ? 24 : 42);
  noStroke();
  fill(darkMode ? color(220, 205, 175) : color(60, 40, 20));
  textAlign(CENTER, CENTER);
  textSize(16); textStyle(BOLD);
  text(tr(sec.label), lx, ly);
}

// ── Feuille animée ────────────────────────────────────────────────────────────
function drawAnimatedSheet(i) {
  if (i < 0) return;
  [drawAproposSheet, drawGraphismeSheet, drawVideoSheet, drawEclectiqueSheet, drawContactSheet][i]();
}

// ── Feuille Contact ──────────────────────────────────────────────────────────
function drawContactSheet() {
  let sec = sections[4];
  let g = sheetGeom(4);
  let { e, cx, cy, fw, fh } = g;

  push(); translate(cx, cy);

  drawSheetBase(g, sec.color);

  if (e > 0.72) {
    let a   = map(e, 0.72, 1.0, 0, 255);
    let pad = isCompact() ? 16 : 36;
    let ts  = isCompact() ? 20 : fs(26);

    // Titre
    noStroke(); fill(42,28,10, a);
    textAlign(LEFT, TOP); textStyle(BOLD); textSize(ts);
    text(tr(sec.title), -fw/2+pad, -fh/2+pad);

    // Séparateur
    let ly = -fh/2 + pad + ts + 14;
    stroke(42,28,10, a*0.35); strokeWeight(1.4);
    line(-fw/2+pad, ly, fw/2-pad, ly);

    // Zone CV : occupe toute la hauteur disponible sous le titre
    let cvY  = ly + 12;
    let cvH  = fh/2 - pad - cvY;
    let cvW  = fw - pad*2;

    if (cvImg) {
      let ratio = cvImg.width / cvImg.height;
      let dispW = min(cvW, cvH * ratio);
      let dispH = dispW / ratio;
      let ix = -dispW / 2;
      let iy = cvY + (cvH - dispH) / 2;

      noStroke(); fill(0,0,0, a*0.2);
      rect(ix+5, iy+5, dispW, dispH, 6);

      drawingContext.save();
      drawingContext.beginPath();
      ctxRoundRect(drawingContext, ix, iy, dispW, dispH, 6);
      drawingContext.clip();
      tint(255, a);
      image(cvImg, ix, iy, dispW, dispH);
      noTint();
      drawingContext.restore();

      // Ouvrir le CV en grand (indispensable sur téléphone pour le lire)
      addHit('link', ix, iy, dispW, dispH, 'assets/cv.jpg');
      if (isCompact()) {
        noStroke(); fill(42,28,10, a*0.7);
        textAlign(CENTER, TOP); textStyle(NORMAL); textSize(12);
        text(t('cvHint'), 0, iy + dispH + 14);
      }
    } else {
      noStroke(); fill(0,0,0, a*0.12);
      rect(-cvW/2, cvY, cvW, cvH, 8);
    }

    drawCloseButton(fw, fh, a);
  }

  pop();
}

// ── Feuille À propos ─────────────────────────────────────────────────────────
const APROPOS_BIO = {
  fr: "Je m'appelle Theo, et je crée sous le nom d'Eclectique Lab. " +
      "Basé à Besançon, j'explore le graphisme et la vidéo comme des façons de raconter " +
      "et d'expérimenter. Ma passion a commencé enfant, en construisant des mondes avec des " +
      "LEGO ou sur Minecraft. Puis tout s'est accéléré quand mon père m'a initié à Photoshop, " +
      "qui m'a permis de découvrir une nouvelle façon de créer.\n\n" +
      "J'aime mélanger les supports, jouer avec les textures et faire dialoguer image, son et lumière. " +
      "Mes inspirations sont variées, allant de la musique à la nature, et incluent des créateurs " +
      "comme Virgil Abloh, l'une de mes plus grandes inspirations.",
  en: "My name is Theo, and I create under the name Eclectique Lab. " +
      "Based in Besançon, I explore graphic design and video as ways of telling stories " +
      "and experimenting. My passion started as a child, building worlds with " +
      "LEGO or in Minecraft. Then everything sped up when my father introduced me to Photoshop, " +
      "which showed me a whole new way of creating.\n\n" +
      "I love mixing media, playing with textures and making image, sound and light talk to each other. " +
      "My inspirations are varied, from music to nature, and include creators " +
      "such as Virgil Abloh, one of my greatest inspirations."
};

function drawAproposSheet() {
  let g = sheetGeom(0);
  let { e, cx, cy, fw, fh } = g;

  push(); translate(cx, cy);

  drawSheetBase(g, sections[0].color);

  if (e > 0.72) {
    let a       = map(e, 0.72, 1.0, 0, 255);
    let compact = isCompact();
    let pad     = compact ? 16 : 40;
    let tc      = color(42,28,10,a);
    let sc      = color(80,60,35,a);

    // Photo à gauche + texte à droite (ordinateur), photo en haut + texte dessous (compact)
    let photo, tx, ty, tw;
    if (compact) {
      let w = fw - pad*2;
      photo = { x: -fw/2 + pad, y: -fh/2 + pad, w, h: min(w * 0.75, fh * 0.32) };
      tx = photo.x; ty = photo.y + photo.h + 16; tw = w;
    } else {
      let colW = (fw - pad*3) / 2;
      photo = { x: -fw/2 + pad, y: -fh/2 + pad, w: colW, h: fh - pad*2 };
      tx = -fw/2 + pad*2 + colW; ty = photo.y; tw = colW;
    }

    // ── Photo ──
    if (aproposImg) {
      // Recadrage cover
      let iw = aproposImg.width, ih = aproposImg.height;
      let sc2 = max(photo.w / iw, photo.h / ih);
      let sw = photo.w / sc2, sh = photo.h / sc2;
      let sx = (iw - sw) / 2, sy = (ih - sh) / 2;
      // Clipper avec un rect arrondi via drawingContext
      drawingContext.save();
      drawingContext.beginPath();
      ctxRoundRect(drawingContext, photo.x, photo.y, photo.w, photo.h, 10);
      drawingContext.clip();
      tint(255, a);
      image(aproposImg, photo.x, photo.y, photo.w, photo.h, sx, sy, sw, sh);
      noTint();
      drawingContext.restore();
    } else {
      noStroke(); fill(200,185,160, a*0.3);
      rect(photo.x, photo.y, photo.w, photo.h, 10);
      fill(tc); textAlign(CENTER,CENTER); textSize(12); textStyle(NORMAL);
      text("photo", photo.x+photo.w/2, photo.y+photo.h/2);
    }

    // ── Texte ──
    // Titre
    noStroke(); fill(tc);
    textAlign(LEFT, TOP); textStyle(BOLD); textSize(compact ? 24 : 28);
    text(t('about'), tx, ty);

    // Sous-titre
    fill(sc);
    textStyle(NORMAL); textSize(13);
    text("Besançon - Belfort", tx, ty + (compact ? 32 : 38));

    // Ligne
    let ly = ty + (compact ? 52 : 58);
    stroke(42,28,10, a*0.2);
    strokeWeight(1.2);
    line(tx, ly, tx + tw, ly);

    // Bio (défilable si elle dépasse)
    noStroke(); fill(tc);
    textStyle(NORMAL); textSize(13);
    drawScrollText(tr(APROPOS_BIO), tx, ly + 12, tw, fh/2 - pad - (ly + 12), compact ? 20 : 22, a);

    drawCloseButton(fw, fh, a);
  }

  pop();
}

// ── Feuille Vidéo : grille de vidéos ─────────────────────────────────────────
let videoIndex      = 0;    // index vidéo active
let videoFrame      = null; // iframe vidéo
let videoThumbs     = [];   // miniatures YouTube

function getYTId(url) {
  let m = url.match(/embed\/([^?]+)/);
  return m ? m[1] : null;
}

function drawVideoSheet() {
  let g = sheetGeom(2);
  let { e, cx, cy, fw, fh } = g;

  push(); translate(cx, cy);

  drawSheetBase(g, sections[2].color);

  if (e > 0.75) {
    let a       = map(e, 0.75, 1.0, 0, 255);
    let compact = isCompact();
    let pad     = compact ? 16 : 32, gpad = 16;
    let sc      = color(90,70,45,a);

    let lineY = drawSheetTitle(tr(sections[2].title), fw, fh, pad, a, compact ? 20 : fs(22));

    // Dimensions grille : mêmes blocs que Projets / Eclectique Lab (2 colonnes, 1 sur téléphone)
    let cols  = (compact && width < 520) ? 1 : 2;
    let cellW = (fw - pad*2 - gpad*(cols-1)) / cols;
    let cellH = cellW * 0.6;                   // zone vidéo
    let rowH  = cellH + 46 + gpad;             // vidéo + titre/desc + espace
    let gridTop    = lineY + 16;
    let gridBottom = fh/2 - pad;               // limite basse visible
    let visH  = gridBottom - gridTop;
    let totalH = ceil(VIDEO_PROJETS.length / cols) * rowH;
    let maxScroll = clampGridScroll(totalH, visH);

    // Clipping : masquer ce qui dépasse du cadre
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(-fw/2 + 1, gridTop, fw - 2, visH);
    drawingContext.clip();

    for (let idx = 0; idx < VIDEO_PROJETS.length; idx++) {
      let p   = VIDEO_PROJETS[idx];
      let vx  = -fw/2 + pad + (idx % cols) * (cellW + gpad);
      let vy  = gridTop + floor(idx / cols) * rowH - gridScrollY;

      // Ne pas dessiner les cellules hors zone visible
      if (vy + cellH + 46 < gridTop || vy > gridBottom) {
        if (idx === videoIndex) updateVideoFrame(vx, vy, cellW, cellH, cx, cy, gridTop, gridBottom, p, e);
        continue;
      }

      let isActive = (idx === videoIndex);
      let y0 = max(vy, gridTop), y1 = min(vy + cellH + 46, gridBottom);
      let isHov = mouseIn(vx, y0, cellW, y1 - y0);
      if (!isActive) addHit('video', vx, y0, cellW, y1 - y0, idx);

      // Fond fiche (comme Projets / Eclectique Lab) + fond vidéo + miniature
      noStroke();
      fill(255,255,255, a*0.85);
      rect(vx, vy, cellW, cellH + 46, 8);
      fill(0,0,0, a*0.8);
      rect(vx, vy, cellW, cellH, 8);
      if (videoThumbs[idx]) {
        drawingContext.save();
        drawingContext.beginPath();
        ctxRoundRect(drawingContext, vx, vy, cellW, cellH, 8);
        drawingContext.clip();
        // Miniature recadrée (cover) au format du bloc
        let img = videoThumbs[idx];
        let scale = max(cellW / img.width, cellH / img.height);
        let sw = cellW / scale, sh = cellH / scale;
        tint(255, a);
        image(img, vx, vy, cellW, cellH, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh);
        noTint();
        drawingContext.restore();
      }

      // Icône play au centre (si non actif)
      if (!isActive) {
        noStroke(); fill(0, 0, 0, a * 0.35);
        circle(vx + cellW/2, vy + cellH/2, 38);
        fill(255, 255, 255, a * 0.85);
        triangle(
          vx + cellW/2 - 7, vy + cellH/2 - 10,
          vx + cellW/2 - 7, vy + cellH/2 + 10,
          vx + cellW/2 + 12, vy + cellH/2
        );
      }

      // Bordure actif/hover
      if (isActive || isHov) {
        noFill(); stroke(42,28,10, isActive ? a*0.9 : a*0.4);
        strokeWeight(isActive ? 2.5 : 1.5);
        rect(vx, vy, cellW, cellH + 46, 8);
      }

      // Titre
      noStroke(); fill(isActive ? color(42,28,10,a) : color(42,28,10,a*0.6));
      textAlign(LEFT, TOP); textStyle(isActive ? BOLD : NORMAL); textSize(12);
      text(fitText(tr(p.titre), cellW - 20), vx + 10, vy + cellH + 6);

      // Description
      if (p.desc) {
        fill(sc); textStyle(NORMAL); textSize(10);
        text(fitText(tr(p.desc), cellW - 20), vx + 10, vy + cellH + 22);
      }

      // Iframe pour la vidéo active
      if (isActive) updateVideoFrame(vx, vy, cellW, cellH, cx, cy, gridTop, gridBottom, p, e);
    }

    drawingContext.restore();

    // Scrollbar indicateur (si contenu dépasse)
    if (maxScroll > 0) drawScrollbar(fw/2 - pad/2 - 3, gridTop, visH, totalH, gridScrollY, a);

    drawCloseButton(fw, fh, a);
  }

  pop();
}

// gridTop / gridBottom : limites visibles de la grille (repère de la fiche)
function updateVideoFrame(vidX, vidY, vidW, vidH, cx, cy, gridTop, gridBottom, p, e) {
  if (e < 0.9) { hideVideoFrame(); return; }

  // Masquer l'iframe si la vidéo est hors zone visible
  if (vidY + vidH < gridTop || vidY > gridBottom) {
    hideVideoFrame(); return;
  }

  let fx = width/2 + cx + vidX;
  let fy = height/2 + cy + vidY;

  // Calculer le clip CSS pour empêcher l'iframe de dépasser la grille
  let gridTopPx    = height/2 + cy + gridTop;
  let gridBottomPx = height/2 + cy + gridBottom;
  let clipTop    = max(0, gridTopPx - fy);
  let clipBottom = max(0, fy + vidH - gridBottomPx);
  let clipStr    = clipTop + 'px 0px ' + clipBottom + 'px 0px';

  if (!videoFrame || videoFrame._src !== p.preview) {
    hideVideoFrame();
    let wrapper = createElement('div');
    wrapper.style('position', 'fixed');
    wrapper.style('left',   fx + 'px');
    wrapper.style('top',    fy + 'px');
    wrapper.style('width',  vidW + 'px');
    wrapper.style('height', vidH + 'px');
    wrapper.style('border-radius', '8px');
    wrapper.style('overflow', 'hidden');
    wrapper.style('clip-path', 'inset(' + clipStr + ' round 8px)');
    wrapper.style('z-index', '50');
    wrapper.parent(document.body);

    let iframe = createElement('iframe');
    iframe.attribute('src', p.preview);
    iframe.attribute('allow', 'autoplay; encrypted-media');
    iframe.attribute('allowfullscreen', '');
    iframe.style('width',  vidW + 'px');
    iframe.style('height', vidH + 'px');
    iframe.style('border', 'none');
    iframe.parent(wrapper);

    videoFrame = wrapper;
    videoFrame._src = p.preview;
  } else {
    videoFrame.style('left',      fx + 'px');
    videoFrame.style('top',       fy + 'px');
    videoFrame.style('clip-path', 'inset(' + clipStr + ' round 8px)');
  }
}

function hideVideoFrame() {
  if (videoFrame) { videoFrame.remove(); videoFrame = null; }
}

function hideLocalVideoFrame() {
  if (localVideoFrame) { localVideoFrame.remove(); localVideoFrame = null; }
}

function hideCarouselPdfFrame() {
  if (carouselPdfFrame) { carouselPdfFrame.remove(); carouselPdfFrame = null; }
}

function hideFigmaFrame() {
  if (figmaFrame) { figmaFrame.remove(); figmaFrame = null; }
}

function hideInstagramFrame() {
  if (instagramFrame) { instagramFrame.remove(); instagramFrame = null; }
}

function updateFigmaFrame(px, py, pw, ph, cx, cy, src) {
  let fx = width/2 + cx + px;
  let fy = height/2 + cy + py;
  if (!figmaFrame || figmaFrame._src !== src) {
    hideFigmaFrame();
    let wrapper = createElement('div');
    wrapper.style('position', 'fixed');
    wrapper.style('overflow', 'hidden');
    wrapper.style('border-radius', '8px');
    wrapper.style('z-index', '50');
    wrapper.parent(document.body);
    let embedSrc = src.includes('figma.com')
      ? 'https://www.figma.com/embed?embed_host=share&url=' + encodeURIComponent(src)
      : src;
    let iframe = createElement('iframe');
    iframe.attribute('src', embedSrc);
    iframe.attribute('allowfullscreen', '');
    iframe.style('width',  '100%');
    iframe.style('height', '100%');
    iframe.style('border', 'none');
    iframe.parent(wrapper);
    figmaFrame = wrapper;
    figmaFrame._src = src;
  }
  figmaFrame.style('left',   fx + 'px');
  figmaFrame.style('top',    fy + 'px');
  figmaFrame.style('width',  pw + 'px');
  figmaFrame.style('height', ph + 'px');
}

function updateInstagramFrame(px, py, pw, ph, cx, cy, src) {
  let fx = width/2 + cx + px;
  let fy = height/2 + cy + py;
  let embedSrc = src.replace(/\/$/, '') + '/embed/';
  if (!instagramFrame || instagramFrame._src !== src) {
    hideInstagramFrame();
    let wrapper = createElement('div');
    wrapper.style('position',      'fixed');
    wrapper.style('overflow',      'hidden');
    wrapper.style('border-radius', '8px');
    wrapper.style('z-index',       '50');
    wrapper.style('background',    '#000');
    wrapper.parent(document.body);
    let iframe = createElement('iframe');
    iframe.attribute('src', embedSrc);
    iframe.attribute('allowfullscreen', '');
    iframe.attribute('scrolling', 'no');
    iframe.style('width',  '100%');
    iframe.style('height', '100%');
    iframe.style('border', 'none');
    iframe.parent(wrapper);
    instagramFrame = wrapper;
    instagramFrame._src = src;
  }
  instagramFrame.style('left',   fx + 'px');
  instagramFrame.style('top',    fy + 'px');
  instagramFrame.style('width',  pw + 'px');
  instagramFrame.style('height', ph + 'px');
}

function updateCarouselPdfFrame(px, py, pw, ph, cx, cy, src) {
  let fx = width/2 + cx + px;
  let fy = height/2 + cy + py;

  if (!carouselPdfFrame || carouselPdfFrame._src !== src) {
    hideCarouselPdfFrame();
    let wrapper = createElement('div');
    wrapper.style('position', 'fixed');
    wrapper.style('overflow', 'hidden');
    wrapper.style('z-index',  '50');
    wrapper.parent(document.body);

    let iframe = createElement('iframe');
    iframe.attribute('src', src + '#toolbar=0&navpanes=0&scrollbar=0');
    iframe.style('width',        '100%');
    iframe.style('height',       '100%');
    iframe.style('border',       'none');
    iframe.parent(wrapper);

    carouselPdfFrame = wrapper;
    carouselPdfFrame._src = src;
  }

  carouselPdfFrame.style('left',   fx + 'px');
  carouselPdfFrame.style('top',    fy + 'px');
  carouselPdfFrame.style('width',  pw + 'px');
  carouselPdfFrame.style('height', ph + 'px');
}

function updateLocalVideoFrame(vx, vy, vw, vh, cx, cy, src) {
  let fx = width/2  + cx + vx;
  let fy = height/2 + cy + vy;

  if (!localVideoFrame || localVideoFrame._src !== src) {
    hideLocalVideoFrame();
    let wrapper = createElement('div');
    wrapper.style('position',      'fixed');
    wrapper.style('background',    '#000');
    wrapper.style('overflow',      'hidden');
    wrapper.style('z-index',       '50');
    wrapper.parent(document.body);

    let vid = createElement('video');
    vid.attribute('src', src);
    vid.attribute('controls', '');
    vid.attribute('autoplay', '');
    vid.attribute('loop', '');
    vid.style('width',  '100%');
    vid.style('height', '100%');
    vid.style('object-fit', 'contain');
    vid.parent(wrapper);

    localVideoFrame = wrapper;
    localVideoFrame._src = src;
  }

  localVideoFrame.style('left',   fx + 'px');
  localVideoFrame.style('top',    fy + 'px');
  localVideoFrame.style('width',  vw + 'px');
  localVideoFrame.style('height', vh + 'px');
}

// ── Feuille Projets : grille filtrée par catégorie ───────────────────────────
function drawGraphismeSheet() {
  let g = sheetGeom(1);
  let { e, cx, cy, fw, fh } = g;

  push(); translate(cx, cy);

  drawSheetBase(g, sections[1].color, detailProgress < 0.1);

  let gridActive = detailTarget < 0.5;   // la grille n'est cliquable que hors page détail

  if (e > 0.75) {
    let a       = map(e, 0.75, 1.0, 0, 255);
    let compact = isCompact();
    let pad     = compact ? 16 : 32;
    let tc      = color(42,28,10,a);
    let sc      = color(90,70,45,a);

    let lineY = drawSheetTitle(tr(sections[1].title), fw, fh, pad, a, compact ? 20 : 22);

    // ── Onglets catégories (passent à la ligne si la place manque) ───────────
    let cats   = ['Tous', ...new Set(GRAPHISME_PROJETS.map(p => p.categorie))];
    let tabH   = 24, tabGap = 8;
    let tabX   = -fw/2 + pad;
    let tabY   = lineY + 10;

    for (let cat of cats) {
      let isActive = (cat === graphismeCategory);
      textSize(11); textStyle(isActive ? BOLD : NORMAL);
      let tw = textWidth(catLabel(cat)) + 16;
      if (tabX + tw > fw/2 - pad && tabX > -fw/2 + pad) {
        tabX = -fw/2 + pad;
        tabY += tabH + 6;
      }
      let isHovTab = gridActive && mouseIn(tabX, tabY, tw, tabH);
      if (gridActive) addHit('tab', tabX, tabY, tw, tabH, cat);

      // Fond onglet
      noStroke();
      fill(isActive ? color(42,28,10,a*0.85) : color(42,28,10,a*(isHovTab?0.12:0.06)));
      rect(tabX, tabY, tw, tabH, 5);

      // Texte onglet
      fill(isActive ? color(245,242,235,a) : color(42,28,10,a*0.75));
      textAlign(CENTER, CENTER);
      text(catLabel(cat), tabX + tw/2, tabY + tabH/2);

      tabX += tw + tabGap;
    }

    // ── Grille projets filtrés (triés du plus récent au plus vieux) ──────────
    let projets = getGraphismeProjets();

    let cols  = (compact && width < 520) ? 1 : 2, gpad = 16;
    let rows  = ceil(projets.length / cols);
    let gx    = -fw/2 + pad;
    let gy    = tabY + tabH + 14;           // sous les onglets
    let gridBottom = fh/2 - pad - 8;
    let visH  = gridBottom - gy;            // hauteur visible de la grille
    let cellW = (fw - pad*2 - gpad*(cols-1)) / cols;
    let imgH  = cellW * 0.6;                // même proportion sur téléphone et ordinateur
    let cellH = imgH + 46;                  // image + titre/infos
    let rowH  = cellH + gpad;
    let totalH = rows * rowH - gpad;
    let maxScroll = clampGridScroll(totalH, visH);

    // Clipping de la zone de grille
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(-fw/2 + 1, gy, fw - 2, visH);
    drawingContext.clip();

    for (let idx = 0; idx < projets.length; idx++) {
      let p       = projets[idx];
      let origIdx = GRAPHISME_PROJETS.indexOf(p);
      let x       = gx + (idx % cols) * (cellW + gpad);
      let y       = gy + floor(idx / cols) * rowH - gridScrollY;

      if (y + cellH < gy || y > gridBottom) continue;

      // Partie visible de la fiche = zone cliquable
      let y0 = max(y, gy), y1 = min(y + cellH, gridBottom);
      let isHov = gridActive && mouseIn(x, y0, cellW, y1 - y0);
      if (gridActive) addHit('card', x, y0, cellW, y1 - y0, origIdx);

      // Fond fiche
      noStroke();
      fill(255,255,255,a*0.85);
      rect(x, y, cellW, cellH, 8);

      // Image
      if (graphismeImgs[origIdx]) {
        let img = graphismeImgs[origIdx];
        let iw = img.width, ih = img.height;
        let scale = max(cellW/iw, imgH/ih);
        let sw = cellW/scale, sh = imgH/scale;
        let sx = (iw-sw)/2, sy = (ih-sh)/2;
        tint(255, a*(isHov ? 1 : 0.92));
        drawingContext.save();
        drawingContext.beginPath();
        ctxRoundRect(drawingContext, x, y, cellW, imgH, 8);
        drawingContext.clip();
        image(img, x, y, cellW, imgH, sx, sy, sw, sh);
        drawingContext.restore();
        noTint();
      } else {
        noStroke(); fill(200,190,170,a);
        rect(x, y, cellW, imgH, 8, 8, 0, 0);
      }

      // Badge catégorie
      let badgeX = x + cellW - 8, badgeY = y + 8;
      textSize(9); textStyle(NORMAL);
      let bw = textWidth(catLabel(p.categorie)) + 10;
      noStroke(); fill(42,28,10,a*0.55);
      rect(badgeX-bw, badgeY, bw, 16, 4);
      fill(245,242,235,a);
      textAlign(CENTER,CENTER);
      text(catLabel(p.categorie), badgeX - bw/2, badgeY+8);

      // Infos bas de fiche
      let iy = y + imgH + 6, ip = 10;
      noStroke(); fill(tc);
      textAlign(LEFT,TOP); textStyle(BOLD); textSize(12);
      text(fitText(tr(p.titre), cellW - ip*2), x+ip, iy);
      fill(sc); textStyle(NORMAL); textSize(10);
      text(p.annee, x+ip, iy+16);

      // Bordure hover
      if (isHov) {
        noFill(); stroke(42,28,10,a*0.6);
        strokeWeight(1.5); rect(x, y, cellW, cellH, 8);
      }
    }

    drawingContext.restore();

    if (maxScroll > 0) drawScrollbar(fw/2 - pad/2 - 3, gy, visH, totalH, gridScrollY, a);
  }

  // ── Page détail projet ────────────────────────────────────────────────────
  if (graphismeSelected >= 0 && detailProgress > 0.01) {
    let de = easeInOut(detailProgress);
    let p  = GRAPHISME_PROJETS[graphismeSelected];

    noStroke();
    fill(250,247,240, de*255);
    rect(-fw/2, -fh/2, fw, fh, lerp(4,10,e));

    if (de > 0.6) {
      let da = map(de, 0.6, 1.0, 0, 255);
      let L  = detailLayout(fw, fh, 0.62, detailRatio(p));

      drawBackButton(fw, fh, L.pad, da, [42,28,10]);

      // Média (les projets avec preview ont une iframe positionnée par-dessus)
      if (!p.preview) drawGraphismeMedia(p, L.media, cx, cy, da);

      drawDetailInfo(L.info, p.titre, [[t('category'), catLabel(p.categorie)], [t('year'), p.annee]], p.desc, da,
                     { tc: [42,28,10], sc: [100,80,55] });
    }
  }

  if (e > 0.75) drawCloseButton(fw, fh, map(e, 0.75, 1.0, 0, 255));

  pop();
}

// Média de la page détail Projets : image du carousel, ou vidéo / PDF / Instagram / Figma en iframe
function drawGraphismeMedia(p, m, cx, cy, da) {
  let nbImgs      = p.imgs ? p.imgs.length : 1;
  let carImgs     = graphismeCarouselImgs[graphismeSelected] || [];
  let curSrc      = p.imgs ? p.imgs[graphismeCarouselIdx] : null;
  let isVideo     = curSrc && curSrc.endsWith('.mp4');
  let isPdf       = curSrc && curSrc.endsWith('.pdf');
  let isInstagram = curSrc && curSrc.includes('instagram.com');
  // En attendant le chargement, la première image utilise la miniature
  let curImg      = carImgs[graphismeCarouselIdx] || (graphismeCarouselIdx === 0 ? graphismeImgs[graphismeSelected] : null);
  let open        = detailTarget > 0.5;

  // Les iframes laissent de la place aux flèches du carousel sur les côtés
  let inset = nbImgs > 1 ? 44 : 0;
  let fx = m.x + inset, fw2 = m.w - inset*2;

  if (isVideo && open) {
    noStroke(); fill(0, da*0.9);
    rect(m.x, m.y, m.w, m.h);
    updateLocalVideoFrame(fx, m.y, fw2, m.h, cx, cy, curSrc);
  } else hideLocalVideoFrame();

  if (isPdf && open) {
    noStroke(); fill(245,242,235, da*0.9);
    rect(m.x, m.y, m.w, m.h);
    updateCarouselPdfFrame(fx, m.y, fw2, m.h, cx, cy, curSrc);
  } else hideCarouselPdfFrame();

  if (isInstagram && open) {
    noStroke(); fill(0, da*0.9);
    rect(m.x, m.y, m.w, m.h);
    updateInstagramFrame(fx, m.y, fw2, m.h, cx, cy, curSrc);
  } else hideInstagramFrame();

  if (p.figma && open) {
    noStroke(); fill(245,242,235, da*0.9);
    rect(m.x, m.y, m.w, m.h);
    updateFigmaFrame(fx, m.y, fw2, m.h, cx, cy, p.figma);
  } else hideFigmaFrame();

  if (!isVideo && !isInstagram && curImg) {
    tint(255, da);
    let iw = curImg.width, ih = curImg.height;
    let scale = max(m.w/iw, m.h/ih);
    let sw = m.w/scale, sh = m.h/scale;
    let sx = (iw-sw)/2, sy = (ih-sh)/2;
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(m.x, m.y, m.w, m.h);
    drawingContext.clip();
    image(curImg, m.x, m.y, m.w, m.h, sx, sy, sw, sh);
    drawingContext.restore();
    noTint();
  } else if (!isVideo && !isInstagram) {
    noStroke(); fill(200,190,170,da);
    rect(m.x, m.y, m.w, m.h);
  }

  // Flèches carousel
  if (nbImgs > 1) {
    let arrowY = m.y + m.h/2;
    let arw    = 28;
    let canL   = graphismeCarouselIdx > 0;
    let canR   = graphismeCarouselIdx < nbImgs-1;
    let lx = m.x, rx = m.x + m.w - arw*1.4;
    let lhov = canL && mouseIn(lx, arrowY-arw, arw*1.4, arw*2);
    let rhov = canR && mouseIn(rx, arrowY-arw, arw*1.4, arw*2);
    if (canL) addHit('arrow', lx, arrowY-arw, arw*1.4, arw*2, -1);
    if (canR) addHit('arrow', rx, arrowY-arw, arw*1.4, arw*2, +1);

    noStroke(); fill(0,0,0, da*(canL ? (lhov?0.55:0.3) : 0.1));
    circle(m.x + arw*0.7, arrowY, arw*1.6);
    fill(255,255,255, da*(canL ? (lhov?1:0.8) : 0.3));
    textAlign(CENTER,CENTER); textSize(16); textStyle(BOLD);
    text("‹", m.x + arw*0.7, arrowY);

    noStroke(); fill(0,0,0, da*(canR ? (rhov?0.55:0.3) : 0.1));
    circle(m.x + m.w - arw*0.7, arrowY, arw*1.6);
    fill(255,255,255, da*(canR ? (rhov?1:0.8) : 0.3));
    text("›", m.x + m.w - arw*0.7, arrowY);

    // Points indicateurs
    let dotY   = m.y + m.h + 14;
    let dotGap = 12;
    let dotsX  = m.x + m.w/2 - (nbImgs-1)*dotGap/2;
    for (let d = 0; d < nbImgs; d++) {
      noStroke(); fill(42,28,10, da*(d===graphismeCarouselIdx ? 0.7 : 0.2));
      circle(dotsX + d*dotGap, dotY, d===graphismeCarouselIdx ? 7 : 5);
    }
  }
}

// ── Feuille Eclectique Lab : grille d'images ──────────────────────────────────
function drawEclectiqueSheet() {
  let g = sheetGeom(3);
  let { e, cx, cy, fw, fh } = g;

  push(); translate(cx, cy);

  // Fond mauve doux (différent de la couleur du dossier)
  drawSheetBase(g, [225, 210, 240], detailProgress < 0.1);

  let gridActive = detailTarget < 0.5;

  if (e > 0.75) {
    let a       = map(e, 0.75, 1.0, 0, 255);
    let compact = isCompact();
    let pad     = compact ? 16 : 32;
    let textCol = color(42,28,10,a);

    let lineY = drawSheetTitle("Eclectique Lab", fw, fh, pad, a, compact ? 20 : 22);

    // Grille 2 colonnes (1 sur téléphone) ; sur ordinateur elle remplit la hauteur
    let n     = ECLECTIQUE_PROJETS.length;
    let cols  = (compact && width < 520) ? 1 : 2, gpad = 16;
    let rows  = ceil(n / cols);
    let gx    = -fw/2 + pad;
    let gy    = lineY + 16;
    let gridBottom = fh/2 - pad - 6;
    let visH  = gridBottom - gy;
    let cellW = (fw - pad*2 - gpad*(cols-1)) / cols;
    let imgH  = cellW * 0.6;                // même proportion sur téléphone et ordinateur
    let cellH = imgH + 46;                  // image + titre/infos
    let totalH = rows * (cellH + gpad) - gpad;
    let maxScroll = clampGridScroll(totalH, visH);

    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(-fw/2 + 1, gy, fw - 2, visH);
    drawingContext.clip();

    for (let idx = 0; idx < n; idx++) {
      let p = ECLECTIQUE_PROJETS[idx];
      let x = gx + (idx % cols) * (cellW + gpad);
      let y = gy + floor(idx / cols) * (cellH + gpad) - gridScrollY;

      if (y + cellH < gy || y > gridBottom) continue;

      let y0 = max(y, gy), y1 = min(y + cellH, gridBottom);
      let isHov = gridActive && mouseIn(x, y0, cellW, y1 - y0);
      if (gridActive) addHit('card', x, y0, cellW, y1 - y0, idx);

      // Fond fiche
      noStroke();
      fill(darkMode ? color(45,38,28,a) : color(255,255,255,a*0.85));
      rect(x, y, cellW, cellH, 8);

      // Image (recadrée sans déformation, comme object-fit: cover)
      if (eclectiqueImgs[idx]) {
        let img = eclectiqueImgs[idx];
        let iw = img.width, ih = img.height;
        let scale = max(cellW / iw, imgH / ih);
        let sw = cellW / scale, sh = imgH / scale;
        let sx = (iw - sw) / 2, sy = (ih - sh) / 2;
        tint(255, a * (isHov ? 1 : 0.92));
        drawingContext.save();
        drawingContext.beginPath();
        ctxRoundRect(drawingContext, x, y, cellW, imgH, 8);
        drawingContext.clip();
        image(img, x, y, cellW, imgH, sx, sy, sw, sh);
        drawingContext.restore();
        noTint();
      } else {
        noStroke(); fill(darkMode ? color(60,50,35,a) : color(200,190,170,a));
        rect(x, y, cellW, imgH, 8, 8, 0, 0);
      }

      // Zone infos en bas de la fiche
      let iy = y + imgH + 8;
      let ip = 10;

      // Titre
      noStroke(); fill(textCol);
      textAlign(LEFT, TOP); textStyle(BOLD); textSize(12);
      text(fitText(tr(p.titre), cellW - ip*2), x+ip, iy);

      // Année + Client
      fill(darkMode ? color(180,165,140,a) : color(90,70,45,a));
      textStyle(NORMAL); textSize(10);
      text(fitText(p.annee + ' · ' + p.client, cellW - ip*2), x+ip, iy+16);

      // Bordure hover
      if (isHov) {
        noFill(); stroke(darkMode ? color(220,205,175,a*0.8) : color(42,28,10,a*0.6));
        strokeWeight(1.5); rect(x, y, cellW, cellH, 8);
      }
    }

    drawingContext.restore();

    if (maxScroll > 0) drawScrollbar(fw/2 - pad/2 - 3, gy, visH, totalH, gridScrollY, a);
  }

  // ── Page détail projet ──────────────────────────────────────────────────────
  if (eclectiqueSelected >= 0 && detailProgress > 0.01) {
    let de   = easeInOut(detailProgress);
    let proj = ECLECTIQUE_PROJETS[eclectiqueSelected];
    let bg   = darkMode ? [30,25,18] : [250,247,240];
    let pal  = darkMode ? { tc: [220,205,175], sc: [160,145,120] }
                        : { tc: [42,28,10],    sc: [100,80,55] };

    // Fond blanc/sombre qui recouvre la grille
    noStroke();
    fill(bg[0], bg[1], bg[2], de*255);
    rect(-fw/2, -fh/2, fw, fh, lerp(4,10,e));

    if (de > 0.6) {
      let da = map(de, 0.6, 1.0, 0, 255);
      let L  = detailLayout(fw, fh, 0.5, detailRatio(proj));

      drawBackButton(fw, fh, L.pad, da, pal.tc);

      // Média : image (si preview, l'iframe est positionnée en HTML par-dessus)
      if (!proj.preview && eclectiqueImgs[eclectiqueSelected]) {
        tint(255, da);
        image(eclectiqueImgs[eclectiqueSelected], L.media.x, L.media.y, L.media.w, L.media.h);
        noTint();
      }

      drawDetailInfo(L.info, proj.titre, [[t('year'), proj.annee], [t('client'), proj.client]], proj.desc, da,
                     pal, proj.lien);
    }
  }

  if (e > 0.75) drawCloseButton(fw, fh, map(e, 0.75, 1.0, 0, 255));

  pop();
}

// ── Debug zones ───────────────────────────────────────────────────────────────
function drawDebugZones() {
  if (!DEBUG_ZONES) return;
  push(); translate(width/2, height/2);
  push(); scale(cartonScale());
  for (let i = 0; i < FOLDER_ZONES.length; i++) {
    let z = FOLDER_ZONES[i], c = sections[z.folder].color;
    let isHov = z.on && z.folder === hovered;

    if (!z.on) {
      stroke(150); strokeWeight(2); fill(150, 40);
    } else if (isHov) {
      stroke(255, 220, 50); strokeWeight(3); fill(255, 220, 50, 90);
    } else {
      stroke(c[0],c[1],c[2]); strokeWeight(2); fill(c[0],c[1],c[2], 55);
    }

    if (z.pts) {
      beginShape();
      for (let p of z.pts) vertex(p[0], p[1]);
      endShape(CLOSE);
      if (!z.on) {
        stroke(180); strokeWeight(1);
        if (z.pts.length >= 4) {
          line(z.pts[0][0],z.pts[0][1],z.pts[2][0],z.pts[2][1]);
          line(z.pts[1][0],z.pts[1][1],z.pts[3][0],z.pts[3][1]);
        }
      }
    } else {
      rect(z.x, z.y, z.w, z.h);
      if (!z.on) {
        stroke(180); strokeWeight(1);
        line(z.x, z.y, z.x+z.w, z.y+z.h);
        line(z.x+z.w, z.y, z.x, z.y+z.h);
      }
    }

    // Nom
    let lx = z.pts ? z.pts[0][0] : z.x;
    let ly = z.pts ? z.pts.reduce((m,p)=>min(m,p[1]), 9999) : z.y;
    noStroke();
    fill(isHov ? color(255,220,50) : (z.on ? 20 : 120));
    textSize(10); textStyle(BOLD); textAlign(LEFT, TOP);
    text('['+i+'] '+tr(sections[z.folder].label) + (isHov ? ' ◀' : ''), lx + 5, ly - 14);
  }
  pop();

  // Feuille suivante — visualisation quand une fiche est ouverte
  if (sheetProgress > 0.5 && activeFolder >= 0 && activeFolder < N - 1) {
    let sd   = getSheetDims(activeFolder);
    let offY = sd.cy - NEXT_SHEET_PEEK;
    let nx = NEXT_SHEET_OFFSET_X, ny = offY;
    stroke(255, 80, 80); strokeWeight(2); fill(255, 80, 80, 40);
    rect(nx - sd.w/2, ny - sd.h/2, sd.w, sd.h, 6);
    noStroke(); fill(255, 80, 80);
    textSize(11); textStyle(BOLD); textAlign(LEFT, TOP);
    text('NEXT SHEET  cy:'+sd.cy+'  offY:'+round(offY)+'  PEEK:'+NEXT_SHEET_PEEK+'px', nx - sd.w/2 + 6, ny - sd.h/2 + 4);
  }

  // Overlay bas : position souris + hint contextuel
  let mx = round(mouseX - width/2);
  let my = round(mouseY - height/2);
  let flashCopy = (millis() - debugCopiedAt) < 600;
  let onZone = DEBUG_OPEN_SHEET && hovered >= 0 && sheetTarget < 0.5;
  let bx = -width/2 + 8, by = height/2 - 30, bw = 270, bh = 22;
  noStroke();
  fill(flashCopy ? color(80,180,80) : onZone ? color(200,140,0,220) : color(30,30,30,200));
  rect(bx, by, bw, bh, 4);
  fill(255); textSize(11); textStyle(BOLD); textAlign(LEFT, CENTER);
  let hint = flashCopy ? '✓ copié !'
           : onZone    ? '↵ clic = ouvrir ['+tr(sections[hovered].label)+']'
           :              '📍 x:'+mx+'  y:'+my+'  [clic = copier]';
  text(hint, bx+8, by+11);
  pop();
}

// ── Interaction ───────────────────────────────────────────────────────────────
function mouseMoved()   { if (sheetTarget < 0.5 && introLanded) updateHover(); }
function mouseDragged() { if (sheetTarget < 0.5 && introLanded) updateHover(); }

function updateHover() {
  let cs = cartonScale();
  let mx = (mouseX - width/2) / cs;
  let my = (mouseY - height/2) / cs;

  hovered = -1;
  for (let i = FOLDER_ZONES.length - 1; i >= 0; i--) {
    let z = FOLDER_ZONES[i];
    if (!z.on) continue;
    let hit = z.pts
      ? pointInPoly(mx, my, z.pts)
      : (mx > z.x && mx < z.x + z.w && my > z.y && my < z.y + z.h);
    if (hit) { hovered = z.folder; break; }
  }

  // Compter les changements de dossier et jouer le son après 3
  if (hovered >= 0 && hovered !== lastHovered) {
    lastHovered = hovered;
    hoverCount++;
    if (hoverCount > 3) playRustle();
  }
}

// Clic souris (ordinateur). Sur écran tactile, c'est touchEnded qui appelle handleTap.
function mouseClicked() {
  if (millis() - lastTouchTime < 700) return;   // clic simulé après un tap : déjà traité
  handleTap();
}

function handleTap() {
  if (!introLanded) return;

  // Debug
  if (DEBUG_ZONES) {
    // Clic sur une hitbox → ouvrir la fiche (si option activée)
    if (DEBUG_OPEN_SHEET && hovered >= 0 && sheetTarget < 0.5) {
      openSheet(hovered);
      return;
    }
    // Clic hors hitbox → copier les coordonnées (repère du carton non mis à l'échelle)
    let mx = round((mouseX - width/2) / cartonScale());
    let my = round((mouseY - height/2) / cartonScale());
    let txt = 'X' + mx + ' Y' + my;
    try {
      navigator.clipboard.writeText(txt).then(() => { debugCopiedAt = millis(); });
    } catch(e) {
      let ta = document.createElement('textarea');
      ta.value = txt; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy');
      document.body.removeChild(ta);
      debugCopiedAt = millis();
    }
    return;
  }

  if (sheetProgress > 0.5) {
    // 1. Élément cliquable de la fiche (onglet, projet, vidéo, retour, ✕…)
    let z = hitAt(mouseX, mouseY);
    if (z) { onHit(z); return; }

    let sd   = getSheetDims(activeFolder);
    let left = width/2 - sd.w/2;
    let top  = height/2 + sd.cy - sd.h/2;
    let inActive = mouseX > left && mouseX < left+sd.w && mouseY > top && mouseY < top+sd.h;

    // 2. Clic sur la feuille suivante (partie visible qui dépasse)
    if (activeFolder < N - 1 && !inActive) {
      let nx = width/2 + NEXT_SHEET_OFFSET_X, ny = height/2 + sd.cy - NEXT_SHEET_PEEK;
      if (mouseX > nx-sd.w/2 && mouseX < nx+sd.w/2 && mouseY > ny-sd.h/2 && mouseY < ny+sd.h/2) {
        resetSheetState();
        activeFolder++;
        sheetProgress = 0.65;
        return;
      }
    }

    // 3. Clic en dehors → fermer
    if (!inActive) closeSheet();
    return;
  }

  // Ouvrir un dossier
  if (hovered >= 0 && sheetTarget < 0.5) openSheet(hovered);
}

function onHit(z) {
  switch (z.type) {
    case 'close': closeSheet(); break;
    case 'back':  closeDetail(); break;
    case 'link':  window.open(z.data, '_blank'); break;
    case 'arrow': graphismeCarouselIdx += z.data; break;
    case 'tab':
      graphismeCategory = z.data;
      gridScrollY = gridScrollTarget = 0;
      break;
    case 'card':
      if (activeFolder === 1) { graphismeSelected = z.data; graphismeCarouselIdx = 0; loadCarousel(z.data); }
      else                      eclectiqueSelected = z.data;
      openDetail();
      break;
    case 'video':
      if (z.data !== videoIndex) { videoIndex = z.data; hideVideoFrame(); }
      break;
  }
}

function openSheet(i) {
  clearTimeout(sheetCloseTimer);
  activeFolder  = i;
  sheetProgress = 0;
  sheetTarget   = 1;
  hovered       = -1;
}

function closeSheet() {
  sheetTarget = 0;
  resetSheetState();
  sheetCloseTimer = setTimeout(() => { activeFolder = -1; sheetProgress = 0; }, 400);
}

function openDetail() {
  clearTimeout(detailCloseTimer);
  detailTarget = 1;
  textScrollY = textScrollTarget = 0;
  let p = currentDetailProject();
  if (p && p.preview) showPreviewFrame(p.preview, p.ratio);
}

function closeDetail() {
  detailTarget = 0;
  hideDetailFrames();
  detailCloseTimer = setTimeout(() => {
    graphismeSelected  = -1;
    eclectiqueSelected = -1;
    detailProgress     = 0;
  }, 500);
}

// Remet à zéro l'état interne des fiches (détail, scroll, iframes)
function resetSheetState() {
  clearTimeout(detailCloseTimer);
  detailTarget         = 0;
  detailProgress       = 0;
  eclectiqueSelected   = -1;
  graphismeSelected    = -1;
  graphismeCarouselIdx = 0;
  gridScrollY = gridScrollTarget = 0;
  textScrollY = textScrollTarget = 0;
  hideVideoFrame();
  hideDetailFrames();
}

function hideDetailFrames() {
  hidePreviewFrame();
  hideLocalVideoFrame();
  hideCarouselPdfFrame();
  hideInstagramFrame();
  hideFigmaFrame();
}

// ── Aperçu vidéo via iframe ───────────────────────────────────────────────────
// Placée sur la zone média de la page détail (même calcul que detailLayout au dessin)
function showPreviewFrame(url, ratio) {
  hidePreviewFrame();
  let sd = getSheetDims(activeFolder);
  let r  = detailRatio({ preview: url, ratio });
  let m  = detailLayout(sd.w, sd.h, activeFolder === 1 ? 0.62 : 0.5, r).media;

  let videoW = min(m.w, m.h * r);
  let videoH = videoW / r;
  let videoX = width/2 + m.x + (m.w - videoW) / 2;
  let videoY = height/2 + sd.cy + m.y;

  let wrapper = createElement('div');
  wrapper.style('position', 'fixed');
  wrapper.style('left',     videoX + 'px');
  wrapper.style('top',      videoY + 'px');
  wrapper.style('width',    videoW + 'px');
  wrapper.style('height',   videoH + 'px');
  wrapper.style('overflow', 'hidden');
  wrapper.style('border-radius', '8px');
  wrapper.style('z-index', '50');
  wrapper.parent(document.body);

  previewFrame = createElement('iframe');
  previewFrame.attribute('src', url);
  previewFrame.attribute('allow', 'autoplay; encrypted-media');
  previewFrame.attribute('allowfullscreen', '');
  previewFrame.style('width',  '100%');
  previewFrame.style('height', '100%');
  previewFrame.style('border', 'none');
  previewFrame.parent(wrapper);

  // Garder référence du wrapper pour le supprimer
  previewFrame._wrapper = wrapper;
}

function hidePreviewFrame() {
  if (previewFrame) {
    previewFrame._wrapper.remove();
    previewFrame = null;
  }
}

// ── Défilement : molette et doigt ─────────────────────────────────────────────
// Texte long (page détail, À propos) ou grille de la fiche ouverte.
// Les bornes sont appliquées au dessin (clampGridScroll / drawScrollText).
function scrollSheet(dy) {
  if (sheetProgress < 0.75 || activeFolder < 0) return false;
  if (detailTarget > 0.5 || activeFolder === 0)  textScrollTarget += dy;
  else if (activeFolder <= 3)                     gridScrollTarget += dy;
  else return false;
  return true;
}

function mouseWheel(event) {
  if (scrollSheet(event.delta * 0.8)) return false;
}

function keyPressed() {
  if (keyCode === ESCAPE && sheetTarget > 0.5) closeSheet();
}

// ── Support tactile mobile ────────────────────────────────────────────────────
// Un tap n'est pas toujours converti en clic souris (iOS notamment) : on le
// détecte nous-mêmes (doigt levé sans avoir glissé) et on bloque le clic simulé.
let touchStartX = 0, touchStartY = 0, lastTouchY = 0;
let touchDragged  = false;
let lastTouchTime = -9999;

function setupTouch(canvasElt) {
  canvasElt.addEventListener('touchstart', ev => {
    let t = ev.touches[0];
    touchStartX = t.clientX;
    touchStartY = lastTouchY = t.clientY;
    touchDragged = false;
  }, { passive: true });
}

function touchMoved(ev) {
  if (!ev || !ev.touches || !ev.touches.length) return false;
  let t = ev.touches[0];
  if (abs(t.clientY - touchStartY) > 8 || abs(t.clientX - touchStartX) > 8) touchDragged = true;
  scrollSheet(lastTouchY - t.clientY);
  lastTouchY = t.clientY;
  return false;
}

function touchEnded(ev) {
  // Les boutons HTML (icônes, thème) gèrent leur propre tap
  if (!ev || !ev.target || ev.target.tagName !== 'CANVAS') return;
  lastTouchTime = millis();
  if (!touchDragged) {
    if (sheetTarget < 0.5 && introLanded) updateHover();
    handleTap();
  }
  return false;
}
