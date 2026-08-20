import africanWomImg from './african_wom.png';
import bintiImg from './binti.png';
import blackImg from './black.png';
import frameByFrameImg from './frame_by_frame.png';
import iSpeakImg from './i_speak.png';
import laughImg from './laugh.png';
import mamaMbogaImg from './mama_mboga.png';
import realPeopleImg from './real_people.png';
import sondekaImg from './sondeka.png';
import talesImg from './tales.png';
import tanaImg from './tana.png';

const logoSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" fill="none"><rect width="400" height="100" rx="16" fill="%2318181B"/><circle cx="50" cy="50" r="28" fill="%234F46E5" opacity="0.2"/><circle cx="50" cy="50" r="18" stroke="%236366F1" stroke-width="4"/><path d="M42 50L48 56L58 44" stroke="%23A5B4FC" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="90" y="48" fill="%23FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="22" letter-spacing="1">CREATIVES GARAGE</text><text x="90" y="68" fill="%23818CF8" font-family="system-ui, sans-serif" font-weight="700" font-size="12" letter-spacing="2">AFRICAN CREATIVE HUB</text></svg>`;

const marketAccessSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" fill="none"><defs><linearGradient id="maGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23065F46"/><stop offset="50%" stop-color="%23047857"/><stop offset="100%" stop-color="%23022C22"/></linearGradient></defs><rect width="800" height="500" fill="url(%23maGrad)"/><circle cx="650" cy="150" r="220" fill="%2310B981" opacity="0.15"/><circle cx="150" cy="380" r="180" fill="%2334D399" opacity="0.1"/><g transform="translate(100, 120)"><rect width="600" height="260" rx="24" fill="%23064E3B" stroke="%23059669" stroke-width="2" opacity="0.9"/><text x="40" y="80" fill="%236EE7B7" font-family="system-ui, sans-serif" font-weight="800" font-size="14" letter-spacing="3">MARKET ACCESS PROGRAMME</text><text x="40" y="130" fill="%23FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="36">Connecting African Talent to Global Markets</text><text x="40" y="175" fill="%23A7F3D0" font-family="system-ui, sans-serif" font-weight="500" font-size="18">Kalabars • Baiskeli Store • CG Studios • Frame by Frame</text></g></svg>`;

const collectionOfThoughtsSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" fill="none"><defs><linearGradient id="ctGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%234C1D95"/><stop offset="50%" stop-color="%236B21A8"/><stop offset="100%" stop-color="%233B0764"/></linearGradient></defs><rect width="800" height="500" fill="url(%23ctGrad)"/><circle cx="700" cy="350" r="250" fill="%23A855F7" opacity="0.15"/><circle cx="100" cy="100" r="160" fill="%23C084FC" opacity="0.1"/><g transform="translate(100, 120)"><rect width="600" height="260" rx="24" fill="%23581C87" stroke="%239333EA" stroke-width="2" opacity="0.9"/><text x="40" y="80" fill="%23E9D5FF" font-family="system-ui, sans-serif" font-weight="800" font-size="14" letter-spacing="3">COLLECTION OF THOUGHTS</text><text x="40" y="130" fill="%23FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="34">Anthologies, Arts %26 Mental Wellness</text><text x="40" y="175" fill="%23DDD6FE" font-family="system-ui, sans-serif" font-weight="500" font-size="18">Mental Notes • Stories of Pride • Category Is • Copy Paste</text></g></svg>`;

export const Images = {
  logo: logoSvg,
  marketAccess: marketAccessSvg,
  collectionOfThoughts: collectionOfThoughtsSvg,
  africanWom: africanWomImg,
  binti: bintiImg,
  black: blackImg,
  frameByFrame: frameByFrameImg,
  iSpeak: iSpeakImg,
  laugh: laughImg,
  mamaMboga: mamaMbogaImg,
  realPeople: realPeopleImg,
  sondeka: sondekaImg,
  tales: talesImg,
  tana: tanaImg,
};

export function resolveImageUrl(url?: string): string {
  if (!url) return '';
  const u = url.trim();

  // Return real user base64 uploads, SVG data URLs, or blob URLs immediately
  if (u.startsWith('data:') || u.startsWith('blob:')) {
    return u;
  }

  const clean = u.toLowerCase();

  // If it's a keyword or old SVG placeholder with text matching these
  if (clean.includes('i_speak') || clean.includes('ispeak') || clean.includes('i speak')) return Images.iSpeak;
  if (clean.includes('african_wom') || clean.includes('africanwom') || clean.includes('african women')) return Images.africanWom;
  if (clean.includes('binti')) return Images.binti;
  if (clean.includes('black')) return Images.black;
  if (clean.includes('frame_by_frame') || clean.includes('framebyframe') || clean.includes('frame by frame')) return Images.frameByFrame;
  if (clean.includes('laugh')) return Images.laugh;
  if (clean.includes('mama_mboga') || clean.includes('mamamboga') || clean.includes('mama mboga')) return Images.mamaMboga;
  if (clean.includes('real_people') || clean.includes('realpeople') || clean.includes('real people')) return Images.realPeople;
  if (clean.includes('sondeka')) return Images.sondeka;
  if (clean.includes('tales')) return Images.tales;
  if (clean.includes('tana')) return Images.tana;
  if (clean.includes('logo')) return Images.logo;
  if (clean.includes('market_access') || clean.includes('marketaccess')) return Images.marketAccess;
  if (clean.includes('collection_of_thoughts') || clean.includes('collectionofthoughts')) return Images.collectionOfThoughts;

  return url;
}

export default Images;
