// Album Trivia - pure HTML/CSS/JS
// Loads questions from either:
//  1) Demo data below, or
//  2) A published Google Sheet JSON endpoint (see SHEET_JSON_URL)
//
// Sheet columns expected:
// id, album, difficulty, question, choice_a, choice_b, choice_c, choice_d, correct

const DIFFICULTY_POINTS = {
  easy: 1,
  medium: 2,
  hard: 3,
};

// Mix settings: most easy, several medium, a few hard
const MIX_COUNTS = {
  easy: 9,
  medium: 4,
  hard: 2,
};

// Option A (recommended for simple static hosting):
// Publish a Google Sheet as CSV and use a CSV->JSON conversion (not included), OR
// publish and use a small proxy (Apps Script / Cloudflare Worker).
//
// Option B (no extra backend):
// Use the Google Visualization API query endpoint (works for public/published sheets).
// This file supports Option B out of the box.
//
// 1) In Google Sheets: File -> Share -> Publish to web (entire document)
// 2) Put your SHEET_ID below.
// 3) The first worksheet is usually "Sheet1".
const SHEET_ID = ""; // TODO: set to your Google Sheet id
const SHEET_NAME = "Sheet1"; // TODO: change if needed

// Google Visualization API endpoint returns JS wrapped JSON.
// We'll fetch it and parse out the JSON.
const SHEET_JSON_URL = (SHEET_ID)
  ? `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`
  : "";

