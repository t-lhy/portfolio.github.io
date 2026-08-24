// ── Détection mobile ──────────────────────────────────────────────────────────
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// ── Sections ──────────────────────────────────────────────────────────────────
const sections = [
  { label:"À propos",              color:[210,204,138], title:"À propos de moi",
    desc:"et oui c'est bien moi !" },
  { label:"Projets",               color:[103,184,76], title:"Projets",
    desc:"tqt" },
  { label:"Vidéo",                 color:[140,200,191], title:"Vidéo",
    desc:"play" },
  { label:"Eclectique Lab",color:[118,135,218], title:"Eclectique Lab",
    desc:"ouais j'suis pro" },
  { label:"Contact",               color:[116,86,189], title:"Contact",
    desc:"tu veux mon 06" }
];
const N = sections.length;

// ── Images ────────────────────────────────────────────────────────────────────
let imgs     = [];
let cartonImg;
let aproposImg = null;
let cvImg              = null;
let cvFrame            = null;
let localVideoFrame    = null;
let carouselPdfFrame   = null;
let figmaFrame         = null;
let instagramFrame     = null;

// ── Projets Graphisme ─────────────────────────────────────────────────────────
// categorie : "Affiche" | "Identité" | "Illustration" | "Motion" | "Typographie" | …
const GRAPHISME_PROJETS = [
  { imgs: ['assets/graphisme_1a.jpg','assets/graphisme_1b.jpg','assets/graphisme_1c.jpg','assets/graphisme_1d.png'], titre: 'Mémoire', annee: '2025', client: '', categorie: 'Édition', desc: "Mon mémoire interroge la possibilité du design japonais de s'imposer comme une référence mondiale à l'instar du graphisme suisse.\nJ'analyse dedans l'historique culturel et esthétique, j'explore les caractéristiques visuelles et philosophiques qui font la singularité du design nippon." },
  { imgs: ['assets/graphisme_2a.jpg','assets/graphisme_2b.jpg','assets/graphisme_2c.jpg','assets/graphisme_2d.jpg','assets/graphisme_2e.jpg','assets/graphisme_2f.jpg'], titre: 'Eusapie', annee: '2024', client: '', categorie: 'Édition', desc: "Inspiré par l'œuvre d'Italo Calvino, ce projet rend hommage à l'univers onirique des Villes invisibles. L'illustration représente la ville d'Eusapie, dont le billet a été gravé en taille-douce." },
  { imgs: ['assets/graphisme_3a.jpg','assets/graphisme_3b.jpg','assets/graphisme_3c.jpg'], titre: 'Exercice de type', annee: '2025', client: '', categorie: 'Édition', desc: "Inspiré du livre «Exercices de style», ce livre-expérimentation explore les familles typographiques. Une même phrase est réinterprétée en styles variés." },
  { imgs: ['assets/graphisme_4a.jpg','assets/graphisme_4b.jpg','assets/graphisme_4c.jpg','assets/graphisme_4d.jpg','assets/graphisme_4e.jpg'], titre: 'Polar', annee: '2024', client: '', categorie: 'Édition', desc: "Projet de classe sur le thème du polar : deux linogravures originales ont été créées inspirées par l'univers sombre du genre. Ces illustrations, aux contrastes marqués capturent l'essence des polars policiers : meurtre, énigme et tension." },
  { imgs: ['assets/graphisme_5a.jpg','assets/graphisme_5b.jpg','assets/graphisme_5c.jpg','assets/graphisme_5d.mp4'], titre: 'Octobre Rose', annee: '2024', client: 'General Electric', categorie: 'Affiche', desc: "Création d'une affiche collaborative pour la campagne Octobre Rose 2024 des Bénévoles de GE Vernova. Réalisée à l'aide de tampons en linogravure, cette initiative a permis à des cadres, dirigeants et bénévoles de l'association de créer chacun 30 affiches uniques." },
  { imgs: ['assets/graphisme_6a.jpg','assets/graphisme_6b.jpg','assets/graphisme_6c.jpg'], titre: 'Big Brother', annee: '2025', client: '', categorie: 'Affiche', desc: "Réalisée sur des chutes de papier noir, cette sérigraphie en rouge et blanc s'inspire de l'univers dystopique de 1984 pour interroger notre époque. Elle évoque l'omniprésence de la surveillance, entre contrôle invisible et résistance visuelle." },
  { preview: 'https://www.youtube.com/embed/Ua2Eo687CJM?controls=1', titre: 'Transport 9HA.02 2ᵉ unité', annee: '2019', client: 'General Electric', categorie: 'General Electric', desc: "Réalisation et montage pour la 2ᵉ turbine à gaz 9HA.02 produite à Belfort." },
  { preview: 'https://www.youtube.com/embed/A3pA9tl60HA?controls=1', titre: '30th 9HA',                   annee: '2021', client: 'General Electric', categorie: 'General Electric', desc: "Réalisation et montage pour la 30ᵉ turbine à gaz produite à Belfort." },
  { imgs: ['assets/graphisme_7a.jpg','assets/graphisme_7b.jpg','assets/graphisme_7c.jpg','assets/graphisme_7d.jpg'], titre: 'Move to Zero', annee: '2022', client: 'Nike', categorie: 'Communication', desc: "Conception d'une communication visuelle et éditoriale pour Move to Zero, l'initiative écologique de Nike. Ce projet fictif explore une identité graphique engagée, composée d'une dichotomie entre les anciennes baskets et le recyclage." },
  { imgs: ['assets/graphisme_8a.jpg','assets/graphisme_8b.jpg','assets/graphisme_8c.jpg','assets/graphisme_8d.jpg'], titre: 'Révolution écolo', annee: '2025', client: '', categorie: 'Édition', desc: "Création et découpages de fruits en papier et mise en page d'un article Télérama, sur le thème de la pâtisserie responsable. Ce projet fictif nous parle de l'importance de consommer des fruits de saison." },
  { imgs: ['assets/graphisme_9a.jpg','assets/graphisme_9b.jpg','assets/graphisme_9c.jpg','assets/graphisme_9d.jpg','assets/graphisme_9e.jpg','assets/graphisme_9f.jpg','assets/graphisme_9g.jpg','assets/graphisme_9h.jpg'], titre: 'Boot Configuration Data', annee: '2025', client: 'Sacred Bones Records', categorie: 'Identité visuelle', desc: "Création d'une identité visuelle fictive dans le cadre d'une intégration au label Sacred Bones Records du groupe Master Boot Records. Les visuels ont été conçus à partir de fragments issus d'un ancien disque dur démonté, pour créer une esthétique à la fois industrielle et technologique, en écho direct à l'identité sonore du groupe." },
  { imgs: ['assets/graphisme_10a.jpg','assets/graphisme_10b.jpg','assets/graphisme_10c.jpg','assets/graphisme_10d.jpg','assets/graphisme_10e.pdf'], titre: 'Year One', annee: '2025', client: 'General Electric', categorie: 'General Electric', desc: "Création de trois propositions de logos pour la collection anniversaire des t-shirts célébrant le premier anniversaire de GE Vernova en Europe. Chaque proposition explore une direction graphique distincte : détail manches, dynamisme et mouvement, référence à l'Europe, héritage et modernité." },
  { imgs: ['assets/graphisme_11a.jpg'], titre: 'France procuration', annee: '2024', client: '', categorie: 'UI/UX', desc: "Application mobile conçue pour simplifier et moderniser la démarche de procuration lors des élections législatives de 2024. Grâce à une authentification sécurisée via la nouvelle carte d'identité, les utilisateurs peuvent créer leur procuration directement depuis leur smartphone sans avoir à se déplacer en commissariat. Pratique et rapide, cette solution réduit les contraintes administratives et facilite l'accès au vote notamment pour les personnes absentes ou empêchées. En rendant la procuration plus simple et accessible l'application contribue également à lutter contre l'abstention en encourageant une plus large participation.", figma: 'https://www.figma.com/proto/OkDimolgd5hduBvD9zPEc9/Untitled?page-id=0%3A1&node-id=1-4&p=f&viewport=403%2C442%2C0.18&t=vLrECDGW3nLeCSAC-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1%3A4' },
  { imgs: ['assets/graphisme_12a.png','assets/graphisme_12b.jpg','assets/graphisme_12c.png'], titre: 'Jurabio', annee: '2022', client: '', categorie: 'Identité visuelle', desc: "Étiquette conçue pour un ensemble de 6 étiquettes distinctes de vin jurabio, destiné à financer une sortie scolaire." },
  { imgs: ['assets/graphisme_13a.jpg','assets/graphisme_13b.jpg','assets/graphisme_13c.jpg','assets/graphisme_13d.jpg'], titre: '9HA.02 World Premiere', annee: '2018', client: 'General Electric', categorie: 'General Electric', desc: "Réalisation d'une illustration vectorielle en monochrome représentant le convoi exceptionnel de la turbine à gaz 9HA.02. Ce travail s'inscrit dans la création d'objets commémoratifs destinés aux acteurs institutionnels ayant contribué à la réussite de son transport hors normes." },
  { imgs: ['assets/graphisme_14a.jpg','assets/graphisme_14b.jpg','assets/graphisme_14c.jpg','assets/graphisme_14d.jpg','assets/graphisme_14e.jpg','assets/graphisme_14f.jpg','assets/graphisme_14g.jpg','https://www.instagram.com/p/DVOTCHjCDbp/'], titre: 'Du design au service de l\'exclusion', annee: '2026', client: '', categorie: 'Perso', desc: "Série de stickers détournant les codes des étiquettes de colis et de panneaux d'avertissement pour dénoncer l'architecture hostile à Paris." },
];
let graphismeImgs        = [];        // thumbnail par projet (première image)
let graphismeCarouselImgs = [];       // tableau d'images par projet (pour carousel)
let graphismeCarouselIdx = 0;         // index image active dans le carousel
let graphismeHovered     = -1;
let graphismeSelected    = -1;
let graphismeCategory    = 'Tous';   // filtre actif
let graphismeRetourHov   = false;

