// songLibrary array to hold song objects
// analyzeGenres() function to analyze genres in the song library
// getRecommendations() function to get song recommendations based on genre
// savediscovery() function to save a song to discoveries
// event listeners for user interactions (e.g., button clicks, search input)

// display songs in the library

function displaySongs(songsToShow) {
  const container = document.getElementById("song-display");
  container.innerHTML = "";

  songsToShow.forEach(function (song) {
    const card = document.createElement("div");
    card.className = "song-card";
    card.innerHTML =
      "<span class='song-title'>" +
      song.title +
      "</span>" +
      "<span class='song-artist'>" +
      song.artist +
      " – " +
      song.year +
      "</span>";

    card.addEventListener("click", function () {
      const index = selectedSongs.indexOf(song);

      if (index === -1) {
        selectedSongs.push(song);
        card.classList.add("selected");
      } else {
        selectedSongs.splice(index, 1);
        card.classList.remove("selected");
      }

      console.log("Selected songs:", selectedSongs);
    });

    container.appendChild(card);
  });
}

// analyze genres based on selected songs

function analyzeGenres() {
  if (selectedSongs.length === 0) {
    document.getElementById("genre-results").innerHTML =
      "Please select some songs to analyze.";
    return;
  }

  // Count genres
  const genreCounts = {};
  selectedSongs.forEach(function (song) {
    if (genreCounts[song.genre]) {
      genreCounts[song.genre]++;
    } else {
      genreCounts[song.genre] = 1;
    }
  });

  // Calculate percentages
  const total = selectedSongs.length;
  let resultsHTML = "<h2>Your Genre Breakdown:</h2>";

  const sortedGenres = Object.keys(genreCounts).sort(function (a, b) {
    return genreCounts[b] - genreCounts[a];
  });

  sortedGenres.forEach(function (genre, index) {
    const percentage = Math.round((genreCounts[genre] / total) * 100);
    resultsHTML += "<div class='genre-bar'>";
    if (index === 0) {
      resultsHTML +=
        "<span class='top-genre'>" + genre + " (" + percentage + "%)</span>";
    } else {
      resultsHTML += "<span>" + genre + " — " + percentage + "%</span>";
    }
    resultsHTML += "</div>";
  });

  document.getElementById("genre-results").innerHTML = resultsHTML;

  // Get recommendations based on the most common genre
  getRecommendations(sortedGenres[0]);
}

// get song recommendations based on genre

function getRecommendations(genre) {
  const recommendations = songLibrary.filter(function (song) {
    return song.genre === genre && !selectedSongs.includes(song);
  });

  let recommendedHTML = "<h2>Recommended Songs</h2>";
  recommendedHTML +=
    "<p>Based on your taste, you might like these <strong>" +
    genre +
    "</strong> songs:</p>";

  if (recommendations.length === 0) {
    recommendedHTML +=
      "<p>You've already selected all songs in your top genre!</p>";
  } else {
    recommendations.forEach(function (song) {
      recommendedHTML += "<div class='recommendation-card'>";
      recommendedHTML +=
        "<button onclick='savediscovery(" + song.id + ")'>Save</button>";
      recommendedHTML +=
        "<span>" + song.title + " — " + song.artist + "</span>";
      recommendedHTML += "</div>";
    });
  }

  document.getElementById("recommendations").innerHTML = recommendedHTML;
}

// save a song to discoveries in localStorage

function savediscovery(songId) {
  const song = songLibrary.find(function (s) {
    return s.id === songId;
  });

  const stored = localStorage.getItem("discoveries");
  const discoveries = stored ? JSON.parse(stored) : [];

  const alreadySaved = discoveries.some(function (s) {
    return s.id === song.id;
  });

  if (alreadySaved) {
    alert(song.title + " is already in your discoveries!");
    return;
  }

  discoveries.push(song);
  localStorage.setItem("discoveries", JSON.stringify(discoveries));

  loadDiscoveries();
}

// load discoveries from localStorage and display them

function loadDiscoveries() {
  const stored = localStorage.getItem("discoveries");
  const discoveries = stored ? JSON.parse(stored) : [];

  const container = document.getElementById("discoveries");

  if (discoveries.length === 0) {
    container.innerHTML = "<p>You have no discovery songs yet.</p>";
    return;
  }

  let discoveriesHTML = "<h2>Your Discovery Songs</h2>";
  discoveries.forEach(function (song) {
    discoveriesHTML += "<div class='discovery-card'>";
    discoveriesHTML +=
      "<button onclick='removediscovery(" + song.id + ")'>Remove</button>";
    discoveriesHTML += "<span>" + song.title + " — " + song.artist + "</span>";
    discoveriesHTML += "</div>";
  });

  container.innerHTML = discoveriesHTML;
}