// Demo questions: Taylor Swift album is "1989" (user wrote 1986).
const DEMO_QUESTIONS = [
  {
    id: "1989-1",
    album: "1989",
    difficulty: "easy",
    question: "Which Taylor Swift album includes the hit song 'Blank Space'?",
    choice_a: "Red",
    choice_b: "1989",
    choice_c: "Speak Now",
    choice_d: "Lover",
    correct: "1989",
  },
  {
    id: "1989-2",
    album: "1989",
    difficulty: "easy",
    question: "What year was '1989' originally released?",
    choice_a: "2012",
    choice_b: "2014",
    choice_c: "2016",
    choice_d: "2019",
    correct: "2014",
  },
  {
    id: "1989-3",
    album: "1989",
    difficulty: "medium",
    question: "Which track opens the standard edition of '1989'?",
    choice_a: "Style",
    choice_b: "Welcome to New York",
    choice_c: "Out of the Woods",
    choice_d: "Shake It Off",
    correct: "Welcome to New York",
  },
  {
    id: "1989-4",
    album: "1989",
    difficulty: "medium",
    question: "Which song from '1989' includes the lyric 'Players gonna play, play, play, play, play'?",
    choice_a: "Bad Blood",
    choice_b: "Shake It Off",
    choice_c: "Wildest Dreams",
    choice_d: "New Romantics",
    correct: "Shake It Off",
  },
  {
    id: "1989-5",
    album: "1989",
    difficulty: "hard",
    question: "Which producer is notably associated with the pop sound of several '1989' tracks?",
    choice_a: "Rick Rubin",
    choice_b: "Max Martin",
    choice_c: "T Bone Burnett",
    choice_d: "Quincy Jones",
    correct: "Max Martin",
  },
  {
    id: "1989-6",
    album: "1989",
    difficulty: "hard",
    question: "Which of these is a bonus track on the deluxe edition of '1989'?",
    choice_a: "Clean",
    choice_b: "Wonderland",
    choice_c: "I Know Places",
    choice_d: "All You Had To Do Was Stay",
    correct: "Wonderland",
  },
  // --- Additional demo questions (15 total) ---
  {
    id: "1989-7",
    album: "1989",
    difficulty: "easy",
    question: "Which '1989' single features the line 'Cause baby now we got bad blood'?",
    choice_a: "Bad Blood",
    choice_b: "Style",
    choice_c: "Clean",
    choice_d: "This Love",
    correct: "Bad Blood",
  },
  {
    id: "1989-8",
    album: "1989",
    difficulty: "easy",
    question: "Which of these songs is on the standard tracklist of '1989'?",
    choice_a: "Enchanted",
    choice_b: "Wildest Dreams",
    choice_c: "All Too Well",
    choice_d: "Love Story",
    correct: "Wildest Dreams",
  },
  {
    id: "1989-9",
    album: "1989",
    difficulty: "easy",
    question: "'1989' is best described as primarily which genre shift for Taylor Swift at release?",
    choice_a: "Jazz",
    choice_b: "Synth-pop / pop",
    choice_c: "Heavy metal",
    choice_d: "Classical",
    correct: "Synth-pop / pop",
  },
  {
    id: "1989-10",
    album: "1989",
    difficulty: "easy",
    question: "Which song title is also a common fashion term?",
    choice_a: "Style",
    choice_b: "Clean",
    choice_c: "How You Get The Girl",
    choice_d: "I Know Places",
    correct: "Style",
  },
  {
    id: "1989-11",
    album: "1989",
    difficulty: "easy",
    question: "Which song from '1989' includes the phrase 'Are we out of the woods yet?'",
    choice_a: "Out of the Woods",
    choice_b: "New Romantics",
    choice_c: "This Love",
    choice_d: "Bad Blood",
    correct: "Out of the Woods",
  },
  {
    id: "1989-12",
    album: "1989",
    difficulty: "easy",
    question: "Which city is mentioned in the opening track title 'Welcome to New York'?",
    choice_a: "Los Angeles",
    choice_b: "New York",
    choice_c: "Nashville",
    choice_d: "Chicago",
    correct: "New York",
  },
  {
    id: "1989-13",
    album: "1989",
    difficulty: "medium",
    question: "Which track includes the lyric 'You got that James Dean daydream look in your eye'?",
    choice_a: "Style",
    choice_b: "All You Had To Do Was Stay",
    choice_c: "This Love",
    choice_d: "Clean",
    correct: "Style",
  },
  {
    id: "1989-14",
    album: "1989",
    difficulty: "medium",
    question: "Which of these tracks appears closest to the end of the standard edition tracklist?",
    choice_a: "Blank Space",
    choice_b: "Clean",
    choice_c: "Welcome to New York",
    choice_d: "Style",
    correct: "Clean",
  },
  {
    id: "1989-15",
    album: "1989",
    difficulty: "hard",
    question: "Which of these songs is part of the deluxe-edition bonus tracks (not standard edition) of '1989'?",
    choice_a: "New Romantics",
    choice_b: "All You Had To Do Was Stay",
    choice_c: "Style",
    choice_d: "Blank Space",
    correct: "New Romantics",
  },

  // ==================================
  // Demo quiz: Kendrick Lamar — DAMN.
  // (Hip-hop / rap, 2017)
  // ==================================
  {
    id: "damn-1",
    album: "DAMN.",
    difficulty: "easy",
    question: "Which artist released the album 'DAMN.'?",
    choice_a: "Kendrick Lamar",
    choice_b: "Drake",
    choice_c: "J. Cole",
    choice_d: "Kanye West",
    correct: "Kendrick Lamar",
  },
  {
    id: "damn-2",
    album: "DAMN.",
    difficulty: "easy",
    question: "In what year was 'DAMN.' released?",
    choice_a: "2015",
    choice_b: "2016",
    choice_c: "2017",
    choice_d: "2018",
    correct: "2017",
  },
  {
    id: "damn-3",
    album: "DAMN.",
    difficulty: "easy",
    question: "Which song from 'DAMN.' features Rihanna?",
    choice_a: "DNA.",
    choice_b: "LOYALTY.",
    choice_c: "HUMBLE.",
    choice_d: "LOVE.",
    correct: "LOYALTY.",
  },
  {
    id: "damn-4",
    album: "DAMN.",
    difficulty: "easy",
    question: "Which track became a breakout hit single from 'DAMN.'?",
    choice_a: "HUMBLE.",
    choice_b: "FEEL.",
    choice_c: "PRIDE.",
    choice_d: "LUST.",
    correct: "HUMBLE.",
  },
  {
    id: "damn-5",
    album: "DAMN.",
    difficulty: "medium",
    question: "Which track from 'DAMN.' features U2?",
    choice_a: "ELEMENT.",
    choice_b: "XXX.",
    choice_c: "DUCKWORTH.",
    choice_d: "GOD.",
    correct: "XXX.",
  },
  {
    id: "damn-6",
    album: "DAMN.",
    difficulty: "medium",
    question: "Which song from 'DAMN.' includes Zacari as a featured artist?",
    choice_a: "LOVE.",
    choice_b: "FEAR.",
    choice_c: "BLOOD.",
    choice_d: "DNA.",
    correct: "LOVE.",
  },
  {
    id: "damn-7",
    album: "DAMN.",
    difficulty: "medium",
    question: "Which track is the opening track on the standard edition of 'DAMN.'?",
    choice_a: "DNA.",
    choice_b: "BLOOD.",
    choice_c: "HUMBLE.",
    choice_d: "PRIDE.",
    correct: "BLOOD.",
  },
  {
    id: "damn-8",
    album: "DAMN.",
    difficulty: "hard",
    question: "'DAMN.' was awarded which major honor in 2018?",
    choice_a: "Pulitzer Prize for Music",
    choice_b: "Academy Award for Best Score",
    choice_c: "Grammy for Album of the Year",
    choice_d: "Brit Award for International Album",
    correct: "Pulitzer Prize for Music",
  },
  {
    id: "damn-9",
    album: "DAMN.",
    difficulty: "hard",
    question: "The track 'DUCKWORTH.' is named after whose last name?",
    choice_a: "Kendrick's mother",
    choice_b: "Kendrick's father",
    choice_c: "Kendrick's producer",
    choice_d: "Kendrick's manager",
    correct: "Kendrick's father",
  },
  {
    id: "damn-10",
    album: "DAMN.",
    difficulty: "easy",
    question: "Which of these tracks appears on 'DAMN.'?",
    choice_a: "Alright",
    choice_b: "King Kunta",
    choice_c: "LOVE.",
    choice_d: "Swimming Pools (Drank)",
    correct: "LOVE.",
  },

  // ============================================
  // Demo quiz: Daft Punk — Random Access Memories
  // (Electronic / disco, 2013)
  // ============================================
  {
    id: "ram-1",
    album: "Random Access Memories",
    difficulty: "easy",
    question: "Which duo released the album 'Random Access Memories'?",
    choice_a: "Daft Punk",
    choice_b: "Justice",
    choice_c: "The Chemical Brothers",
    choice_d: "Disclosure",
    correct: "Daft Punk",
  },
  {
    id: "ram-2",
    album: "Random Access Memories",
    difficulty: "easy",
    question: "In what year was 'Random Access Memories' released?",
    choice_a: "2009",
    choice_b: "2011",
    choice_c: "2013",
    choice_d: "2016",
    correct: "2013",
  },
  {
    id: "ram-3",
    album: "Random Access Memories",
    difficulty: "easy",
    question: "Which smash hit single from the album features Pharrell Williams?",
    choice_a: "Get Lucky",
    choice_b: "One More Time",
    choice_c: "Harder, Better, Faster, Stronger",
    choice_d: "Technologic",
    correct: "Get Lucky",
  },
  {
    id: "ram-4",
    album: "Random Access Memories",
    difficulty: "medium",
    question: "Which track from the album features Nile Rodgers on guitar?",
    choice_a: "Give Life Back to Music",
    choice_b: "Get Lucky",
    choice_c: "Within",
    choice_d: "Beyond",
    correct: "Get Lucky",
  },
  {
    id: "ram-5",
    album: "Random Access Memories",
    difficulty: "medium",
    question: "Which collaborator appears on the track 'Instant Crush'?",
    choice_a: "Julian Casablancas",
    choice_b: "Tame Impala",
    choice_c: "Kanye West",
    choice_d: "Skrillex",
    correct: "Julian Casablancas",
  },
  {
    id: "ram-6",
    album: "Random Access Memories",
    difficulty: "easy",
    question: "Which song title from the album starts with 'Lose'?",
    choice_a: "Lose Yourself",
    choice_b: "Lose Control",
    choice_c: "Lose Myself to Dance",
    choice_d: "Lose the Feeling",
    correct: "Lose Myself to Dance",
  },
  {
    id: "ram-7",
    album: "Random Access Memories",
    difficulty: "hard",
    question: "Which legendary musician appears on the album as a collaborator?",
    choice_a: "David Bowie",
    choice_b: "Paul McCartney",
    choice_c: "Giorgio Moroder",
    choice_d: "Prince",
    correct: "Giorgio Moroder",
  },
  {
    id: "ram-8",
    album: "Random Access Memories",
    difficulty: "hard",
    question: "The track 'Giorgio by Moroder' is partly told in what format?",
    choice_a: "A spoken-word interview/monologue",
    choice_b: "A live crowd chant",
    choice_c: "A radio DJ mix",
    choice_d: "A voicemail recording",
    correct: "A spoken-word interview/monologue",
  },
  {
    id: "ram-9",
    album: "Random Access Memories",
    difficulty: "medium",
    question: "Which track is the album's opener?",
    choice_a: "Give Life Back to Music",
    choice_b: "Get Lucky",
    choice_c: "Instant Crush",
    choice_d: "Contact",
    correct: "Give Life Back to Music",
  },
  {
    id: "ram-10",
    album: "Random Access Memories",
    difficulty: "medium",
    question: "Which track closes the standard edition of the album?",
    choice_a: "Touch",
    choice_b: "Doin' It Right",
    choice_c: "Contact",
    choice_d: "Motherboard",
    correct: "Contact",
  },

  // =====================================================
  // Demo quiz: Little Simz — Sometimes I Might Be Introvert
  // (Hip-hop / rap, 2021)
  // =====================================================
  {
    id: "simi-1",
    album: "Sometimes I Might Be Introvert",
    difficulty: "easy",
    question: "Which artist released the album 'Sometimes I Might Be Introvert'?",
    choice_a: "Little Simz",
    choice_b: "Rapsody",
    choice_c: "Noname",
    choice_d: "SZA",
    correct: "Little Simz",
  },
  {
    id: "simi-2",
    album: "Sometimes I Might Be Introvert",
    difficulty: "easy",
    question: "In what year was 'Sometimes I Might Be Introvert' released?",
    choice_a: "2019",
    choice_b: "2020",
    choice_c: "2021",
    choice_d: "2022",
    correct: "2021",
  },
  {
    id: "simi-3",
    album: "Sometimes I Might Be Introvert",
    difficulty: "easy",
    question: "The album title 'Sometimes I Might Be Introvert' is often abbreviated as what?",
    choice_a: "SIMBI",
    choice_b: "SIBMI",
    choice_c: "SMI",
    choice_d: "Introvert",
    correct: "SIMBI",
  },
  {
    id: "simi-4",
    album: "Sometimes I Might Be Introvert",
    difficulty: "easy",
    question: "Which of these is a track on the album?",
    choice_a: "Introvert",
    choice_b: "The Heart Part 5",
    choice_c: "Nikes",
    choice_d: "Runaway",
    correct: "Introvert",
  },
  {
    id: "simi-5",
    album: "Sometimes I Might Be Introvert",
    difficulty: "easy",
    question: "Which track title is also the name of a style of dance?",
    choice_a: "Rollin Stone",
    choice_b: "Point and Kill",
    choice_c: "Little Q, Pt. 2",
    choice_d: "I Love You, I Hate You",
    correct: "Point and Kill",
  },
  {
    id: "simi-6",
    album: "Sometimes I Might Be Introvert",
    difficulty: "easy",
    question: "Which track shares its title with the album's initials (SIMBI) theme of being introverted?",
    choice_a: "Introvert",
    choice_b: "Miss Understood",
    choice_c: "Woman",
    choice_d: "Fear No Man",
    correct: "Introvert",
  },
  {
    id: "simi-7",
    album: "Sometimes I Might Be Introvert",
    difficulty: "easy",
    question: "Little Simz is most commonly associated with which country?",
    choice_a: "United Kingdom",
    choice_b: "United States",
    choice_c: "Canada",
    choice_d: "Australia",
    correct: "United Kingdom",
  },
  {
    id: "simi-8",
    album: "Sometimes I Might Be Introvert",
    difficulty: "easy",
    question: "The album features the track 'Little Q, Pt. 2'. Which part number is it?",
    choice_a: "1",
    choice_b: "2",
    choice_c: "3",
    choice_d: "4",
    correct: "2",
  },
  {
    id: "simi-9",
    album: "Sometimes I Might Be Introvert",
    difficulty: "easy",
    question: "Which word appears in the album title?",
    choice_a: "Introvert",
    choice_b: "Extrovert",
    choice_c: "Ambivert",
    choice_d: "Overt",
    correct: "Introvert",
  },
  {
    id: "simi-10",
    album: "Sometimes I Might Be Introvert",
    difficulty: "medium",
    question: "Which track on the album features the artist Obongjayar?",
    choice_a: "Point and Kill",
    choice_b: "Two Worlds Apart",
    choice_c: "Rollin Stone",
    choice_d: "Standing Ovation",
    correct: "Point and Kill",
  },
  {
    id: "simi-11",
    album: "Sometimes I Might Be Introvert",
    difficulty: "medium",
    question: "Which track title includes the phrase 'I Love You'?",
    choice_a: "I Love You, I Hate You",
    choice_b: "I Love You",
    choice_c: "Love/Hate",
    choice_d: "Hate to Love",
    correct: "I Love You, I Hate You",
  },
  {
    id: "simi-12",
    album: "Sometimes I Might Be Introvert",
    difficulty: "medium",
    question: "Which of these is a track on 'Sometimes I Might Be Introvert'?",
    choice_a: "Woman",
    choice_b: "HUMBLE.",
    choice_c: "Get Lucky",
    choice_d: "Welcome to New York",
    correct: "Woman",
  },
  {
    id: "simi-13",
    album: "Sometimes I Might Be Introvert",
    difficulty: "medium",
    question: "The album is widely described as blending rap with which broader style of production?",
    choice_a: "Orchestral / cinematic",
    choice_b: "Lo-fi black metal",
    choice_c: "Bluegrass",
    choice_d: "K-pop",
    correct: "Orchestral / cinematic",
  },
  {
    id: "simi-14",
    album: "Sometimes I Might Be Introvert",
    difficulty: "hard",
    question: "Which track name is also a common phrase for someone being misunderstood?",
    choice_a: "Miss Understood",
    choice_b: "Misread",
    choice_c: "Wrong Side",
    choice_d: "Lost in Translation",
    correct: "Miss Understood",
  },
  {
    id: "simi-15",
    album: "Sometimes I Might Be Introvert",
    difficulty: "hard",
    question: "'Sometimes I Might Be Introvert' is the ___ studio album by Little Simz.",
    choice_a: "third",
    choice_b: "fourth",
    choice_c: "fifth",
    choice_d: "sixth",
    correct: "fourth",
  },

  // ==================================
  // Demo quiz: System of a Down — Toxicity
  // (Alternative metal, 2001)
  // ==================================
  {
    id: "tox-1",
    album: "Toxicity",
    difficulty: "easy",
    question: "Which band released the album 'Toxicity'?",
    choice_a: "System of a Down",
    choice_b: "Linkin Park",
    choice_c: "Deftones",
    choice_d: "Tool",
    correct: "System of a Down",
  },
  {
    id: "tox-2",
    album: "Toxicity",
    difficulty: "easy",
    question: "In what year was 'Toxicity' released?",
    choice_a: "1999",
    choice_b: "2001",
    choice_c: "2003",
    choice_d: "2005",
    correct: "2001",
  },
  {
    id: "tox-3",
    album: "Toxicity",
    difficulty: "easy",
    question: "Which of these is a song from 'Toxicity'?",
    choice_a: "Chop Suey!",
    choice_b: "Enter Sandman",
    choice_c: "Creep",
    choice_d: "Wonderwall",
    correct: "Chop Suey!",
  },
  {
    id: "tox-4",
    album: "Toxicity",
    difficulty: "easy",
    question: "Which track shares the same name as the album?",
    choice_a: "Toxicity",
    choice_b: "Aerials",
    choice_c: "Prison Song",
    choice_d: "Needles",
    correct: "Toxicity",
  },
  {
    id: "tox-5",
    album: "Toxicity",
    difficulty: "easy",
    question: "'Toxicity' is most commonly categorized as which genre?",
    choice_a: "Alternative metal",
    choice_b: "Country",
    choice_c: "EDM",
    choice_d: "Reggae",
    correct: "Alternative metal",
  },
  {
    id: "tox-6",
    album: "Toxicity",
    difficulty: "easy",
    question: "Which of these songs appears on 'Toxicity'?",
    choice_a: "Aerials",
    choice_b: "Yellow",
    choice_c: "Rolling in the Deep",
    choice_d: "Bad Blood",
    correct: "Aerials",
  },
  {
    id: "tox-7",
    album: "Toxicity",
    difficulty: "easy",
    question: "Which song title from the album includes the word 'Song'?",
    choice_a: "Prison Song",
    choice_b: "Science",
    choice_c: "Forest",
    choice_d: "Arto",
    correct: "Prison Song",
  },
  {
    id: "tox-8",
    album: "Toxicity",
    difficulty: "easy",
    question: "Which of these is a track on the album?",
    choice_a: "Needles",
    choice_b: "Numb",
    choice_c: "Paranoid",
    choice_d: "Hey Jude",
    correct: "Needles",
  },
  {
    id: "tox-9",
    album: "Toxicity",
    difficulty: "easy",
    question: "The album's cover features an altered version of what symbol?",
    choice_a: "Hollywood sign",
    choice_b: "Liberty Bell",
    choice_c: "Golden Gate Bridge",
    choice_d: "Eiffel Tower",
    correct: "Hollywood sign",
  },
  {
    id: "tox-10",
    album: "Toxicity",
    difficulty: "medium",
    question: "Which song from the album became a major hit and is titled like a cooking instruction?",
    choice_a: "Chop Suey!",
    choice_b: "Fry Curry",
    choice_c: "Bake Slowly",
    choice_d: "Stir It",
    correct: "Chop Suey!",
  },
  {
    id: "tox-11",
    album: "Toxicity",
    difficulty: "medium",
    question: "Which track is a short instrumental closing the standard edition of the album?",
    choice_a: "Arto",
    choice_b: "Science",
    choice_c: "ATWA",
    choice_d: "Deer Dance",
    correct: "Arto",
  },
  {
    id: "tox-12",
    album: "Toxicity",
    difficulty: "medium",
    question: "Which track title is an acronym on the album?",
    choice_a: "ATWA",
    choice_b: "DNA.",
    choice_c: "RAM",
    choice_d: "SIMBI",
    correct: "ATWA",
  },
  {
    id: "tox-13",
    album: "Toxicity",
    difficulty: "medium",
    question: "Which song title from 'Toxicity' includes the word 'Dance'?",
    choice_a: "Deer Dance",
    choice_b: "Last Dance",
    choice_c: "Dance Floor",
    choice_d: "Slow Dance",
    correct: "Deer Dance",
  },
  {
    id: "tox-14",
    album: "Toxicity",
    difficulty: "hard",
    question: "Who is the lead vocalist most associated with System of a Down?",
    choice_a: "Serj Tankian",
    choice_b: "Chino Moreno",
    choice_c: "Corey Taylor",
    choice_d: "Maynard James Keenan",
    correct: "Serj Tankian",
  },
  {
    id: "tox-15",
    album: "Toxicity",
    difficulty: "hard",
    question: "'Toxicity' is the ___ studio album by System of a Down.",
    choice_a: "first",
    choice_b: "second",
    choice_c: "third",
    choice_d: "fourth",
    correct: "second",
  },

  // =====================================
  // Demo quiz: Silver Jews — The Natural Bridge
  // (Indie rock, 1996)
  // =====================================
  {
    id: "nb-1",
    album: "The Natural Bridge",
    difficulty: "easy",
    question: "Which band released the album 'The Natural Bridge'?",
    choice_a: "Silver Jews",
    choice_b: "Pavement",
    choice_c: "Built to Spill",
    choice_d: "Modest Mouse",
    correct: "Silver Jews",
  },
  {
    id: "nb-2",
    album: "The Natural Bridge",
    difficulty: "easy",
    question: "In what decade was 'The Natural Bridge' released?",
    choice_a: "1970s",
    choice_b: "1980s",
    choice_c: "1990s",
    choice_d: "2000s",
    correct: "1990s",
  },
  {
    id: "nb-3",
    album: "The Natural Bridge",
    difficulty: "easy",
    question: "Who is the primary songwriter and vocalist of Silver Jews?",
    choice_a: "David Berman",
    choice_b: "Stephen Malkmus",
    choice_c: "Isaac Brock",
    choice_d: "Jeff Mangum",
    correct: "David Berman",
  },
  {
    id: "nb-4",
    album: "The Natural Bridge",
    difficulty: "easy",
    question: "Which of these is a track from 'The Natural Bridge'?",
    choice_a: "How to Rent a Room",
    choice_b: "Get Lucky",
    choice_c: "Chop Suey!",
    choice_d: "HUMBLE.",
    correct: "How to Rent a Room",
  },
  {
    id: "nb-5",
    album: "The Natural Bridge",
    difficulty: "easy",
    question: "'The Natural Bridge' is generally categorized as which genre?",
    choice_a: "Indie rock",
    choice_b: "Classical",
    choice_c: "EDM",
    choice_d: "Trap",
    correct: "Indie rock",
  },
  {
    id: "nb-6",
    album: "The Natural Bridge",
    difficulty: "easy",
    question: "Which word appears in the album title?",
    choice_a: "Natural",
    choice_b: "Artificial",
    choice_c: "Digital",
    choice_d: "Virtual",
    correct: "Natural",
  },
  {
    id: "nb-7",
    album: "The Natural Bridge",
    difficulty: "easy",
    question: "Which of these is also the title of a Silver Jews album (not necessarily this one)?",
    choice_a: "American Water",
    choice_b: "Nevermind",
    choice_c: "Abbey Road",
    choice_d: "OK Computer",
    correct: "American Water",
  },
  {
    id: "nb-8",
    album: "The Natural Bridge",
    difficulty: "easy",
    question: "The phrase 'Natural Bridge' refers to what kind of formation?",
    choice_a: "A rock arch",
    choice_b: "A suspension bridge",
    choice_c: "A steel overpass",
    choice_d: "A subway tunnel",
    correct: "A rock arch",
  },
  {
    id: "nb-9",
    album: "The Natural Bridge",
    difficulty: "easy",
    question: "Which of these is a plausible Silver Jews track title style?",
    choice_a: "Black and Brown Blues",
    choice_b: "Symphony No. 5",
    choice_c: "Drop It Like It's Hot",
    choice_d: "Poker Face",
    correct: "Black and Brown Blues",
  },
  {
    id: "nb-10",
    album: "The Natural Bridge",
    difficulty: "medium",
    question: "Which track title mentions a room?",
    choice_a: "How to Rent a Room",
    choice_b: "Room Service",
    choice_c: "Living Room",
    choice_d: "Room to Breathe",
    correct: "How to Rent a Room",
  },
  {
    id: "nb-11",
    album: "The Natural Bridge",
    difficulty: "medium",
    question: "Silver Jews are often associated with which broader music scene?",
    choice_a: "1990s indie / lo-fi rock",
    choice_b: "Motown soul",
    choice_c: "Disco",
    choice_d: "Dubstep",
    correct: "1990s indie / lo-fi rock",
  },
  {
    id: "nb-12",
    album: "The Natural Bridge",
    difficulty: "medium",
    question: "Which of these is a Silver Jews-related project by David Berman?",
    choice_a: "Purple Mountains",
    choice_b: "The Strokes",
    choice_c: "Radiohead",
    choice_d: "Daft Punk",
    correct: "Purple Mountains",
  },
  {
    id: "nb-13",
    album: "The Natural Bridge",
    difficulty: "medium",
    question: "Which instrument is commonly central in Silver Jews songs?",
    choice_a: "Guitar",
    choice_b: "Sitar",
    choice_c: "Bagpipes",
    choice_d: "Theremin",
    correct: "Guitar",
  },
  {
    id: "nb-14",
    album: "The Natural Bridge",
    difficulty: "hard",
    question: "'The Natural Bridge' is generally considered which number studio album for Silver Jews?",
    choice_a: "first",
    choice_b: "second",
    choice_c: "third",
    choice_d: "fourth",
    correct: "second",
  },
  {
    id: "nb-15",
    album: "The Natural Bridge",
    difficulty: "hard",
    question: "Silver Jews formed in which U.S. state?",
    choice_a: "Virginia",
    choice_b: "California",
    choice_c: "Texas",
    choice_d: "Florida",
    correct: "Virginia",
  },
];