// ── Projets Eclectique Lab ────────────────────────────────────────────────────────
// Remplace les données par tes vrais projets
const ECLECTIQUE_PROJETS = [
  { img: 'assets/eclectique_1.jpg', titre: 'Répare Grêle', annee: '2026', client: 'Répare Grêle', desc: "Réalisation d'une vidéo promotionnelle et d'une série de prises de vue pour le site web de l'entreprise Répare grêle", lien: 'https://www.reparegrele.fr/', preview: 'https://www.youtube.com/embed/HjFh3WrojNg?controls=1' },
  { img: 'assets/eclectique_3.jpg', titre: 'A l\'ombre de la Canopée', annee: '2025', client: 'Domaine de La Canopée', desc: "Conception et réalisation d'une vidéo promotionnelle présentant les hébergements insolites du domaine La Canopée", lien: 'https://youtu.be/w8glPcoBUS8', preview: 'https://www.youtube.com/embed/w8glPcoBUS8?controls=1' },
  { img: 'assets/eclectique_2.jpg', titre: 'Necronomicon - Une convention pleine de surprises...', annee: '2025', client: 'Fam Atelier', desc: "Réalisation d'un réel promotionnel", lien: 'https://youtube.com/shorts/r2ML2_FiLps', preview: 'https://www.youtube.com/embed/r2ML2_FiLps?controls=1', ratio: '9/16' },
  { img: 'assets/eclectique_4.jpg', titre: 'Ma première convention', annee: '2024', client: 'Fam Atelier', desc: "Réalisation d'un réel promotionnel et de prises de vue pour la banque d'images de la créatrice", lien: 'https://www.instagram.com/p/C5v21eFqsy6/', preview: 'https://www.youtube.com/embed/Slz6MCmRK2U?controls=1', ratio: '9/16' },
];
let eclectiqueImgs = [];

// ── Projets Vidéo ─────────────────────────────────────────────────────────────
const VIDEO_PROJETS = [
  { titre: 'Justice Stress td glitch', desc: "Expérimentation Touch Designer",                                                       preview: 'https://www.youtube.com/embed/Z5_4tqdT93E?controls=1' },
  { titre: 'AVD réactivité',    desc: "Expérimentation Touch Designer",                                                            preview: 'https://www.youtube.com/embed/XQvi5ktRcAg?controls=1' },
  { titre: 'La cuisine des canailles', desc: "Animation réalisée pour une émission fictive produite par France 5",         preview: 'https://www.youtube.com/embed/MvwvVDYP2OI?controls=1' },
  { titre: 'Japon - Miyajima',  desc: '',                                                                                      preview: 'https://www.youtube.com/embed/5H1DHHNe1Cg?controls=1' },
  { titre: 'Japon - Tokyo',     desc: '',                                                                                      preview: 'https://www.youtube.com/embed/G1bzOK5kKRo?controls=1' },
  { titre: 'Lettres singulières', desc: 'Vidéo expérimentale autour du thème « Lettres singulières »',                             preview: 'https://www.youtube.com/embed/a9yZYQJA1yI?controls=1' },
  { titre: 'Drone.mp4',         desc: '',                                                                                      preview: 'https://www.youtube.com/embed/6aifvWqVX4Y?controls=1' },
  { titre: 'NOËL',              desc: '',                                                                                      preview: 'https://www.youtube.com/embed/OpSgMS-tf70?controls=1' },
  { titre: 'SUMMER 2020',       desc: '',                                                                                      preview: 'https://www.youtube.com/embed/kdGB1i9vqvM?controls=1' },
  { titre: 'ERROR…',           desc: '',                                                                                      preview: 'https://www.youtube.com/embed/17wJPSq5w18?controls=1' },
  { titre: 'Untilted 1',        desc: '',                                                                                      preview: 'https://www.youtube.com/embed/bscLG_QGDXQ?controls=1' },
  { titre: 'Quarantine',        desc: "Travail d'anglais réalisé pendant le confinement",                                      preview: 'https://www.youtube.com/embed/-rcqlSjoguU?controls=1' },
  { titre: 'Dublin',             desc: '',                                                                                      preview: 'https://www.youtube.com/embed/_BwLKqk1t5g?controls=1' },
];
let eclectiqueHovered  = -1;  // fiche survolée dans la grille
let eclectiqueSelected = -1;  // projet ouvert en détail
let detailProgress     = 0;   // animation ouverture détail 0→1
let detailTarget       = 0;
let retourHovered      = false;  // souris sur le bouton retour
let previewFrame       = null;   // iframe d'aperçu site
const IMG_W  = 440;
const IMG_H  = 440;

let playBtn;


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
let titleAlpha   = (sessionStorage.getItem('introPlayed') === '1') ? 200 : 0;
let hoverCount   = 0;    // nombre de dossiers survolés
let lastHovered  = -1;   // dernier dossier survolé
let soundCtx     = null; // Web Audio context pour les sons

// ── Zones de survol ───────────────────────────────────────────────────────────
// rx,ry = coin haut-gauche (0..1), rw,rh = taille (0..1)
// Hitboxes en pixels, repère centré sur le canvas (0,0 = centre écran).
// L'image des dossiers mesure 360×360 px → elle va de -180 à +180 sur x et y.
// x/y = coin haut-gauche de la zone, w/h = largeur/hauteur.
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

// Taille de texte adaptée à la fenêtre
function fs(size) {
  return size * min(width / 1280, height / 800, 1.0);
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
  if (i === 0) return { w: min(width*0.78, 900), h: min(height*0.84, 720), cy: -20 };
  if (i === 4) return { w: min(width*0.82, 960), h: min(height*0.88, 760), cy: -20 };
  return            { w: min(width*0.88, 1020), h: min(height*0.88, 760), cy: -10 };
}

// ── Preload ───────────────────────────────────────────────────────────────────
function preload() {
  cartonImg = loadImage('assets/carton.png');
  loadImage('assets/cv.jpg',
    img => { cvImg = img; },
    ()  => { cvImg = null; }
  );
  loadImage('assets/apropos.jpg',
    img => { aproposImg = img; },
    ()  => { aproposImg = null; }
  );

  for (let i = 0; i < N; i++) {
    imgs[i] = loadImage('assets/dossier_' + i + '.png');
  }
}

// ── Setup ─────────────────────────────────────────────────────────────────────
function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.elt.style.touchAction = 'none'; // empêche le scroll natif sur le canvas
  document.fonts.load('400 16px PPFormula').then(() => textFont('PPFormula'));
  document.fonts.load('700 16px PPFormula').then(() => textFont('PPFormula'));
  textFont('PPFormula');
  displayAlpha[N] = 255;
  createSocialIcons();
  // Charger les images Projets sans bloquer (img, imgs[] ou thumbnail YouTube)
  for (let i = 0; i < GRAPHISME_PROJETS.length; i++) {
    (function(idx) {
      let p = GRAPHISME_PROJETS[idx];
      graphismeCarouselImgs[idx] = [];
      if (p.imgs) {
        // Carousel multi-images
        for (let j = 0; j < p.imgs.length; j++) {
          (function(jj) {
            loadImage(p.imgs[jj],
              img => {
                graphismeCarouselImgs[idx][jj] = img;
                if (jj === 0) graphismeImgs[idx] = img; // thumbnail = première image
              },
              () => { graphismeCarouselImgs[idx][jj] = null; }
            );
          })(j);
        }
      } else if (p.img) {
        loadImage(p.img,
          img => { graphismeImgs[idx] = img; graphismeCarouselImgs[idx] = [img]; },
          ()  => { graphismeImgs[idx] = null; }
        );
      } else if (p.preview) {
        let ytId = getYTId(p.preview);
        if (ytId) {
          loadImage('https://img.youtube.com/vi/' + ytId + '/mqdefault.jpg',
            img => { graphismeImgs[idx] = img; graphismeCarouselImgs[idx] = [img]; },
            ()  => { graphismeImgs[idx] = null; }
          );
        } else { graphismeImgs[idx] = null; }
      } else { graphismeImgs[idx] = null; }
    })(i);
  }

  // Charger les images Eclectique Lab sans bloquer
  for (let i = 0; i < ECLECTIQUE_PROJETS.length; i++) {
    (function(idx) {
      if (!ECLECTIQUE_PROJETS[idx].img) { eclectiqueImgs[idx] = null; return; }
      loadImage(ECLECTIQUE_PROJETS[idx].img,
        img => { eclectiqueImgs[idx] = img; },
        ()  => { eclectiqueImgs[idx] = null; }
      );
    })(i);
  }

  // Charger les miniatures YouTube
  for (let i = 0; i < VIDEO_PROJETS.length; i++) {
    (function(idx) {
      let id = getYTId(VIDEO_PROJETS[idx].preview);
      if (!id) { videoThumbs[idx] = null; return; }
      loadImage('https://img.youtube.com/vi/' + id + '/mqdefault.jpg',
        img => { videoThumbs[idx] = img; },
        ()  => { videoThumbs[idx] = null; }
      );
    })(i);
  }

  // Init analyseur audio


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
  let li = createElement('a');
  li.attribute('href', 'https://www.linkedin.com/in/th%C3%A9o-lahaye/');
  li.attribute('target', '_blank');
  li.style('display', 'flex');
  li.style('align-items', 'center');
  li.style('justify-content', 'center');
  li.style('width', '36px');
  li.style('height', '36px');
  li.style('border-radius', '8px');
  li.style('background', 'none');
  li.style('border', 'none');
  li.style('transition', 'background 0.2s');
  li.html('<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="rgba(200,185,160,0.8)"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>');
  li.parent(div);

  // Instagram
  let ig = createElement('a');
  ig.attribute('href', 'https://www.instagram.com/eclectique_lab/');
  ig.attribute('target', '_blank');
  ig.style('display', 'flex');
  ig.style('align-items', 'center');
  ig.style('justify-content', 'center');
  ig.style('width', '36px');
  ig.style('height', '36px');
  ig.style('border-radius', '8px');
  ig.style('background', 'none');
  ig.style('border', 'none');
  ig.style('transition', 'background 0.2s');
  ig.html('<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="rgba(200,185,160,0.8)"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>');
  ig.parent(div);


  div.parent(document.body);

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
    let fill = darkMode ? 'rgba(200,185,160,0.8)' : 'rgba(60,40,20,0.8)';
    document.querySelectorAll('#social-icons svg').forEach(s => s.setAttribute('fill', fill));

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
    btn.html('<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="rgba(200,185,160,0.85)"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3" stroke="rgba(200,185,160,0.85)" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="21" x2="12" y2="23" stroke="rgba(200,185,160,0.85)" stroke-width="2" stroke-linecap="round"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="rgba(200,185,160,0.85)" stroke-width="2" stroke-linecap="round"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="rgba(200,185,160,0.85)" stroke-width="2" stroke-linecap="round"/><line x1="1" y1="12" x2="3" y2="12" stroke="rgba(200,185,160,0.85)" stroke-width="2" stroke-linecap="round"/><line x1="21" y1="12" x2="23" y2="12" stroke="rgba(200,185,160,0.85)" stroke-width="2" stroke-linecap="round"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="rgba(200,185,160,0.85)" stroke-width="2" stroke-linecap="round"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="rgba(200,185,160,0.85)" stroke-width="2" stroke-linecap="round"/></svg>');
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
}