// remove a song from discoveries in localStorage

function removediscovery(songId) {
  const stored = localStorage.getItem("discoveries");
  const discoveries = stored ? JSON.parse(stored) : [];

  const updated = discoveries.filter(function (s) {
    return s.id !== songId;
  });

  localStorage.setItem("discoveries", JSON.stringify(updated));
  loadDiscoveries();
}

// tutorial: https://medium.com/@cgustin/tutorial-simple-search-filter-with-vanilla-javascript-fdd15b7640bf
// filter songs by name or artist based on search input
function filterByName(event) {
  const searchTerm = event.target.value.trim().toLowerCase();

  if (searchTerm === "") {
    displaySongs(popularSongs);
    return;
  }

  const filtered = songLibrary.filter(function (song) {
    return (
      song.title.toLowerCase().includes(searchTerm) ||
      song.artist.toLowerCase().includes(searchTerm)
    );
  });

  displaySongs(filtered);
}

// console.log("connected");

// global variable to track selected songs
let selectedSongs = [];

// array for songs
// Genres - Hip-hop / Rap, Pop, R&B, Rock, Electronic / Dance, Country, Latin, Alternative / Indie, K-pop, Reggaeton / Trap-Latin
// genres and songs were provided by AI, based on Billboard's top songs from 2016-2025
// AI prompt used: "What are the top 10 music genres from the last decade, and what are the top 10 songs from each genre? Please provide the song title, artist, genre, and release year for each song. Make sure there are no duplicate songs, and that the songs are from 2016-2025. Only select music in the U.S."
const songLibrary = [
  {
    id: 1,
    title: "One Dance",
    artist: "Drake",
    genre: "Hip-hop / Rap",
    year: 2016,
  },
  {
    id: 2,
    title: "Panda",
    artist: "Desiigner",
    genre: "Hip-hop / Rap",
    year: 2016,
  },
  {
    id: 3,
    title: "Humble.",
    artist: "Kendrick Lamar",
    genre: "Hip-hop / Rap",
    year: 2017,
  },
  {
    id: 4,
    title: "God's Plan",
    artist: "Drake",
    genre: "Hip-hop / Rap",
    year: 2018,
  },
  {
    id: 5,
    title: "Sicko Mode",
    artist: "Travis Scott",
    genre: "Hip-hop / Rap",
    year: 2018,
  },
  {
    id: 6,
    title: "Old Town Road",
    artist: "Lil Nas X",
    genre: "Hip-hop / Rap",
    year: 2019,
  },
  {
    id: 7,
    title: "The Box",
    artist: "Roddy Ricch",
    genre: "Hip-hop / Rap",
    year: 2020,
  },
  {
    id: 8,
    title: "Industry Baby",
    artist: "Lil Nas X ft. Jack Harlow",
    genre: "Hip-hop / Rap",
    year: 2021,
  },
  {
    id: 9,
    title: "Rich Flex",
    artist: "Drake ft. 21 Savage",
    genre: "Hip-hop / Rap",
    year: 2023,
  },
  {
    id: 10,
    title: "Not Like Us",
    artist: "Kendrick Lamar",
    genre: "Hip-hop / Rap",
    year: 2024,
  },
  {
    id: 11,
    title: "Closer",
    artist: "The Chainsmokers ft. Halsey",
    genre: "Pop",
    year: 2016,
  },
  {
    id: 12,
    title: "Can't Stop the Feeling!",
    artist: "Justin Timberlake",
    genre: "Pop",
    year: 2016,
  },
  {
    id: 13,
    title: "Shape of You",
    artist: "Ed Sheeran",
    genre: "Pop",
    year: 2017,
  },
  {
    id: 14,
    title: "Thank U, Next",
    artist: "Ariana Grande",
    genre: "Pop",
    year: 2018,
  },
  {
    id: 15,
    title: "Bad Guy",
    artist: "Billie Eilish",
    genre: "Pop",
    year: 2019,
  },
  {
    id: 16,
    title: "Blinding Lights",
    artist: "The Weeknd",
    genre: "Pop",
    year: 2020,
  },
  {
    id: 17,
    title: "Easy on Me",
    artist: "Adele",
    genre: "Pop",
    year: 2021,
  },
  {
    id: 18,
    title: "As it Was",
    artist: "Harry Styles",
    genre: "Pop",
    year: 2022,
  },
  {
    id: 19,
    title: "Flowers",
    artist: "Miley Cyrus",
    genre: "Pop",
    year: 2023,
  },
  {
    id: 20,
    title: "Espresso",
    artist: "Sabrina Carpenter",
    genre: "Pop",
    year: 202,
  },
  {
    id: 21,
    title: "Needed Me",
    artist: "Rihanna",
    genre: "R&B",
    year: 2016,
  },
  {
    id: 22,
    title: "Work",
    artist: "Rihanna ft. Drake",
    genre: "R&B",
    year: 2016,
  },
  {
    id: 23,
    title: "Redbone",
    artist: "Childish Gambino",
    genre: "R&B",
    year: 2017,
  },
  {
    id: 24,
    title: "Boo'd Up",
    artist: "Ella Mai",
    genre: "R&B",
    year: 2018,
  },
  {
    id: 25,
    title: "No Guidance",
    artist: "Chris Brown ft. Drake",
    genre: "R&B",
    year: 2019,
  },
  {
    id: 26,
    title: "Heartless",
    artist: "The Weeknd",
    genre: "R&B",
    year: 2020,
  },
  {
    id: 27,
    title: "Take My Breath",
    artist: "The Weeknd",
    genre: "R&B",
    year: 2021,
  },
  {
    id: 28,
    title: "Die for You",
    artist: "The Weeknd",
    genre: "R&B",
    year: 2022,
  },
  {
    id: 29,
    title: "Snooze",
    artist: "SZA",
    genre: "R&B",
    year: 2023,
  },
  {
    id: 30,
    title: "Saturn",
    artist: "SZA",
    genre: "R&B",
    year: 2024,
  },
  {
    id: 31,
    title: "Heathens",
    artist: "Twenty One Pilots",
    genre: "Rock",
    year: 2016,
  },
  {
    id: 32,
    title: "Believer",
    artist: "Imagine Dragons",
    genre: "Rock",
    year: 2017,
  },
  {
    id: 33,
    title: "High Hopes",
    artist: "Panic! at the Disco",
    genre: "Rock",
    year: 2018,
  },
  {
    id: 34,
    title: "Sucker",
    artist: "Jonas Brothers",
    genre: "Rock",
    year: 2019,
  },
  {
    id: 35,
    title: "My Ex's Best Friend",
    artist: "Machine Gun Kelly ft. blackbear",
    genre: "Rock",
    year: 2020,
  },
  {
    id: 36,
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    genre: "Rock",
    year: 2021,
  },
  {
    id: 37,
    title: "The Foundations of Decay",
    artist: "My Chemical Romance",
    genre: "Rock",
    year: 2022,
  },
  {
    id: 38,
    title: "Rescued",
    artist: "Foo Fighters",
    genre: "Rock",
    year: 2023,
  },
  {
    id: 39,
    title: "The Emptiness",
    artist: "Linkin Park",
    genre: "Rock",
    year: 2024,
  },
  {
    id: 40,
    title: "Birds of a Feather",
    artist: "Billie Eilish",
    genre: "Rock",
    year: 2025,
  },
  {
    id: 41,
    title: "Cheap Thrills",
    artist: "Sia",
    genre: "Electronic / Dance",
    year: 2016,
  },
  {
    id: 42,
    title: "Starboy",
    artist: "The Weeknd ft. Daft Punk",
    genre: "Electronic / Dance",
    year: 2016,
  },
  {
    id: 43,
    title: "Something Just Like This",
    artist: "The Chainsmokers ft. Coldplay",
    genre: "Electronic / Dance",
    year: 2017,
  },
  {
    id: 44,
    title: "Solo",
    artist: "Clean Bandit ft. Demi Lovato",
    genre: "Electronic / Dance",
    year: 2018,
  },
  {
    id: 45,
    title: "Don't Start Now",
    artist: "Dua Lipa",
    genre: "Electronic / Dance",
    year: 2019,
  },
  {
    id: 46,
    title: "Rain on Me",
    artist: "Lady Gaga ft. Ariana Grande",
    genre: "Electronic / Dance",
    year: 2020,
  },
  {
    id: 47,
    title: "Where Are You Now",
    artist: "Lost Frequencies ft. Calum Scott",
    genre: "Electronic / Dance",
    year: 2021,
  },
  {
    id: 48,
    title: "Miracle",
    artist: "Calvin Harris ft. Ellie Goulding",
    genre: "Electronic / Dance",
    year: 2022,
  },
  {
    id: 49,
    title: "I Don't Wanna Wait",
    artist: "David Guetta ft. OneRepublic",
    genre: "Electronic / Dance",
    year: 2023,
  },
  {
    id: 50,
    title: "Neverender",
    artist: "Justice ft. Tama Impala",
    genre: "Electronic / Dance",
    year: 2024,
  },
  {
    id: 51,
    title: "Tennessee Whiskey",
    artist: "Chris Stapleton",
    genre: "Country",
    year: 2016,
  },
  {
    id: 52,
    title: "Body Like a Back Road",
    artist: "Sam Hunt",
    genre: "Country",
    year: 2017,
  },
  {
    id: 53,
    title: "Meant to Be",
    artist: "Bebe Rexha ft. Florida Georgia Line",
    genre: "Country",
    year: 2018,
  },
  {
    id: 54,
    title: "Even Though I'm Leaving",
    artist: "Luke Combs",
    genre: "Country",
    year: 2019,
  },
  {
    id: 55,
    title: "The Bones",
    artist: "Maren Morris",
    genre: "Country",
    year: 2020,
  },
  {
    id: 56,
    title: "Fancy Like",
    artist: "Walker Hayes",
    genre: "Country",
    year: 2021,
  },
  {
    id: 57,
    title: "You Proof",
    artist: "Morgan Wallen",
    genre: "Country",
    year: 2022,
  },
  {
    id: 58,
    title: "Last Night",
    artist: "Morgan Wallen",
    genre: "Country",
    year: 2023,
  },
  {
    id: 59,
    title: "I Had Some Help",
    artist: "Post Malone ft. Morgan Wallen",
    genre: "Country",
    year: 2024,
  },
  {
    id: 60,
    title: "I Ain't Comin' Back",
    artist: "Morgan Wallen ft. Post Malone",
    genre: "Country",
    year: 2025,
  },
  {
    id: 61,
    title: "Despacito",
    artist: "Luis Fonsi ft. Daddy Yankee",
    genre: "Latin",
    year: 2016,
  },
  {
    id: 62,
    title: "Mi Gente",
    artist: "J Balvin ft. Willy William",
    genre: "Latin",
    year: 2017,
  },
  {
    id: 63,
    title: "I Like It",
    artist: "Cardi B ft. J Balvin & Bad Bunny",
    genre: "Latin",
    year: 2018,
  },
  {
    id: 64,
    title: "Con Calma",
    artist: "Daddy Yankee ft. Snow",
    genre: "Latin",
    year: 2019,
  },
  {
    id: 65,
    title: "Tusa",
    artist: "Karol G ft. Nicki Minaj",
    genre: "Latin",
    year: 2020,
  },
  {
    id: 66,
    title: "Dakiti",
    artist: "Bad Bunny ft. Jhay Cortez",
    genre: "Latin",
    year: 2021,
  },
  {
    id: 67,
    title: "Titi Me Preguntó",
    artist: "Bad Bunny",
    genre: "Latin",
    year: 2022,
  },
  {
    id: 68,
    title: "Shakira: Bzrp Music Sessions, Vol. 53",
    artist: "Bizarrap ft. Shakira",
    genre: "Latin",
    year: 2023,
  },
  {
    id: 69,
    title: "Mamichula",
    artist: "Trueno ft. Nicki Nicole & Bizarrap",
    genre: "Latin",
    year: 2024,
  },
  {
    id: 70,
    title: "Baile Inolvidable",
    artist: "Bad Bunny",
    genre: "Latin",
    year: 2025,
  },
  {
    id: 71,
    title: "Team",
    artist: "Lorde",
    genre: "Alternative / Indie",
    year: 2016,
  },
  {
    id: 72,
    title: "Sign of the Times",
    artist: "Harry Styles",
    genre: "Alternative / Indie",
    year: 2017,
  },
  {
    id: 73,
    title: "Lemon Glow",
    artist: "Beach House",
    genre: "Alternative / Indie",
    year: 2018,
  },
  {
    id: 74,
    title: "Harmony Hall",
    artist: "Vampire Weekend",
    genre: "Alternative / Indie",
    year: 2019,
  },
  {
    id: 75,
    title: "Kyoto",
    artist: "Phoebe Bridgers",
    genre: "Alternative / Indie",
    year: 2020,
  },
  {
    id: 76,
    title: "Telepatia",
    artist: "Kali Uchis",
    genre: "Alternative / Indie",
    year: 2021,
  },
  {
    id: 77,
    title: "About Damn Time",
    artist: "Lizzo",
    genre: "Alternative / Indie",
    year: 2022,
  },
  {
    id: 78,
    title: "Vampire Empire",
    artist: "Big Thief",
    genre: "Alternative / Indie",
    year: 2023,
  },
  {
    id: 79,
    title: "Too Sweet",
    artist: "Hozier",
    genre: "Alternative / Indie",
    year: 2024,
  },
  {
    id: 80,
    title: "Pink Pony Club",
    artist: "Chappell Roan",
    genre: "Alternative / Indie",
    year: 2025,
  },
  {
    id: 81,
    title: "Fire",
    artist: "BTS",
    genre: "K-pop",
    year: 2016,
  },
  {
    id: 82,
    title: "DNA",
    artist: "BTS",
    genre: "K-pop",
    year: 2017,
  },
  {
    id: 83,
    title: "Fake Love",
    artist: "BTS",
    genre: "K-pop",
    year: 2018,
  },
  {
    id: 84,
    title: "Boy With Luv",
    artist: "BTS ft. Halsey",
    genre: "K-pop",
    year: 2019,
  },
  {
    id: 85,
    title: "Dynamite",
    artist: "BTS",
    genre: "K-pop",
    year: 2020,
  },
  {
    id: 86,
    title: "Butter",
    artist: "BTS",
    genre: "K-pop",
    year: 2021,
  },
  {
    id: 87,
    title: "Pink Venom",
    artist: "BLACKPINK",
    genre: "K-pop",
    year: 2022,
  },
  {
    id: 88,
    title: "Super Shy",
    artist: "NewJeans",
    genre: "K-pop",
    year: 2023,
  },
  {
    id: 89,
    title: "Rockstar",
    artist: "Lisa",
    genre: "K-pop",
    year: 2024,
  },
  {
    id: 90,
    title: "APT.",
    artist: "Rosé ft. Bruno Mars",
    genre: "K-pop",
    year: 2025,
  },
  {
    id: 91,
    title: "Hasta el Amanecer",
    artist: "Nicky Jam",
    genre: "Reggaeton / Trap-Latin",
    year: 2016,
  },
  {
    id: 92,
    title: "Escápate Conmigo",
    artist: "Wisin ft. Ozuna",
    genre: "Reggaeton / Trap-Latin",
    year: 2017,
  },
  {
    id: 93,
    title: "X",
    artist: "Nicky Jam & J Balvin",
    genre: "Reggaeton / Trap-Latin",
    year: 2018,
  },
  {
    id: 94,
    title: "China",
    artist: "Anuel AA, Daddy Yankee, Karol G, Ozuna & J Balvin",
    genre: "Reggaeton / Trap-Latin",
    year: 2019,
  },
  {
    id: 95,
    title: "Hawái",
    artist: "Maluma",
    genre: "Reggaeton / Trap-Latin",
    year: 2020,
  },
  {
    id: 96,
    title: "Yonaguni",
    artist: "Bad Bunny",
    genre: "Reggaeton / Trap-Latin",
    year: 2021,
  },
  {
    id: 97,
    title: "Callaíta",
    artist: "Bad Bunny ft. Tainy",
    genre: "Reggaeton / Trap-Latin",
    year: 2022,
  },
  {
    id: 98,
    title: "TQG",
    artist: "Karol G ft. Shakira",
    genre: "Reggaeton / Trap-Latin",
    year: 2023,
  },
  {
    id: 99,
    title: "Brindo",
    artist: "Feid",
    genre: "Reggaeton / Trap-Latin",
    year: 2024,
  },
  {
    id: 100,
    title: "EoO",
    artist: "Bad Bunny",
    genre: "Reggaeton / Trap-Latin",
    year: 2025,
  },
];

// display most popular songs only (based on Billboard rankings) to avoid overwhelming users with 100 songs at once

const popularIds = [
  1, 3, 4, 6, 10, 13, 16, 18, 19, 20, 22, 23, 26, 28, 29, 32, 33, 36, 39, 40,
  45, 46, 48, 51, 57, 58, 59, 63, 66, 67, 72, 75, 79, 80, 85, 86, 87, 88, 89,
  90, 96, 98, 99, 100,
];

// filter the songLibrary to only include songs with IDs in popularIds

let popularSongs = songLibrary.filter(function (song) {
  return popularIds.includes(song.id);
});

// console.log(songLibrary.length);

// console.log(popularSongs.length);

displaySongs(popularSongs);
loadDiscoveries();