// ---------- DOM ----------
const el = {
  albumInput: document.getElementById("albumInput"),
  sourceSelect: document.getElementById("sourceSelect"),
  startBtn: document.getElementById("startBtn"),
  resetBtn: document.getElementById("resetBtn"),

  game: document.getElementById("game"),
  results: document.getElementById("results"),

  progressText: document.getElementById("progressText"),
  difficultyText: document.getElementById("difficultyText"),
  pointsText: document.getElementById("pointsText"),
  scoreText: document.getElementById("scoreText"),

  questionText: document.getElementById("questionText"),
  answerForm: document.getElementById("answerForm"),

  submitBtn: document.getElementById("submitBtn"),
  nextBtn: document.getElementById("nextBtn"),

  feedback: document.getElementById("feedback"),

  answeredText: document.getElementById("answeredText"),
  finalScoreText: document.getElementById("finalScoreText"),
  playAgainBtn: document.getElementById("playAgainBtn"),
};

// ---------- Audio ----------
const correctDing = new Audio("Assets/Sounds/correct_soundeffect.mp3");
const incorrectSound = new Audio("Assets/Sounds/incorrect_soundeffect.mp3");

function playCorrectDing() {
  try {
    // Allow replaying quickly.
    correctDing.currentTime = 0;
  } catch {}
  correctDing.play().catch(() => {});
}