// ── Draw ──────────────────────────────────────────────────────────────────────
function draw() {
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




  // Fade in du titre après l'atterrissage
  if (introLanded) titleAlpha = lerp(titleAlpha, 200, 0.025);

  // Masquer les icônes sociales quand une fiche est ouverte
  let socialDiv = document.getElementById('social-icons');
  if (socialDiv) socialDiv.style.opacity = sheetProgress > 0.3 ? '0' : '1';

  sheetProgress  = lerp(sheetProgress,  sheetTarget,       0.25);
  detailProgress = lerp(detailProgress, detailTarget,      0.12);
  videoScrollY        = lerp(videoScrollY,        videoScrollTarget,    0.12);
  graphismeScrollY    = lerp(graphismeScrollY,    graphismeScrollTarget, 0.12);



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
  // Ombre portée sous le carton (disparaît une fois posé)
  if (!introLanded) {
    let shadowScale = map(introY, -800, 0, 0.05, 0.5);
    let shadowAlpha = map(introY, -800, 0, 0, 45);
    noStroke(); fill(0, 0, 0, shadowAlpha);
    ellipse(width/2, height/2 + IMG_H*0.48, IMG_W * shadowScale, 14 * shadowScale);
  }

  // Titre en arrière-plan (avant les fiches)

  push();
  translate(width/2, height/2 + introY);
  imageMode(CENTER);

  if (displayAlpha[N] > 1) {
    tint(255, displayAlpha[N]);
    image(cartonImg, 0, 0, IMG_W, IMG_H);
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
      alpha = max(alpha, 255);
      yOff = -18;
    }
    if (alpha > 1) {
      push();
      translate(0, yOff);
      tint(255, alpha);
      image(imgs[i], 0, 0, IMG_W, IMG_H);
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
      text(sections[nextI].title, -sd.w/2+40, -sd.h/2+30);
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


  // Sync couleur icônes sociales avec le clignotement easter egg (seulement au changement)
  if (easterEggActive) {
    let flashWhiteIcons = floor(millis() / 500) % 2 === 0 ? 1 : 0;
    if (flashWhiteIcons !== easterEggLastFlash) {
      easterEggLastFlash = flashWhiteIcons;
      let iconFill = flashWhiteIcons ? 'rgba(42,28,10,0.8)' : 'rgba(200,185,160,0.8)';
      document.querySelectorAll('#social-icons svg').forEach(s => s.setAttribute('fill', iconFill));
    }
  }
}

// ── Label au survol ───────────────────────────────────────────────────────────
function drawHoverLabel(i) {
  let sec = sections[i];
  let col = sec.color;
  // Au dessus du carton, centré
  let lx = width/2;
  let ly = height/2 - IMG_H/2 - 42;
  noStroke();
  fill(darkMode ? color(220, 205, 175) : color(60, 40, 20));
  textAlign(CENTER, CENTER);
  textSize(16); textStyle(BOLD);
  text(sec.label, lx, ly);
}

// ── Feuille animée ────────────────────────────────────────────────────────────
function drawAnimatedSheet(i) {
  if (i < 0) return;
  // Dossier À propos (index 0) → page bio
  if (i === 0) { drawAproposSheet(); return; }
  // Dossier Graphisme (index 1) → grille filtrée par catégorie
  if (i === 1) { drawGraphismeSheet(); return; }
  // Dossier Vidéo (index 2) → grille de vidéos
  if (i === 2) { drawVideoSheet(); return; }
  // Dossier Eclectique Lab (index 3) → grille d'images
  if (i === 3) { drawEclectiqueSheet(); return; }
  // Dossier Contact (index 4) → CV + infos
  if (i === 4) { drawContactSheet(); return; }
  let sec = sections[i], col = sec.color;
  let e   = easeInOut(sheetProgress);

  let startX = map(i, 0, N-1, -IMG_W*0.1, IMG_W*0.15);
  let startY = map(i, 0, N-1, -IMG_H*0.15, IMG_H*0.1);
  let endW   = min(width*0.70, 820), endH = min(height*0.80, 680);

  let cx = lerp(startX, 0, e);
  let cy = lerp(startY, -20, e);
  let fw = lerp(180, endW, e);
  let fh = lerp(200, endH, e);

  push(); translate(cx, cy);

  if (e > 0.1) {
    noStroke(); fill(0,0,0, e*80);
    rect(-fw/2+12, -fh/2+12, fw, fh, 12);
  }

  strokeWeight(2.5); stroke(42,31,15);
  fill(col[0], col[1], col[2]);
  rect(-fw/2, -fh/2, fw, fh, lerp(4,10,e));


  if (e > 0.72) {
    let a   = map(e, 0.72, 1.0, 0, 255);
    let pad = fw * 0.09;

    noStroke(); fill(42,28,10,a);
    textAlign(LEFT,TOP); textStyle(BOLD); textSize(lerp(14,34,e));
    text(sec.title, -fw/2+pad, -fh/2+pad);

    stroke(42,28,10, a*0.35); strokeWeight(1.4);
    line(-fw/2+pad, -fh/2+pad+46, fw/2-pad, -fh/2+pad+46);

    noStroke(); fill(55,38,18,a);
    textStyle(NORMAL); textSize(lerp(10,17,e));
    textLeading(27); textWrap(WORD);
    text(sec.desc, -fw/2+pad, -fh/2+pad+64, fw-pad*2, fh);

    stroke(42,28,10, a*0.07); strokeWeight(1);
    for (let ly = -fh/2+pad+108; ly < fh/2-pad; ly+=30)
      line(-fw/2+pad, ly, fw/2-pad, ly);
  }

  pop();
}

// ── Feuille Contact ──────────────────────────────────────────────────────────
function drawContactSheet() {
  let sec = sections[4], col = sec.color;
  let e   = easeInOut(sheetProgress);

  let startX = map(4, 0, N-1, -IMG_W*0.1, IMG_W*0.15);
  let startY = map(4, 0, N-1, -IMG_H*0.15, IMG_H*0.1);
  let endW   = min(width*0.82, 960), endH = min(height*0.88, 760);

  let cx = lerp(startX, 0, e);
  let cy = lerp(startY, -20, e);
  let fw = lerp(180, endW, e);
  let fh = lerp(200, endH, e);

  push(); translate(cx, cy);

  // Ombre
  if (e > 0.1) {
    noStroke(); fill(0,0,0, e*80);
    rect(-fw/2+12, -fh/2+12, fw, fh, 12);
  }

  // Fond feuille
  strokeWeight(2.5); stroke(42,31,15);
  fill(col[0], col[1], col[2]);
  rect(-fw/2, -fh/2, fw, fh, lerp(4,10,e));

  if (e > 0.72) {
    let a   = map(e, 0.72, 1.0, 0, 255);
    let pad = 36;

    // Titre
    noStroke(); fill(42,28,10, a);
    textAlign(LEFT, TOP); textStyle(BOLD); textSize(fs(26));
    text(sec.title, -fw/2+pad, -fh/2+pad);

    // Séparateur
    stroke(42,28,10, a*0.35); strokeWeight(1.4);
    line(-fw/2+pad, -fh/2+pad+40, fw/2-pad, -fh/2+pad+40);

    // Zone CV : occupe toute la hauteur disponible sous le titre
    let cvY  = -fh/2 + pad + 52;
    let cvH  = fh - pad - 52 - pad;
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
      imageMode(CORNER);
      image(cvImg, ix, iy, dispW, dispH);
      imageMode(CENTER);
      noTint();
      drawingContext.restore();
    } else {
      noStroke(); fill(0,0,0, a*0.12);
      rect(-cvW/2, cvY, cvW, cvH, 8);
    }
  }

  pop();
}

