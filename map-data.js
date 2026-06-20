/* ==========================================================
   PBTips — map-data.js
   SATU-SATUNYA file yang perlu kamu edit untuk isi konten
   Map Guide (spot pre-aim, foto overview, tips umum per map).

   File ini TERPISAH dari sistem Supabase "tips" (spam bom).
   Map Guide ini murni statis — kamu edit di sini, langsung
   muncul di map-guide.html, gak perlu approval/login admin.

   CARA ISI SPOT:
   {
     title: 'Nama lokasi / pintu',
     desc: 'Arah bidikan & penjelasan spotnya',
     side: 'ct',  // ct / t / both
   },

   CARA ISI FOTO OVERVIEW MAP:
   Taro file gambarnya di folder yang sama (misal bikin folder
   "images/"), terus isi: image: 'images/downtown.jpg'

   PENTING: id harus persis sama kayak nama map di dropdown
   "Submit Tips" (index.html), biar nanti gampang disambungin.
   ========================================================== */

const MAPS = [
  {
    slug: 'downtown',
    name: 'Downtown', // PENTING: harus sama persis kayak nama di dropdown "Submit Tips"
    emoji: '🏙️',
    tagline: 'Map urban dengan banyak sudut mati',
    difficulty: 'medium', // easy / medium / hard
    image: '',
    spots: [
      // CONTOH (hapus ini dan ganti dengan data asli kamu):
      {
        title: 'Pintu A — Masuk Lorong Kiri',
        desc: 'Saat masuk pintu A, langsung bidik ke sudut kiri atas dekat tembok. Musuh CT sering nungguin di sini.',
        side: 'ct',
      },
      {
        title: 'Jembatan Tengah',
        desc: 'Dari spawn T, bidik ke celah jembatan bagian kanan. Ada spot popular buat camping.',
        side: 'both',
      },
      {
        title: 'Pintu B — Tangga',
        desc: 'Sebelum naik tangga, bidik ke paling atas kanan. CT sering pre-aim dari sini.',
        side: 'ct',
      },
    ],
    generalTips: [
      'Selalu clear sudut kiri dulu sebelum masuk lorong manapun.',
      'Spawn CT di Downtown punya keuntungan rotasi, jangan terburu-buru push.',
      'Map ini favorit camper — lempar flash sebelum masuk area sempit.',
    ],
  },

  { slug: 'luxville',      name: 'Luxville',     emoji: '🏛️', tagline: 'Area mewah, banyak cover vertikal',     difficulty: 'hard',   image: '', spots: [], generalTips: [] },
  { slug: 'blowcity',      name: 'Blowcity',     emoji: '💣', tagline: 'Map sempit, spam bom merajalela',       difficulty: 'medium', image: '', spots: [], generalTips: [] },
  { slug: 'sandstrom',     name: 'Sandstrom',    emoji: '🏜️', tagline: 'Map gurun terbuka, sightline panjang',  difficulty: 'hard',   image: '', spots: [], generalTips: [] },
  { slug: 'midtown',       name: 'Midtown',      emoji: '🌆', tagline: 'Map kota padat, banyak rotasi cepat',   difficulty: 'medium', image: '', spots: [], generalTips: [] },
  { slug: 'safehouse',     name: 'Safehouse',    emoji: '🏠', tagline: 'Map indoor, jarak deket dominan',       difficulty: 'easy',   image: '', spots: [], generalTips: [] },
  { slug: 'provence',      name: 'Provence',     emoji: '🌾', tagline: 'Map pedesaan, banyak cover alami',      difficulty: 'medium', image: '', spots: [], generalTips: [] },
  { slug: 'broken-alley',  name: 'Broken Alley', emoji: '🧱', tagline: 'Lorong sempit reruntuhan, CQB intens',  difficulty: 'hard',   image: '', spots: [], generalTips: [] },
];

// ===== LOOKUP TABLES — dipakai bareng buat render label/warna =====
const SIDE_LABEL = { ct: 'Side CT', t: 'Side T', both: 'Keduanya' };
const SIDE_CLASS = { ct: 'tag-ct', t: 'tag-t', both: 'tag-both' };
const DIFF_LABEL = { easy: 'Mudah', medium: 'Sedang', hard: 'Susah' };
const DIFF_CLASS = { easy: 'diff-easy', medium: 'diff-medium', hard: 'diff-hard' };