function playIncorrectSound() {
  try {
    incorrectSound.currentTime = 0;
  } catch {}
  incorrectSound.play().catch(() => {});
}

// ---------- State ----------
let state = {
  questions: [],
  order: [],
  idx: 0,
  score: 0,
  maxScore: 0,
  answered: 0,
  albumFilter: "",
  // no global difficulty filter; each game mixes difficulties
  locked: false,
};

function getMaxScore(questions) {
  return (questions || []).reduce((sum, q) => sum + (DIFFICULTY_POINTS[q.difficulty] || 1), 0);
}

function getScorePercent(score, maxScore) {
  if (!maxScore) return 0;
  return (score / maxScore) * 100;
}

function formatPercent(p) {
  return `${Math.round(p)}%`;
}

function normalizeDifficulty(v) {
  v = String(v || "").trim().toLowerCase();
  return DIFFICULTY_POINTS[v] ? v : "easy";
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function recordToQuestion(r) {
  // Accept either demo objects or parsed sheet rows.
  const choices = [r.choice_a, r.choice_b, r.choice_c, r.choice_d]
    .map(x => String(x || "").trim())
    .filter(Boolean);

  return {
    id: String(r.id || "").trim() || `row-${Math.random().toString(16).slice(2)}`,
    album: String(r.album || "").trim() || "Unknown",
    difficulty: normalizeDifficulty(r.difficulty),
    question: String(r.question || "").trim(),
    choices,
    correct: String(r.correct || "").trim(),
  };
}

function filterQuestions(all, album) {
  const albumNorm = (album || "").trim().toLowerCase();
  let qs = all;
  if (albumNorm) {
    qs = qs.filter(q => (q.album || "").toLowerCase() === albumNorm);
  }

  // Build a mixed set by difficulty: mostly easy, some medium, few hard.
  const by = {
    easy: qs.filter(q => q.difficulty === "easy"),
    medium: qs.filter(q => q.difficulty === "medium"),
    hard: qs.filter(q => q.difficulty === "hard"),
  };

  const pickN = (arr, n) => shuffle(arr.slice()).slice(0, Math.min(n, arr.length));

  let picked = [
    ...pickN(by.easy, MIX_COUNTS.easy),
    ...pickN(by.medium, MIX_COUNTS.medium),
    ...pickN(by.hard, MIX_COUNTS.hard),
  ];

  // If the sheet doesn't have enough of a category, top up from whatever remains.
  const pickedIds = new Set(picked.map(q => q.id));
  const remaining = qs.filter(q => !pickedIds.has(q.id));
  const targetTotal = MIX_COUNTS.easy + MIX_COUNTS.medium + MIX_COUNTS.hard;
  if (picked.length < targetTotal) {
    picked = picked.concat(shuffle(remaining.slice()).slice(0, targetTotal - picked.length));
  }

  // Still nothing? Return qs.
  return picked.length ? shuffle(picked) : qs;
}

async function loadFromGoogleSheet() {
  if (!SHEET_JSON_URL) {
    throw new Error("SHEET_ID is not set in app.js");
  }

  const res = await fetch(SHEET_JSON_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);

  const text = await res.text();
  // The gviz response looks like: google.visualization.Query.setResponse({...});
  const jsonMatch = text.match(/setResponse\((.*)\);?\s*$/s);
  if (!jsonMatch) throw new Error("Unexpected Google visualization response.");

  const payload = JSON.parse(jsonMatch[1]);
  const table = payload.table;
  const cols = (table.cols || []).map(c => (c.label || "").trim());
  const rows = table.rows || [];

  const out = rows.map(r => {
    const obj = {};
    (r.c || []).forEach((cell, i) => {
      const key = cols[i] || `col_${i}`;
      obj[key] = cell ? (cell.v ?? "") : "";
    });
    return obj;
  });

  // Map possible label variations (case-insensitive) into expected keys.
  const normKey = k => String(k || "").trim().toLowerCase();
  const pick = (obj, want) => {
    const wantN = normKey(want);
    for (const k of Object.keys(obj)) {
      if (normKey(k) === wantN) return obj[k];
    }
    return "";
  };

  return out.map(o => ({
    id: pick(o, "id"),
    album: pick(o, "album"),
    difficulty: pick(o, "difficulty"),
    question: pick(o, "question"),
    choice_a: pick(o, "choice_a"),
    choice_b: pick(o, "choice_b"),
    choice_c: pick(o, "choice_c"),
    choice_d: pick(o, "choice_d"),
    correct: pick(o, "correct"),
  }));
}

function showGame() {
  el.game.classList.remove("hidden");
  el.results.classList.add("hidden");
}

function showResults() {
  el.game.classList.add("hidden");
  el.results.classList.remove("hidden");
}

function resetUIOnly() {
  el.feedback.classList.add("hidden");
  el.nextBtn.classList.add("hidden");
  el.submitBtn.classList.remove("hidden");
  el.submitBtn.disabled = false;
  state.locked = false;
}

function renderQuestion() {
  resetUIOnly();

  const q = state.questions[state.idx];
  if (!q) return;

  el.progressText.textContent = `Question ${state.idx + 1} / ${state.questions.length}`;
  el.difficultyText.textContent = q.difficulty[0].toUpperCase() + q.difficulty.slice(1);
  const pts = DIFFICULTY_POINTS[q.difficulty] || 1;
  el.pointsText.textContent = `${pts} pt${pts === 1 ? "" : "s"}`;
  el.scoreText.textContent = formatPercent(getScorePercent(state.score, state.maxScore));

  el.questionText.textContent = q.question;

  el.answerForm.innerHTML = "";
  q.choices.forEach((choice, i) => {
    const id = `c_${state.idx}_${i}`;
    const label = document.createElement("label");
    label.className = "choice";
    label.htmlFor = id;

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "choice";
    input.value = choice;
    input.id = id;
    input.required = true;

    const span = document.createElement("span");
    span.textContent = choice;

    label.appendChild(input);
    label.appendChild(span);
    el.answerForm.appendChild(label);
  });
}

function endGame() {
  el.answeredText.textContent = String(state.answered);
  el.finalScoreText.textContent = formatPercent(getScorePercent(state.score, state.maxScore));
  showResults();
}

async function startGame() {
  const album = el.albumInput.value.trim();
  const source = el.sourceSelect.value;

  let raw;
  try {
    if (source === "sheet") {
      raw = await loadFromGoogleSheet();
    } else {
      raw = DEMO_QUESTIONS;
    }
  } catch (e) {
    alert(String(e && e.message ? e.message : e));
    raw = DEMO_QUESTIONS;
  }

  const all = raw.map(recordToQuestion).filter(q => q.question && q.choices.length >= 2 && q.correct);
  const filtered = filterQuestions(all, album);

  if (filtered.length === 0) {
    alert("No questions found for that selection.");
    return;
  }

  state = {
    questions: shuffle(filtered.slice()),
    order: [],
    idx: 0,
    score: 0,
    maxScore: 0,
    answered: 0,
    albumFilter: album,
    locked: false,
  };

  state.maxScore = getMaxScore(state.questions);

  showGame();
  renderQuestion();
}

function handleSubmit(e) {
  e.preventDefault();
  if (state.locked) return;

  const q = state.questions[state.idx];
  if (!q) return;

  const fd = new FormData(el.answerForm);
  const selected = String(fd.get("choice") || "");
  if (!selected) return;

  const correct = selected === q.correct;
  const pts = DIFFICULTY_POINTS[q.difficulty] || 1;

  // Lock choices once answered.
  for (const input of el.answerForm.querySelectorAll('input[type="radio"][name="choice"]')) {
    input.disabled = true;
  }

  state.answered += 1;
  if (correct) {
    state.score += pts;
    playCorrectDing();
  } else {
    playIncorrectSound();
  }

  el.scoreText.textContent = formatPercent(getScorePercent(state.score, state.maxScore));

  el.feedback.classList.remove("hidden");
  el.feedback.classList.toggle("ok", correct);
  el.feedback.classList.toggle("bad", !correct);
  el.feedback.innerHTML = correct
    ? `<strong>Correct.</strong> +${pts} point${pts === 1 ? "" : "s"}.`
    : `<strong>Incorrect.</strong> Correct answer: <strong>${escapeHtml(q.correct)}</strong>.`;

  if (!correct) {
    // Visually reveal the correct choice in the list.
    const correctInput = el.answerForm.querySelector(
      `input[type=radio][name=choice][value="${CSS.escape(q.correct)}"]`
    );
    const correctLabel = correctInput?.closest("label.choice");
    if (correctLabel) {
      correctLabel.style.outline = "2px solid rgba(66,211,146,.75)";
      correctLabel.style.background = "rgba(66,211,146,.10)";
    }
  }

  state.locked = true;
  el.submitBtn.classList.add("hidden");
  el.nextBtn.classList.remove("hidden");
}

function handleNext() {
  state.idx += 1;
  if (state.idx >= state.questions.length) {
    endGame();
    return;
  }
  renderQuestion();
}

function resetAll() {
  state = {
    questions: [],
    order: [],
    idx: 0,
    score: 0,
    maxScore: 0,
    answered: 0,
    albumFilter: "",
    locked: false,
  };
  el.game.classList.add("hidden");
  el.results.classList.add("hidden");
  resetUIOnly();
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

// ---------- Events ----------
el.startBtn.addEventListener("click", startGame);
el.resetBtn.addEventListener("click", resetAll);
el.answerForm.addEventListener("submit", handleSubmit);
el.nextBtn.addEventListener("click", handleNext);
el.playAgainBtn.addEventListener("click", () => {
  // Keep current setup selections; just restart.
  el.results.classList.add("hidden");
  startGame();
});

resetAll();