// ── Feuille À propos ─────────────────────────────────────────────────────────
function drawAproposSheet() {
  let sec = sections[0], col = sec.color;
  let e   = easeInOut(sheetProgress);

  let startX = map(0, 0, N-1, -IMG_W*0.1, IMG_W*0.15);
  let startY = map(0, 0, N-1, -IMG_H*0.15, IMG_H*0.1);
  let endW   = min(width*0.78, 900), endH = min(height*0.84, 720);

  let cx = lerp(startX, 0, e);
  let cy = lerp(startY, -20, e);
  let fw = lerp(180, endW, e);
  let fh = lerp(200, endH, e);

  push(); translate(cx, cy);

  // Ombre
  if (e > 0.1) {
    noStroke(); fill(0,0,0, e*80);
    rect(-fw/2+12, -fh/2+12, fw, fh, 12);
  }

  // Fond feuille
  strokeWeight(2.5); stroke(42,31,15);
  fill(col[0], col[1], col[2]);
  rect(-fw/2, -fh/2, fw, fh, lerp(4,10,e));

  if (e > 0.72) {
    let a   = map(e, 0.72, 1.0, 0, 255);
    let pad = 40;
    let tc  = darkMode ? color(42,28,10,a) : color(42,28,10,a);
    let sc  = darkMode ? color(80,60,35,a) : color(80,60,35,a);

    let colW  = (fw - pad*3) / 2;
    let colH  = fh - pad*2;
    let col1X = -fw/2 + pad;
    let col2X = -fw/2 + pad*2 + colW;
    let colY  = -fh/2 + pad;

    // ── Colonne gauche : photo ──
    if (aproposImg) {
      // Recadrage cover
      let iw = aproposImg.width, ih = aproposImg.height;
      let sc2 = max(colW / iw, colH / ih);
      let sw = colW / sc2, sh = colH / sc2;
      let sx = (iw - sw) / 2, sy = (ih - sh) / 2;
      // Clipper avec un rect arrondi via drawingContext
      drawingContext.save();
      drawingContext.beginPath();
      ctxRoundRect(drawingContext,
        -fw/2 + pad + (width/2 + cx) - (width/2 + cx),
        -fh/2 + pad + (height/2 + cy) - (height/2 + cy),
        colW, colH, 10
      );
      // Simple image avec tint
      tint(255, a);
      copy(aproposImg, sx, sy, sw, sh, col1X, colY, colW, colH);
      noTint();
    } else {
      noStroke(); fill(200,185,160, a*0.3);
      rect(col1X, colY, colW, colH, 10);
      fill(tc); textAlign(CENTER,CENTER); textSize(12); textStyle(NORMAL);
      text("photo", col1X+colW/2, colY+colH/2);
    }

    // ── Colonne droite : texte ──
    let iy = colY;

    // Prénom + nom
    noStroke(); fill(red(tc), green(tc), blue(tc), a);
    textAlign(LEFT, TOP); textStyle(BOLD); textSize(28);
    text("À propos", col2X, iy);

    // Sous-titre
    fill(red(sc), green(sc), blue(sc), a);
    textStyle(NORMAL); textSize(13);
    text("Besançon - Belfort", col2X, iy + 38);

    // Ligne
    stroke(red(tc), green(tc), blue(tc), a*0.2);
    strokeWeight(1.2);
    line(col2X, iy + 58, col2X + colW, iy + 58);

    // Bio
    let bio = "Je m'appelle Theo, et je crée sous le nom d'Eclectique Lab. " +
      "Basé à Besançon, j'explore le graphisme et la vidéo comme des façons de raconter " +
      "et d'expérimenter. Ma passion a commencé enfant, en construisant des mondes avec des " +
      "LEGO ou sur Minecraft. Puis tout s'est accéléré quand mon père m'a initié à Photoshop, " +
      "qui m'a permis de découvrir une nouvelle façon de créer.\n\n" +
      "J'aime mélanger les supports, jouer avec les textures et faire dialoguer image, son et lumière. " +
      "Mes inspirations sont variées, allant de la musique à la nature, et incluent des créateurs " +
      "comme Virgil Abloh, l'une de mes plus grandes inspirations.";
    noStroke(); fill(red(tc), green(tc), blue(tc), a);
    textStyle(NORMAL); textSize(13); textLeading(22); textWrap(WORD);
    text(bio, col2X, iy + 70, colW, colH - 70);
  }

  pop();
}

// ── Feuille Vidéo : grille de vidéos ─────────────────────────────────────────
let videoIndex      = 0;    // index vidéo active
let videoHovered    = -1;   // bouton survolé
let videoFrame      = null; // iframe vidéo
let videoBtnClicked = false; // flag pour bloquer mouseClicked
let videoScrollY      = 0;  // scroll courant (interpolé)
let videoScrollTarget = 0;  // scroll cible (mis à jour par molette)
let graphismeScrollY      = 0;
let graphismeScrollTarget = 0;
let videoThumbs     = [];   // miniatures YouTube

function getYTId(url) {
  let m = url.match(/embed\/([^?]+)/);
  return m ? m[1] : null;
}

function drawVideoSheet() {
  let sec = sections[2], col = sec.color;
  let e   = easeInOut(sheetProgress);

  let startX = map(2, 0, N-1, -IMG_W*0.1, IMG_W*0.15);
  let startY = map(2, 0, N-1, -IMG_H*0.15, IMG_H*0.1);
  let endW   = min(width*0.88, 1020), endH = min(height*0.88, 760);

  let cx = lerp(startX, 0, e);
  let cy = lerp(startY, -10, e);
  let fw = lerp(180, endW, e);
  let fh = lerp(200, endH, e);

  push(); translate(cx, cy);

  if (e > 0.1) {
    noStroke(); fill(0,0,0, e*80);
    rect(-fw/2+12, -fh/2+12, fw, fh, 12);
  }

  strokeWeight(2.5); stroke(42,31,15);
  fill(col[0], col[1], col[2]);
  rect(-fw/2, -fh/2, fw, fh, lerp(4,10,e));

  if (e > 0.75) {
    let a    = map(e, 0.75, 1.0, 0, 255);
    let pad  = 32, gpad = 14;
    let tc   = color(42,28,10,a);
    let sc   = color(90,70,45,a);

    // Titre section
    noStroke(); fill(tc);
    textAlign(LEFT, TOP); textStyle(BOLD); textSize(fs(22));
    text("Vidéo", -fw/2+pad, -fh/2+pad);

    // Ligne
    stroke(color(42,28,10,a*0.3)); strokeWeight(1.4);
    line(-fw/2+pad, -fh/2+pad+34, fw/2-pad, -fh/2+pad+34);

    // Dimensions grille
    let gw    = fw - pad*2;
    let cellW = (gw - gpad*2) / 3;
    let cellH = cellW * 9/16;
    let rowH  = cellH + 44;          // cellule + titre/desc
    let gridTop    = -fh/2 + pad + 50;
    let gridBottom = fh/2 - pad;     // limite basse visible
    let visH  = gridBottom - gridTop;

    // Clamper le scroll
    let totalRows  = ceil(VIDEO_PROJETS.length / 3);
    let maxScroll  = max(0, totalRows * rowH - visH);
    videoScrollTarget = constrain(videoScrollTarget, 0, maxScroll);
    videoScrollY      = constrain(videoScrollY,      0, maxScroll);

    let mx2 = mouseX - width/2 - cx;
    let my2 = mouseY - height/2 - cy;

    // Clipping : masquer ce qui dépasse du cadre
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(-fw/2 + 1, gridTop, fw - 2, visH);
    drawingContext.clip();

    for (let idx = 0; idx < VIDEO_PROJETS.length; idx++) {
      let row = floor(idx / 3);
      let col = idx % 3;
      let p   = VIDEO_PROJETS[idx];
      let vx  = -fw/2 + pad + col * (cellW + gpad);
      let vy  = gridTop + row * rowH - videoScrollY;

      // Ne pas dessiner les cellules hors zone visible
      if (vy + cellH < gridTop || vy > gridBottom) {
        if (idx === videoIndex) updateVideoFrame(vx, vy, cellW, cellH, cx, cy, p, e);
        continue;
      }

      let isActive = (idx === videoIndex);
      let isHov    = (mx2 > vx && mx2 < vx+cellW && my2 > vy && my2 < vy+cellH);

      // Fond vidéo + miniature
      noStroke(); fill(0,0,0, a*0.8);
      rect(vx, vy, cellW, cellH, 6);
      if (videoThumbs[idx]) {
        drawingContext.save();
        drawingContext.beginPath();
        ctxRoundRect(drawingContext, vx, vy, cellW, cellH, 6);
        drawingContext.clip();
        tint(255, a);
        image(videoThumbs[idx], vx, vy, cellW, cellH);
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
        rect(vx, vy, cellW, cellH, 6);
        if (isHov && !isActive) cursor(HAND);
      }

      // Titre
      noStroke(); fill(isActive ? color(42,28,10,a) : color(42,28,10,a*0.6));
      textAlign(LEFT, TOP); textStyle(isActive ? BOLD : NORMAL); textSize(fs(11));
      text(p.titre, vx, vy + cellH + 5, cellW, 18);

      // Description
      if (p.desc) {
        fill(sc); textStyle(NORMAL); textSize(fs(9));
        text(p.desc, vx, vy + cellH + 22, cellW, 22);
      }

      // Iframe pour la vidéo active
      if (isActive) updateVideoFrame(vx, vy, cellW, cellH, cx, cy, p, e);
    }

    drawingContext.restore();

    // Scrollbar indicateur (si contenu dépasse)
    if (maxScroll > 0) {
      let sbX  = fw/2 - pad/2 - 3;
      let sbH  = visH;
      let tH   = max(30, visH * visH / (totalRows * rowH));
      let tY   = gridTop + (videoScrollY / maxScroll) * (sbH - tH);
      noStroke(); fill(42,28,10, a*0.12);
      rect(sbX, gridTop, 4, visH, 2);
      fill(42,28,10, a*0.35);
      rect(sbX, tY, 4, tH, 2);
    }
  }

  pop();
}

function updateVideoFrame(vidX, vidY, vidW, vidH, cx, cy, p, e) {
  if (e < 0.9) { hideVideoFrame(); return; }

  // Calculer les limites de la grille (zone visible)
  let endH  = min(height*0.88, 760);
  let pad   = 32;
  let gw    = min(width*0.88, 1020) - pad*2;
  let cellW = (gw - 14*2) / 3;
  let cellH = cellW * 9/16;
  let gridTop    = -endH/2 + pad + 50;
  let gridBottom = endH/2  - pad;

  // Masquer l'iframe si la vidéo est hors zone visible
  if (vidY + cellH < gridTop || vidY > gridBottom) {
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

    // Overlay transparent pour capturer la molette
    let overlay = createElement('div');
    overlay.style('position', 'absolute');
    overlay.style('top', '0');
    overlay.style('left', '0');
    overlay.style('width', '100%');
    overlay.style('height', '100%');
    overlay.style('z-index', '51');
    overlay.style('pointer-events', 'none');
    overlay.parent(wrapper);

    // Capturer la molette sur le wrapper → scroller la grille
    wrapper.elt.addEventListener('wheel', (ev) => {
      ev.preventDefault();
      let endH2  = min(height*0.88, 760);
      let pad2   = 32;
      let gw2    = min(width*0.88, 1020) - pad2*2;
      let cellW2 = (gw2 - 14*2) / 3;
      let cellH2 = cellW2 * 9/16;
      let rowH2  = cellH2 + 44;
      let visH2  = endH2 - pad2 - (pad2 + 50);
      let maxS   = max(0, ceil(VIDEO_PROJETS.length/3) * rowH2 - visH2);
      videoScrollTarget = constrain(videoScrollTarget + ev.deltaY * 0.8, 0, maxS);
    }, { passive: false });

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

function hideCvFrame() {
  if (cvFrame) { cvFrame.remove(); cvFrame = null; }
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

function updateCvFrame(cvX, cvY, cvW, cvH, cx, cy, e) {
  if (e < 0.9) { hideCvFrame(); return; }

  let fx = width/2  + cx + cvX;
  let fy = height/2 + cy + cvY;

  if (!cvFrame) {
    let wrapper = createElement('div');
    wrapper.style('position',      'fixed');
    wrapper.style('border-radius', '8px');
    wrapper.style('overflow',      'hidden');
    wrapper.style('z-index',       '50');
    wrapper.parent(document.body);

    let iframe = createElement('iframe');
    iframe.attribute('src', 'assets/cv.pdf#toolbar=0&navpanes=0&scrollbar=0');
    iframe.style('width',        '100%');
    iframe.style('height',       '100%');
    iframe.style('border',       'none');
    iframe.parent(wrapper);

    cvFrame = wrapper;
  }

  cvFrame.style('left',   fx + 'px');
  cvFrame.style('top',    fy + 'px');
  cvFrame.style('width',  cvW + 'px');
  cvFrame.style('height', cvH + 'px');
  cvFrame.style('opacity', map(e, 0.9, 1.0, 0, 1));
}

// ── Feuille Graphisme : grille filtrée par catégorie ─────────────────────────
function drawGraphismeSheet() {
  let sec = sections[1], col = sec.color;
  let e   = easeInOut(sheetProgress);

  let startX = map(1, 0, N-1, -IMG_W*0.1, IMG_W*0.15);
  let startY = map(1, 0, N-1, -IMG_H*0.15, IMG_H*0.1);
  let endW   = min(width*0.88, 1020), endH = min(height*0.88, 760);

  let cx = lerp(startX, 0, e);
  let cy = lerp(startY, -10, e);
  let fw = lerp(180, endW, e);
  let fh = lerp(200, endH, e);

  push(); translate(cx, cy);

  if (e > 0.1 && detailProgress < 0.1) {
    noStroke(); fill(0,0,0, e*80);
    rect(-fw/2+12, -fh/2+12, fw, fh, 12);
  }

  strokeWeight(2.5); stroke(42,31,15);
  fill(col[0], col[1], col[2]);
  rect(-fw/2, -fh/2, fw, fh, lerp(4,10,e));

  if (e > 0.75) {
    let a    = map(e, 0.75, 1.0, 0, 255);
    let pad  = 32;
    let tc   = color(42,28,10,a);
    let sc   = color(90,70,45,a);

    // Titre
    noStroke(); fill(tc);
    textAlign(LEFT, TOP); textStyle(BOLD); textSize(22);
    text("Projets", -fw/2+pad, -fh/2+pad);

    // Ligne
    stroke(color(42,28,10,a*0.3)); strokeWeight(1.4);
    line(-fw/2+pad, -fh/2+pad+34, fw/2-pad, -fh/2+pad+34);

    // ── Onglets catégories ────────────────────────────────────────────────────
    let cats = ['Tous', ...new Set(GRAPHISME_PROJETS.map(p => p.categorie))];
    let tabY  = -fh/2 + pad + 44;
    let tabX  = -fw/2 + pad;
    let tabH  = 24;
    let tabGap = 8;
    let mx2   = mouseX - width/2 - cx;
    let my2   = mouseY - height/2 - cy;

    for (let ci = 0; ci < cats.length; ci++) {
      let cat  = cats[ci];
      let isActive = (cat === graphismeCategory);
      textSize(11); textStyle(isActive ? BOLD : NORMAL);
      let tw   = textWidth(cat) + 16;
      let isHovTab = (mx2 > tabX && mx2 < tabX+tw && my2 > tabY && my2 < tabY+tabH);

      // Fond onglet
      noStroke();
      fill(isActive ? color(42,28,10,a*0.85) : color(42,28,10,a*(isHovTab?0.12:0.06)));
      rect(tabX, tabY, tw, tabH, 5);

      // Texte onglet
      fill(isActive ? color(245,242,235,a) : color(42,28,10,a*0.75));
      textAlign(CENTER, CENTER);
      text(cat, tabX + tw/2, tabY + tabH/2);

      if (isHovTab && !isActive) cursor(HAND);
      tabX += tw + tabGap;
    }

    // ── Grille projets filtrés (triés du plus récent au plus vieux) ──────────
    let projets = ((graphismeCategory === 'Tous')
      ? GRAPHISME_PROJETS
      : GRAPHISME_PROJETS.filter(p => p.categorie === graphismeCategory))
      .slice().sort((a, b) => parseInt(b.annee) - parseInt(a.annee));

    let cols  = 2, gpad = 16;
    let rows  = ceil(projets.length / cols);
    let gx    = -fw/2 + pad;
    let gy    = -fh/2 + pad + 82;   // sous les onglets
    let gw    = fw - pad*2;
    let visH  = fh - pad*2 - 90;    // hauteur visible de la grille
    let gridBottom = gy + visH;
    let cellW = (gw - gpad*(cols-1)) / cols;
    let cellH = max(min((visH - gpad*(rows-1)) / rows, 220), 140);
    let imgH  = cellH * 0.70;
    let rowH  = cellH + gpad;
    let totalH = rows * rowH - gpad;
    let maxScroll = max(0, totalH - visH);

    graphismeScrollTarget = constrain(graphismeScrollTarget, 0, maxScroll);
    graphismeScrollY      = constrain(graphismeScrollY,      0, maxScroll);

    graphismeHovered = -1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let idx = r*cols+c;
        if (idx >= projets.length) continue;
        let x = gx + c*(cellW+gpad);
        let y = gy + r*rowH - graphismeScrollY;
        if (my2 > gy && my2 < gridBottom && mx2 > x && mx2 < x+cellW && my2 > y && my2 < y+cellH) {
          graphismeHovered = idx;
        }
      }
    }

    // Clipping de la zone de grille
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(-fw/2 + 1, gy, fw - 2, visH);
    drawingContext.clip();

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let idx = r*cols+c;
        if (idx >= projets.length) continue;
        let p    = projets[idx];
        let origIdx = GRAPHISME_PROJETS.indexOf(p);
        let x    = gx + c*(cellW+gpad);
        let y    = gy + r*rowH - graphismeScrollY;
        let isHov = (graphismeHovered === idx);

        if (y + cellH < gy || y > gridBottom) continue;

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
        let bw = textWidth(p.categorie) + 10;
        noStroke(); fill(42,28,10,a*0.55);
        rect(badgeX-bw, badgeY, bw, 16, 4);
        fill(245,242,235,a);
        textAlign(CENTER,CENTER);
        text(p.categorie, badgeX - bw/2, badgeY+8);

        // Infos bas de fiche
        let iy = y + imgH + 6, ip = 10;
        noStroke(); fill(tc);
        textAlign(LEFT,TOP); textStyle(BOLD); textSize(12); textWrap(WORD);
        text(p.titre, x+ip, iy, cellW - ip*2);
        fill(sc); textStyle(NORMAL); textSize(10);
        text(p.annee, x+ip, iy+16, cellW - ip*2);

        // Bordure hover
        if (isHov) {
          noFill(); stroke(42,28,10,a*0.6);
          strokeWeight(1.5); rect(x, y, cellW, cellH, 8);
          cursor(HAND);
        }
      }
    }

    drawingContext.restore();

    // Scrollbar
    if (maxScroll > 0) {
      let sbX = fw/2 - pad/2 - 3;
      let tH  = max(30, visH * visH / totalH);
      let tY  = gy + (graphismeScrollY / maxScroll) * (visH - tH);
      noStroke(); fill(42,28,10, a*0.12);
      rect(sbX, gy, 4, visH, 2);
      fill(42,28,10, a*0.35);
      rect(sbX, tY, 4, tH, 2);
    }
  }

  // ── Page détail projet ────────────────────────────────────────────────────
  if (graphismeSelected >= 0 && detailProgress > 0.01) {
    let de  = easeInOut(detailProgress);
    let p   = GRAPHISME_PROJETS[graphismeSelected];
    let bg  = color(250,247,240);
    let tc2 = color(42,28,10);
    let sc2 = color(100,80,55);

    noStroke();
    fill(red(bg), green(bg), blue(bg), de*255);
    rect(-fw/2, -fh/2, fw, fh, lerp(4,10,e));

    if (de > 0.6) {
      let da  = map(de, 0.6, 1.0, 0, 255);
      let pad   = 36;
      let avail = fw - pad*3;
      let colW  = avail * 0.38;
      let col1W = avail * 0.62;
      let colH  = fh - pad*2 - 40;
      let col1X = -fw/2 + pad;
      let col2X = col1X + col1W + pad;
      let colY  = -fh/2 + pad + 40;

      // Bouton retour
      let retBtnX = width/2 + cx - fw/2 + pad;
      let retBtnY = height/2 + cy - fh/2 + pad;
      graphismeRetourHov = (mouseX > retBtnX-10 && mouseX < retBtnX+130 &&
                            mouseY > retBtnY-16 && mouseY < retBtnY+16);
      noStroke();
      fill(red(tc2), green(tc2), blue(tc2), graphismeRetourHov ? da : da*0.65);
      textAlign(LEFT,CENTER); textStyle(graphismeRetourHov ? BOLD : NORMAL);
      textSize(graphismeRetourHov ? 14 : 13);
      text("← Retour", -fw/2+pad, -fh/2+pad);
      if (graphismeRetourHov) cursor(HAND);

      // ── Zone photo paysage (pleine largeur, haut de la fiche) ──
      let nbImgs = p.imgs ? p.imgs.length : 1;

      // ── Colonne gauche : image ──
      if (p.preview) {
        // iframe positionnée par-dessus
      } else {
        let carImgs     = graphismeCarouselImgs[graphismeSelected] || [];
        let curSrc      = p.imgs ? p.imgs[graphismeCarouselIdx] : null;
        let isVideo     = curSrc && curSrc.endsWith('.mp4');
        let isPdf       = curSrc && curSrc.endsWith('.pdf');
        let isInstagram = curSrc && curSrc.includes('instagram.com');
        let curImg      = carImgs[graphismeCarouselIdx] || graphismeImgs[graphismeSelected];

        if (isVideo && detailTarget > 0.5) {
          noStroke(); fill(0, da*0.9);
          rect(col1X, colY, col1W, colH);
          updateLocalVideoFrame(col1X, colY, col1W, colH, cx, cy, curSrc);
        } else if (!isVideo || detailTarget < 0.5) {
          hideLocalVideoFrame();
        }

        if (isPdf && detailTarget > 0.5) {
          noStroke(); fill(245,242,235, da*0.9);
          rect(col1X, colY, col1W, colH);
          updateCarouselPdfFrame(col1X, colY, col1W, colH, cx, cy, curSrc);
        } else if (!isPdf || detailTarget < 0.5) {
          hideCarouselPdfFrame();
        }

        if (isInstagram && detailTarget > 0.5) {
          noStroke(); fill(0, da*0.9);
          rect(col1X, colY, col1W, colH);
          updateInstagramFrame(col1X, colY, col1W, colH, cx, cy, curSrc);
        } else if (!isInstagram || detailTarget < 0.5) {
          hideInstagramFrame();
        }

        if (p.figma && detailTarget > 0.5) {
          noStroke(); fill(245,242,235, da*0.9);
          rect(col1X, colY, col1W, colH);
          updateFigmaFrame(col1X, colY, col1W, colH, cx, cy, p.figma);
        } else if (!p.figma || detailTarget < 0.5) {
          hideFigmaFrame();
        }

        if (!isVideo && !isInstagram && curImg) {
          tint(255, da);
          let iw = curImg.width, ih = curImg.height;
          let scale = max(col1W/iw, colH/ih);
          let sw = col1W/scale, sh = colH/scale;
          let sx = (iw-sw)/2, sy = (ih-sh)/2;
          drawingContext.save();
          drawingContext.beginPath();
          drawingContext.rect(col1X, colY, col1W, colH);
          drawingContext.clip();
          image(curImg, col1X, colY, col1W, colH, sx, sy, sw, sh);
          drawingContext.restore();
          noTint();
        } else if (!isVideo && !isInstagram) {
          noStroke(); fill(200,190,170,da);
          rect(col1X, colY, col1W, colH);
        }

        // Flèches carousel
        if (nbImgs > 1) {
          let arrowY  = colY + colH/2;
          let arwSize = 28;

          let lhov = (mouseX > width/2+cx+col1X && mouseX < width/2+cx+col1X+arwSize*1.4 &&
                      mouseY > height/2+cy+arrowY-arwSize && mouseY < height/2+cy+arrowY+arwSize);
          noStroke(); fill(0,0,0, da*(graphismeCarouselIdx>0 ? (lhov?0.55:0.3) : 0.1));
          circle(col1X + arwSize*0.7, arrowY, arwSize*1.6);
          fill(255,255,255, da*(graphismeCarouselIdx>0 ? (lhov?1:0.8) : 0.3));
          textAlign(CENTER,CENTER); textSize(16); textStyle(BOLD);
          text("‹", col1X + arwSize*0.7, arrowY);
          if (lhov && graphismeCarouselIdx > 0) cursor(HAND);

          let rhov = (mouseX > width/2+cx+col1X+col1W-arwSize*1.4 && mouseX < width/2+cx+col1X+col1W &&
                      mouseY > height/2+cy+arrowY-arwSize && mouseY < height/2+cy+arrowY+arwSize);
          noStroke(); fill(0,0,0, da*(graphismeCarouselIdx<nbImgs-1 ? (rhov?0.55:0.3) : 0.1));
          circle(col1X + col1W - arwSize*0.7, arrowY, arwSize*1.6);
          fill(255,255,255, da*(graphismeCarouselIdx<nbImgs-1 ? (rhov?1:0.8) : 0.3));
          textAlign(CENTER,CENTER); textSize(16); textStyle(BOLD);
          text("›", col1X + col1W - arwSize*0.7, arrowY);
          if (rhov && graphismeCarouselIdx < nbImgs-1) cursor(HAND);

          // Points indicateurs
          let dotY = colY + colH + 14;
          let dotGap = 12;
          let dotsX = col1X + col1W/2 - (nbImgs-1)*dotGap/2;
          for (let d = 0; d < nbImgs; d++) {
            noStroke(); fill(42,28,10, da*(d===graphismeCarouselIdx ? 0.7 : 0.2));
            circle(dotsX + d*dotGap, dotY, d===graphismeCarouselIdx ? 7 : 5);
          }
        }
      }

      // ── Colonne droite : infos ──
      let iy = colY + 10;
      noStroke(); fill(red(tc2),green(tc2),blue(tc2),da);
      textAlign(LEFT,TOP); textStyle(BOLD); textSize(26); textWrap(WORD);
      text(p.titre, col2X, iy, colW, 80);

      stroke(red(tc2),green(tc2),blue(tc2),da*0.2); strokeWeight(1);
      line(col2X, iy+70, col2X+colW, iy+70);

      noStroke(); fill(red(sc2),green(sc2),blue(sc2),da);
      textStyle(NORMAL); textSize(12);
      text("Catégorie", col2X, iy+84);
      fill(red(tc2),green(tc2),blue(tc2),da);
      textStyle(BOLD); textSize(14);
      text(p.categorie, col2X, iy+100);

      noStroke(); fill(red(sc2),green(sc2),blue(sc2),da);
      textStyle(NORMAL); textSize(12);
      text("Année", col2X, iy+130);
      fill(red(tc2),green(tc2),blue(tc2),da);
      textStyle(BOLD); textSize(14);
      text(p.annee, col2X, iy+146);

      noStroke(); fill(red(sc2),green(sc2),blue(sc2),da);
      textStyle(NORMAL); textSize(12);
      text("Description", col2X, iy+176);
      fill(red(tc2),green(tc2),blue(tc2),da);
      textStyle(NORMAL); textSize(13); textLeading(20); textWrap(WORD);
      text(p.desc, col2X, iy+194, colW, 120);
    }
  }

  pop();
}

// ── Feuille Eclectique Lab : grille d'images ──────────────────────────────────────────────
function drawEclectiqueSheet() {
  let sec = sections[3], col = sec.color;
  let e   = easeInOut(sheetProgress);

  let startX = map(3, 0, N-1, -IMG_W*0.1, IMG_W*0.15);
  let startY = map(3, 0, N-1, -IMG_H*0.15, IMG_H*0.1);
  let endW   = min(width*0.88, 1020), endH = min(height*0.88, 760);

  let cx = lerp(startX, 0, e);
  let cy = lerp(startY, -10, e);
  let fw = lerp(180, endW, e);
  let fh = lerp(200, endH, e);

  push(); translate(cx, cy);

  // Ombre (masquée quand le détail est ouvert)
  if (e > 0.1 && detailProgress < 0.1) {
    noStroke(); fill(0,0,0, e*80);
    rect(-fw/2+12, -fh/2+12, fw, fh, 12);
  }

  // Fond feuille
  strokeWeight(2.5); stroke(42,31,15);
  fill(225, 210, 240);  // mauve doux forcé
  rect(-fw/2, -fh/2, fw, fh, lerp(4,10,e));

  if (e > 0.75) {
    let a   = map(e, 0.75, 1.0, 0, 255);
    let pad = 32;
    let textCol = color(42,28,10,a);

    // Titre
    noStroke(); fill(textCol);
    textAlign(LEFT, TOP); textStyle(BOLD); textSize(22);
    text("Eclectique Lab", -fw/2+pad, -fh/2+pad);

    // Ligne
    stroke(darkMode ? color(220,205,175,a*0.3) : color(42,28,10,a*0.3));
    strokeWeight(1.4);
    line(-fw/2+pad, -fh/2+pad+34, fw/2-pad, -fh/2+pad+34);

    // Grille 3×2
    let cols  = 2, rows = 2;
    let gpad  = 16;
    let gx    = -fw/2 + pad;
    let gy    = -fh/2 + pad + 50;
    let gw    = fw - pad*2;
    let gh    = fh - pad*2 - 56;
    let cellW = (gw - gpad*(cols-1)) / cols;
    let cellH = (gh - gpad*(rows-1)) / rows;
    let imgH  = cellH * 0.72;  // hauteur image dans la fiche
    let infoH = cellH - imgH;  // hauteur zone infos

    // Détecter le survol dans la grille
    let mx = mouseX - width/2 - cx;
    let my = mouseY - height/2 - cy;
    eclectiqueHovered = -1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let idx = r*cols+c;
        let x = gx + c*(cellW+gpad);
        let y = gy + r*(cellH+gpad);
        if (mx > x && mx < x+cellW && my > y && my < y+cellH) eclectiqueHovered = idx;
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let idx = r*cols+c;
        let p   = ECLECTIQUE_PROJETS[idx];
        let x   = gx + c*(cellW+gpad);
        let y   = gy + r*(cellH+gpad);
        let isHov = (eclectiqueHovered === idx);

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
          // Clipper à la zone de la fiche
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
        text(p.titre, x+ip, iy);

        // Année + Client
        fill(darkMode ? color(180,165,140,a) : color(90,70,45,a));
        textStyle(NORMAL); textSize(10);
        text(p.annee + ' · ' + p.client, x+ip, iy+16);



        // Curseur pointer + clic sur fiche
        if (isHov) {
          noFill(); stroke(darkMode ? color(220,205,175,a*0.8) : color(42,28,10,a*0.6));
          strokeWeight(1.5); rect(x, y, cellW, cellH, 8);
        }
      }
    }
  }

  // ── Page détail projet ──────────────────────────────────────────────────────
  if (eclectiqueSelected >= 0 && detailProgress > 0.01) {
    let de = easeInOut(detailProgress);
    let p  = ECLECTIQUE_PROJETS[eclectiqueSelected];
    let bg = darkMode ? color(30,25,18) : color(250,247,240);
    let tc = darkMode ? color(220,205,175) : color(42,28,10);
    let sc = darkMode ? color(160,145,120) : color(100,80,55);

    // Fond blanc/sombre qui recouvre la grille
    noStroke();
    fill(red(bg), green(bg), blue(bg), de*255);
    rect(-fw/2, -fh/2, fw, fh, lerp(4,10,e));

    if (de > 0.6) {
      let da = map(de, 0.6, 1.0, 0, 255);
      let pad = 36;

      // Bouton retour ← (hover = gras + curseur doigt)
      let retBtnX = width/2 + cx - fw/2 + pad;
      let retBtnY = height/2 + cy - fh/2 + pad;
      retourHovered = (mouseX > retBtnX - 10 && mouseX < retBtnX + 130 &&
                       mouseY > retBtnY - 16 && mouseY < retBtnY + 16);
      noStroke();
      fill(red(tc), green(tc), blue(tc), retourHovered ? da : da*0.65);
      textAlign(LEFT, CENTER);
      textStyle(retourHovered ? BOLD : NORMAL);
      textSize(retourHovered ? 14 : 13);
      text("← Retour", -fw/2+pad, -fh/2+pad);
      if (retourHovered) cursor(HAND);

      // Image grande
      let imgX = -fw/2+pad, imgY = -fh/2+pad+36;
      let imgW  = fw - pad*2, imgH2 = fh * 0.52;
      let proj = ECLECTIQUE_PROJETS[eclectiqueSelected];
      let colW  = (fw - pad*3) / 2;
      let colH  = fh - pad*2 - 40;
      let col1X = -fw/2 + pad;          // colonne gauche (vidéo)
      let col2X = -fw/2 + pad*2 + colW; // colonne droite (infos)
      let colY  = -fh/2 + pad + 40;

      // Colonne gauche : zone vidéo (l'iframe est positionnée en HTML par-dessus)
      if (proj.preview) {
        // iframe positionnée en HTML, pas de fond canvas
      } else if (eclectiqueImgs[eclectiqueSelected]) {
        tint(255, da);
        image(eclectiqueImgs[eclectiqueSelected], col1X, colY, colW, colH);
        noTint();
      }

      // Colonne droite : infos
      let iy = colY + 10;

      // Titre cliquable (lien vers projet)
      noStroke(); fill(red(tc), green(tc), blue(tc), da);
      textAlign(LEFT, TOP); textStyle(BOLD); textSize(26);
      textWrap(WORD);
      text(proj.titre, col2X, iy, colW, 80);
      // Soulignement si hover sur le titre
      let titreHov = (mouseX > width/2 + col2X && mouseX < width/2 + col2X + colW &&
                      mouseY > height/2 + iy    && mouseY < height/2 + iy + 40);
      if (titreHov && proj.lien) {
        stroke(red(tc), green(tc), blue(tc), da*0.7);
        strokeWeight(1.5);
        line(col2X, iy + 32, col2X + textWidth(proj.titre), iy + 32);
        cursor(HAND);
      }

      // Ligne séparatrice
      stroke(red(tc), green(tc), blue(tc), da*0.2);
      strokeWeight(1);
      line(col2X, iy + 70, col2X + colW, iy + 70);

      // Année
      noStroke(); fill(red(sc), green(sc), blue(sc), da);
      textStyle(NORMAL); textSize(12);
      text("Année", col2X, iy + 84);
      fill(red(tc), green(tc), blue(tc), da);
      textStyle(BOLD); textSize(14);
      text(proj.annee, col2X, iy + 100);

      // Client
      noStroke(); fill(red(sc), green(sc), blue(sc), da);
      textStyle(NORMAL); textSize(12);
      text("Client", col2X, iy + 130);
      fill(red(tc), green(tc), blue(tc), da);
      textStyle(BOLD); textSize(14);
      text(proj.client, col2X, iy + 146);

      // Description
      noStroke(); fill(red(sc), green(sc), blue(sc), da);
      textStyle(NORMAL); textSize(12);
      text("Description", col2X, iy + 176);
      fill(red(tc), green(tc), blue(tc), da);
      textStyle(NORMAL); textSize(13);
      textLeading(20);
      text(proj.desc, col2X, iy + 194, colW, 120);


    }
  }

  pop();
}

// ── Debug zones ───────────────────────────────────────────────────────────────
function drawDebugZones() {
  if (!DEBUG_ZONES) return;
  push(); translate(width/2, height/2);
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
    text('['+i+'] '+sections[z.folder].label + (isHov ? ' ◀' : ''), lx + 5, ly - 14);
  }

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
           : onZone    ? '↵ clic = ouvrir ['+sections[hovered].label+']'
           :              '📍 x:'+mx+'  y:'+my+'  [clic = copier]';
  text(hint, bx+8, by+11);
  pop();
}

// ── Interaction ───────────────────────────────────────────────────────────────
function mouseMoved()  {
  if (sheetTarget < 0.5 && introLanded) updateHover();
  // Remettre le curseur flèche si on n'est pas sur le bouton retour
  if (!retourHovered || detailProgress < 0.5) cursor(ARROW);
}
function mouseDragged(){ if (sheetTarget < 0.5 && introLanded) updateHover(); }

function updateHover() {
  let mx = mouseX - width/2;
  let my = mouseY - height/2;

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

function mousePressed() {
  // Sur mobile (touch), mettre à jour le hover avant de traiter le clic
  if (touches.length > 0 && sheetTarget < 0.5 && introLanded) updateHover();

  // ── Graphisme : onglets catégorie ─────────────────────────────────────────
  if (activeFolder === 1 && sheetProgress > 0.75 && detailTarget < 0.5) {
    let endW = min(width*0.88, 1020), endH = min(height*0.88, 760);
    let e    = easeInOut(sheetProgress);
    let cx   = lerp(map(1,0,N-1,-IMG_W*0.1,IMG_W*0.15), 0, e);
    let cy   = lerp(map(1,0,N-1,-IMG_H*0.15,IMG_H*0.1), -10, e);
    let fw   = lerp(180, endW, e);
    let pad  = 32;
    let cats = ['Tous', ...new Set(GRAPHISME_PROJETS.map(p => p.categorie))];
    let tabX = width/2 + cx - fw/2 + pad;
    let tabY = height/2 + cy - endH/2 + pad + 44;
    let tabH = 24, tabGap = 8;
    for (let ci = 0; ci < cats.length; ci++) {
      textSize(11); textStyle(cats[ci] === graphismeCategory ? BOLD : NORMAL);
      let tw = textWidth(cats[ci]) + 16;
      if (mouseX > tabX && mouseX < tabX+tw && mouseY > tabY && mouseY < tabY+tabH) {
        graphismeCategory = cats[ci];
        graphismeHovered  = -1;
        return false;
      }
      tabX += tw + tabGap;
    }
  }

  // ── Graphisme : flèches carousel ─────────────────────────────────────────
  if (activeFolder === 1 && detailProgress > 0.6 && graphismeSelected >= 0) {
    let p = GRAPHISME_PROJETS[graphismeSelected];
    if (p.imgs && p.imgs.length > 1) {
      let endW = min(width*0.88, 1020), endH = min(height*0.88, 760);
      let eV   = easeInOut(sheetProgress);
      let cx2  = lerp(map(1,0,N-1,-IMG_W*0.1,IMG_W*0.15), 0, eV);
      let cy2  = lerp(map(1,0,N-1,-IMG_H*0.15,IMG_H*0.1), -10, eV);
      let fw2  = lerp(180, endW, eV);
      let fh2  = lerp(200, endH, eV);
      let pad     = 36;
      let avail2  = fw2 - pad*3;
      let col1W2  = avail2 * 0.62;
      let colH2   = fh2 - pad*2 - 40;
      let col1X2  = width/2 + cx2 - fw2/2 + pad;
      let colY2   = height/2 + cy2 - fh2/2 + pad + 40;
      let arrowY  = colY2 + colH2/2;
      let arwSize = 28;
      // Flèche gauche
      if (graphismeCarouselIdx > 0 &&
          mouseX > col1X2 && mouseX < col1X2+arwSize*1.4 &&
          mouseY > arrowY-arwSize && mouseY < arrowY+arwSize) {
        graphismeCarouselIdx--;
        return false;
      }
      // Flèche droite
      if (graphismeCarouselIdx < p.imgs.length-1 &&
          mouseX > col1X2+col1W2-arwSize*1.4 && mouseX < col1X2+col1W2 &&
          mouseY > arrowY-arwSize && mouseY < arrowY+arwSize) {
        graphismeCarouselIdx++;
        return false;
      }
    }
  }

  // ── Graphisme : clic fiche → détail ──────────────────────────────────────
  if (activeFolder === 1 && sheetProgress > 0.75 && graphismeHovered >= 0 && detailTarget < 0.5) {
    let projets   = ((graphismeCategory === 'Tous')
      ? GRAPHISME_PROJETS
      : GRAPHISME_PROJETS.filter(p => p.categorie === graphismeCategory))
      .slice().sort((a, b) => parseInt(b.annee) - parseInt(a.annee));
    let origIdx   = GRAPHISME_PROJETS.indexOf(projets[graphismeHovered]);
    graphismeSelected  = origIdx;
    graphismeCarouselIdx = 0;
    detailTarget  = 1;
    let p = GRAPHISME_PROJETS[origIdx];
    if (p.preview) showPreviewFrame(p.preview, p.ratio);
    return false;
  }

  // ── Graphisme : bouton retour ─────────────────────────────────────────────
  if (activeFolder === 1 && detailProgress > 0.6) {
    let endW = min(width*0.88, 1020), endH = min(height*0.88, 760);
    let e    = easeInOut(sheetProgress);
    let cx   = lerp(map(1,0,N-1,-IMG_W*0.1,IMG_W*0.15), 0, e);
    let cy   = lerp(map(1,0,N-1,-IMG_H*0.15,IMG_H*0.1), -10, e);
    let fw   = lerp(180, endW, e);
    let rx   = width/2 + cx - fw/2 + 36;
    let ry   = height/2 + cy - endH/2 + 36;
    if (mouseX > rx-10 && mouseX < rx+130 && mouseY > ry-16 && mouseY < ry+16) {
      detailTarget       = 0;
      graphismeRetourHov = false;
      cursor(ARROW);
      hidePreviewFrame();
      hideLocalVideoFrame();
      hideCarouselPdfFrame();
      hideInstagramFrame();
      hideFigmaFrame();
      setTimeout(() => { graphismeSelected = -1; detailProgress = 0; }, 500);
      return false;
    }
  }

  // Clic sur une fiche Eclectique Lab → ouvrir détail
  if (activeFolder === 3 && sheetProgress > 0.75 && eclectiqueHovered >= 0 && detailTarget < 0.5) {
    eclectiqueSelected = eclectiqueHovered;
    detailTarget = 1;
    // Créer iframe si le projet a un aperçu
    let p = ECLECTIQUE_PROJETS[eclectiqueHovered];
    if (p.preview) showPreviewFrame(p.preview, p.ratio);
    return false;
  }

  // Bouton retour ← dans le détail
  if (activeFolder === 3 && detailProgress > 0.6) {
    let endW = min(width*0.88, 1020), endH = min(height*0.88, 760);
    let pad  = 36;
    let rx   = width/2 - endW/2 + pad;
    let ry   = height/2 - endH/2 + pad;
    let bxR  = width/2 + endW/2 - 20;
    let byR  = height/2 - endH/2 + 20;
    if (mouseX > rx - 10 && mouseX < rx + 130 && mouseY > ry - 16 && mouseY < ry + 16) {
      detailTarget = 0;
      retourHovered = false;
      cursor(ARROW);
      hidePreviewFrame();
      setTimeout(() => { eclectiqueSelected = -1; detailProgress = 0; }, 500);
      return false;
    }
    // Clic sur le titre → ouvrir le lien
    if (eclectiqueSelected >= 0) {
      let p    = ECLECTIQUE_PROJETS[eclectiqueSelected];
      let endW2 = min(width*0.88, 1020), endH2 = min(height*0.88, 760);
      let colW2 = (endW2 - pad*3) / 2;
      let col2X2 = width/2 - endW2/2 + pad*2 + colW2;
      let iy2   = height/2 - endH2/2 + pad + 40 + 10;
      if (p.lien &&
          mouseX > col2X2 && mouseX < col2X2 + colW2 &&
          mouseY > iy2    && mouseY < iy2 + 40) {
        window.open(p.lien, '_blank');
        return false;
      }
    }
  }
}

function mouseClicked() {
  if (!introLanded) return;

  // Debug
  if (DEBUG_ZONES) {
    // Clic sur une hitbox → ouvrir la fiche (si option activée)
    if (DEBUG_OPEN_SHEET && hovered >= 0 && sheetTarget < 0.5) {
      activeFolder  = hovered;
      sheetProgress = 0;
      sheetTarget   = 1;
      hovered       = -1;
      return;
    }
    // Clic hors hitbox → copier les coordonnées
    let mx = round(mouseX - width/2);
    let my = round(mouseY - height/2);
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
  videoBtnClicked = false;

  if (sheetProgress > 0.5) {
    // Dimensions selon le dossier actif
    let isBigSheet = (activeFolder === 1 || activeFolder === 2 || activeFolder === 3);
    let endW = isBigSheet ? min(width*0.88, 1020) : min(width*0.70, 820);
    let endH = isBigSheet ? min(height*0.88, 760) : min(height*0.80, 680);

    // 1. Bouton fermer ✕
    let bx = width/2  + endW/2 - 20;
    let by = height/2 - endH/2 + 20;
    if (dist(mouseX, mouseY, bx, by) < 22) { closeSheet(); return; }

    // 1b. Clic sur une cellule vidéo → changer la vidéo active
    if (activeFolder === 2 && sheetProgress > 0.75) {
      let pad2 = 32, gpad2 = 14;
      let gw2   = endW - pad2*2;
      let cellW2 = (gw2 - gpad2*2) / 3;
      let cellH2 = cellW2 * 9/16;
      let rowH2  = cellH2 + 44;
      let gridTop2 = height/2 - endH/2 + pad2 + 50;
      for (let idx = 0; idx < VIDEO_PROJETS.length; idx++) {
        let row2 = floor(idx / 3);
        let col2 = idx % 3;
        let vx2  = width/2 - endW/2 + pad2 + col2*(cellW2+gpad2);
        let vy2  = gridTop2 + row2*rowH2 - videoScrollY;
        if (mouseX > vx2 && mouseX < vx2+cellW2 && mouseY > vy2 && mouseY < vy2+cellH2) {
          if (idx !== videoIndex) { videoIndex = idx; hideVideoFrame(); }
          return;
        }
      }
    }

    // 2. Clic sur la feuille suivante (partie visible qui dépasse)
    if (activeFolder < N - 1) {
      let sd   = getSheetDims(activeFolder);
      let offY = sd.cy - NEXT_SHEET_PEEK;
      let nx = width/2 + NEXT_SHEET_OFFSET_X, ny = height/2 + offY;
      let ax = width/2, ay = height/2 + sd.cy;
      let inNext   = mouseX > nx-sd.w/2 && mouseX < nx+sd.w/2 &&
                     mouseY > ny-sd.h/2 && mouseY < ny+sd.h/2;
      let inActive = mouseX > ax-sd.w/2 && mouseX < ax+sd.w/2 &&
                     mouseY > ay-sd.h/2 && mouseY < ay+sd.h/2;
      if (inNext && !inActive) {
        activeFolder++;
        sheetProgress = 0.65;
        hideVideoFrame();
        return;
      }
    }

    // 3. Clic en dehors → fermer
    let sx = width/2-endW/2, sy = height/2-endH/2;
    if (mouseX<sx||mouseX>sx+endW||mouseY<sy||mouseY>sy+endH) {
      closeSheet(); return;
    }
    return;
  }



  // Ouvrir un dossier
  if (hovered >= 0 && sheetTarget < 0.5) {
    activeFolder  = hovered;
    sheetProgress = 0;
    sheetTarget   = 1;
    hovered       = -1;
  }
}

function closeSheet() {
  sheetTarget        = 0;
  detailTarget       = 0;
  eclectiqueSelected = -1;
  graphismeSelected    = -1;
  graphismeCarouselIdx = 0;
  detailProgress     = 0;
  videoHovered       = -1;
  videoScrollY           = 0;
  videoScrollTarget      = 0;
  graphismeScrollY       = 0;
  graphismeScrollTarget  = 0;
  hideVideoFrame();
  hidePreviewFrame();
  hideLocalVideoFrame();
  hideCarouselPdfFrame();
  hideInstagramFrame();
  hideFigmaFrame();
  setTimeout(() => { activeFolder = -1; sheetProgress = 0; }, 400);
}

// ── Aperçu vidéo via iframe ───────────────────────────────────────────────────
function showPreviewFrame(url, ratio) {
  hidePreviewFrame();
  let endW = min(width*0.88, 1020);
  let endH = min(height*0.88, 760);
  let pad  = 36;
  let colW = (endW - pad*3) / 2;
  let colH = endH - pad*2 - 40;

  let fx = width/2  - endW/2 + pad;
  let fy = height/2 - endH/2 + pad + 40;

  // Ratio selon le projet (16:9 par défaut, 9:16 pour vertical)
  let isVertical = ratio === '9/16';
  let videoH = isVertical ? colH        : colW * 9/16;
  let videoW = isVertical ? colH * 9/16 : colW;
  let videoX = isVertical ? fx + (colW - videoW) / 2 : fx;
  let videoY = fy;

  // Wrapper pour masquer les bandes noires YouTube (overflow hidden)
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

  // iframe légèrement agrandie pour couper les bandes noires
  let oversize = 1.0;
  previewFrame = createElement('iframe');
  previewFrame.attribute('src', url);
  previewFrame.attribute('allow', 'autoplay; encrypted-media');
  previewFrame.attribute('allowfullscreen', '');
  previewFrame.style('position', 'absolute');
  previewFrame.style('left',   '0px');
  previewFrame.style('top',    '0px');
  previewFrame.style('width',  (videoW * oversize) + 'px');
  previewFrame.style('height', (videoH * oversize) + 'px');
  previewFrame.style('border', 'none');
  previewFrame.style('pointer-events', 'auto');
  previewFrame.parent(wrapper);

  // Garder référence du wrapper pour le supprimer
  previewFrame._wrapper = wrapper;
}

function hidePreviewFrame() {
  if (previewFrame) {
    if (previewFrame._wrapper) previewFrame._wrapper.remove();
    previewFrame.remove();
    previewFrame = null;
  }
}

function mouseWheel(event) {
  // Scroller la grille projets
  if (activeFolder === 1 && sheetProgress > 0.75 && detailTarget < 0.5) {
    let filtered = graphismeCategory === 'Tous'
      ? GRAPHISME_PROJETS
      : GRAPHISME_PROJETS.filter(p => p.categorie === graphismeCategory);
    let endH  = min(height*0.88, 760);
    let pad   = 36;
    let rows  = ceil(filtered.length / 2);
    let visH  = endH - pad*2 - 90;
    let cellH = max(min((visH - 16*(rows-1)) / rows, 220), 140);
    let totalH = rows * (cellH + 16) - 16;
    let maxS  = max(0, totalH - visH);
    graphismeScrollTarget = constrain(graphismeScrollTarget + event.delta * 0.8, 0, maxS);
    return false;
  }
  // Scroller la grille vidéo
  if (activeFolder === 2 && sheetProgress > 0.75) {
    let endH  = min(height*0.88, 760);
    let pad   = 32;
    let gw    = min(width*0.88, 1020) - pad*2;
    let cellW = (gw - 14*2) / 3;
    let cellH = cellW * 9/16;
    let rowH  = cellH + 44;
    let visH  = endH - pad - (pad + 50);
    let maxS  = max(0, ceil(VIDEO_PROJETS.length/3) * rowH - visH);
    videoScrollTarget = constrain(videoScrollTarget + event.delta * 0.8, 0, maxS);
    return false;
  }
}

function keyPressed() {
  if (keyCode === ESCAPE && sheetTarget > 0.5) {
    closeSheet();
    return;
  }
}

// ── Support tactile mobile ────────────────────────────────────────────────────
// p5.js appelle automatiquement mousePressed/mouseClicked depuis le touch
// quand touchStarted/touchEnded ne sont pas définis.
// On ajoute seulement updateHover() en début de mousePressed (voir ci-dessus)
// et touchMoved pour le scroll.

function touchMoved() {
  let dy = pmouseY - mouseY;
  // Scroll dans la fiche Graphisme
  if (activeFolder === 1 && sheetProgress > 0.75 && detailTarget < 0.5) {
    let endH = min(height*0.88, 760);
    let pad  = 32;
    let tabH = 40, gpad = 12;
    let filtered = graphismeCategory === 'Tous'
      ? GRAPHISME_PROJETS
      : GRAPHISME_PROJETS.filter(p => p.categorie === graphismeCategory);
    let cellW = (min(width*0.88,1020) - pad*2 - gpad) / 2;
    let cellH = max(cellW * 0.62, 140);
    let rows  = ceil(filtered.length / 2);
    let totalH = rows * (cellH + gpad);
    let visH  = endH - pad - tabH - 16 - pad;
    let maxS  = max(0, totalH - visH);
    graphismeScrollTarget = constrain(graphismeScrollTarget - dy, 0, maxS);
  }
  // Scroll dans la fiche Vidéo
  if (activeFolder === 2 && sheetProgress > 0.75) {
    let endH  = min(height*0.88, 760);
    let pad   = 32;
    let gw    = min(width*0.88, 1020) - pad*2;
    let cellW = (gw - 14*2) / 3;
    let cellH = cellW * 9/16;
    let rowH  = cellH + 44;
    let visH  = endH - pad - (pad + 50);
    let maxS  = max(0, ceil(VIDEO_PROJETS.length/3) * rowH - visH);
    videoScrollTarget = constrain(videoScrollTarget - dy, 0, maxS);
  }
  return false;
}