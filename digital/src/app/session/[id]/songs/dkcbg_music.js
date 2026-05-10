var songs =
[
  // 1-9
  {code: 'dkc_snes_opening', name: 'Opening Fanfare'},
  {code: 'dkc_snes_theme', name: 'Theme'},
  {code: 'dkc_snes_simian', name: 'Simian Segue'},
  {code: 'dkc_snes_island', name: 'DK Island Swing'},
  {code: 'dkc_snes_clear', name: 'Stage Clear'},
  {code: 'dkc_snes_cranky', name: 'Cranky\'s Theme'},
  {code: 'dkc_snes_cave', name: 'Cave Dweller Concert'},
  {code: 'dkc_snes_aquatic', name: 'Aquatic Ambiance'},
  {code: 'dkc_snes_life', name: 'Lose a Life'},

  // 10-19
  {code: 'dkc_snes_funky', name: 'Funky\'s Fugue'},
  {code: 'dkc_snes_candy', name: 'Candy\'s Love Song'},
  {code: 'dkc_snes_boss', name: 'Bad Boss Boogie'},
  {code: 'dkc_snes_cart', name: 'Mine Cart Madness'},
  {code: 'dkc_snes_misty', name: 'Misty Menace'},
  {code: 'dkc_snes_temple', name: 'Voices of the Temple'},
  {code: 'dkc_snes_forest', name: 'Forest Frenzy'},
  {code: 'dkc_snes_bonus', name: 'Bonus Boom Blitz'},
  {code: 'dkc_snes_win', name: 'Bonus Win'},
  {code: 'dkc_snes_treetop', name: 'Treetop Rock'},

  // 20-29
  {code: 'dkc_snes_northern', name: 'Northern Hemispheres'},
  {code: 'dkc_snes_ice', name: 'Ice Cave Chant'},
  {code: 'dkc_snes_factory', name: 'Fear Factory'},
  {code: 'dkc_snes_mines', name: 'Life in the Mines'},
  {code: 'dkc_snes_lose', name: 'Bonus Lose'},
  {code: 'dkc_snes_cacophony', name: 'K. Rool\'s Cacophony'},
  {code: 'dkc_snes_gang', name: 'Gang-Plank Galleon'},
  {code: 'dkc_snes_credits', name: 'The Credits Concerto'},
  {code: 'dkc2_snes_opening', name: 'Opening Fanfare'},
  {code: 'dkc2_snes_returns', name: 'K. Rool Returns'},

  // 30-39
  {code: 'dkc2_snes_rhumba', name: 'Steel Drum Rhumba'},
  {code: 'dkc2_snes_welcome', name: 'Welcome to Crocodile Isle'},
  {code: 'dkc2_snes_klomp', name: 'Klomp\'s Romp'},
  {code: 'dkc2_snes_life', name: 'Lose a Life'},
  {code: 'dkc2_snes_token', name: 'Token Tango'},
  {code: 'dkc2_snes_jib', name: 'Jib Jig'},
  {code: 'dkc2_snes_clear', name: 'Stage Clear'},
  {code: 'dkc2_snes_school', name: 'School House Harmony'},
  {code: 'dkc2_snes_lockjaw', name: 'Lockjaw\'s Saga'},
  {code: 'dkc2_snes_funky', name: 'Funky the Main Monkey'},

  // 40-49
  {code: 'dkc2_snes_hot', name: 'Hot-Head Hop'},
  {code: 'dkc2_snes_swanky', name: 'Swanky\'s Swing'},
  {code: 'dkc2_snes_mining', name: 'Mining Melancholy'},
  {code: 'dkc2_snes_boss', name: 'Boss Bossanova'},
  {code: 'dkc2_snes_diddy', name: 'End Target (Diddy)'},
  {code: 'dkc2_snes_bayou', name: 'Bayou Boogie'},
  {code: 'dkc2_snes_snakey', name: 'Snakey Chantey'},
  {code: 'dkc2_snes_cranky', name: 'Cranky\'s Conga'},
  {code: 'dkc2_snes_sticker', name: 'Stickerbush Symphony'},
  {code: 'dkc2_snes_zinger', name: 'Flight of the Zinger'},

  // 50-59
  {code: 'dkc2_snes_disco', name: 'Disco Train'},
  {code: 'dkc2_snes_dixie', name: 'End Target (Dixie)'},
  {code: 'dkc2_snes_rambi', name: 'Run, Rambi! Run!'},
  {code: 'dkc2_snes_forest', name: 'Forest Interlude'},
  {code: 'dkc2_snes_haunted', name: 'Haunted Chase'},
  {code: 'dkc2_snes_snow', name: 'In a Snow-Bound Land'},
  {code: 'dkc2_snes_krook', name: 'Krook\'s March'},
  {code: 'dkc2_snes_over', name: 'Game Over'},
  {code: 'dkc2_snes_klubba', name: 'Klubba\'s Reveille'},
  {code: 'dkc2_snes_lost', name: 'Lost World Anthem'},

  // 60-69
  {code: 'dkc2_snes_primal', name: 'Primal Rave'},
  {code: 'dkc2_snes_strong', name: 'Stronghold Showdown'},
  {code: 'dkc2_snes_flying', name: 'The Flying Krock'},
  {code: 'dkc2_snes_bird', name: 'Bad Bird Rag'},
  {code: 'dkc2_snes_cacophony', name: 'Crocodile Cacophony'},
  {code: 'dkc2_snes_rescued', name: 'Donkey Kong Rescued'},
  {code: 'dkc3_snes_opening', name: 'Opening Fanfare'},
  {code: 'dkc3_snes_dixie', name: 'Dixie Beat'},
  {code: 'dkc3_snes_crazy', name: 'Crazy Calypso'},
  {code: 'dkc3_snes_northern', name: 'Northern Kremisphere'},

  // 70-79
  {code: 'dkc3_snes_bear', name: 'Brothers Bear'},
  {code: 'dkc3_snes_funky', name: 'Hangin\' at Funky\'s'},
  {code: 'dkc3_snes_stilt', name: 'Stilt Village'},
  {code: 'dkc3_snes_clear', name: 'Stage Clear'},
  {code: 'dkc3_snes_mill', name: 'Mill Fever'},
  {code: 'dkc3_snes_swanky', name: 'Swanky\'s Sideshow'},
  {code: 'dkc3_snes_boss', name: 'Boss Boogie'},
  {code: 'dkc3_snes_submap', name: 'Submap Shuffle'},
  {code: 'dkc3_snes_treetop', name: 'Treetop Tumble'},
  {code: 'dkc3_snes_river', name: 'Enchanted Riverbank'},

  // 80-89
  {code: 'dkc3_snes_cascade', name: 'Cascade Capers'},
  {code: 'dkc3_snes_bonus', name: 'Bonus Time'},
  {code: 'dkc3_snes_nuts', name: 'Nuts and Bolts'},
  {code: 'dkc3_snes_pursuit', name: 'Hot Pursuit'},
  {code: 'dkc3_snes_pokey', name: 'Pokey Pipes'},
  {code: 'dkc3_snes_wrinkly', name: 'Wrinkly\'s Save Cave'},
  {code: 'dkc3_snes_fit', name: 'Get Fit A-Go-Go'},
  {code: 'dkc3_snes_64', name: 'Wrinkly 64'},
  {code: 'dkc3_snes_jangle', name: 'Jangle Bells'},
  {code: 'dkc3_snes_frosty', name: 'Frosty Frolics'},

  // 90-99
  {code: 'dkc3_snes_cavern', name: 'Cavern Caprice'},
  {code: 'dkc3_snes_life', name: 'Lose a Life'},
  {code: 'dkc3_snes_rockface', name: 'Rockface Rumble'},
  {code: 'dkc3_snes_water', name: 'Water World'},
  {code: 'dkc3_snes_crystal', name: 'Crystal Chasm'},
  {code: 'dkc3_snes_jungle', name: 'Jungle Jitter'},
  {code: 'dkc3_snes_over', name: 'Game Over'},
  {code: 'dkc3_snes_big', name: 'Big Boss Blues'},
  {code: 'dkc3_snes_parade', name: 'Baddies on Parade'},
  {code: 'dkc3_snes_krematoa', name: 'Krematoa Koncerto'},

  // 100-109
  {code: 'dkc3_snes_rocket', name: 'Rocket Run'},
  {code: 'dkc3_snes_mama', name: 'Mama Bird'},
  {code: 'dkc3_snes_chase', name: 'Chase'},
  {code: 'dkc_gba_intro', name: 'Intro Story'},
  {code: 'dkc_gba_funky', name: 'Funky\'s Fugue'},
  {code: 'dkc_gba_fishing', name: 'Funky Fishing'},
  {code: 'dkc_gba_warp', name: 'Warp Tune'},
  {code: 'dkc_gba_candy', name: 'Candy\'s Love Song'},
  {code: 'dkc_gba_dance1', name: 'Candy Dance 1'},
  {code: 'dkc_gba_dance2', name: 'Candy Dance 2'},

  // 110-119
  {code: 'dkc_gba_dance3', name: 'Candy Dance 3'},
  {code: 'dkc_gba_dance4', name: 'Candy Dance 4'},
  {code: 'dkc_gba_dance5', name: 'Candy Dance 5'},
  {code: 'dkc_gba_dance6', name: 'Candy Dance 6'},
  {code: 'dkc2_gba_intro', name: 'Intro Story'},
  {code: 'dkc2_gba_funky', name: 'Funky\'s Flights'},
  {code: 'dkc2_gba_expresso', name: 'Expresso Racing'},
  {code: 'dkc3_gba_intro', name: 'Intro Tune'},
  {code: 'dkc3_gba_northern', name: 'Northern Kremisphere'},
  {code: 'dkc3_gba_bear', name: 'Brothers Bear'},

  // 120-129
  {code: 'dkc3_gba_stilt', name: 'Stilt Village'},
  {code: 'dkc3_gba_mill', name: 'Mill Fever'},
  {code: 'dkc3_gba_frosty', name: 'Frosty Frolics'},
  {code: 'dkc3_gba_clear', name: 'Stage Clear'},
  {code: 'dkc3_gba_treetop', name: 'Treetop Tumble'},
  {code: 'dkc3_gba_cranky', name: 'Cranky\'s Dojo'},
  {code: 'dkc3_gba_river', name: 'Enchanted Riverbank'},
  {code: 'dkc3_gba_arich', name: 'Arich Boss'},
  {code: 'dkc3_gba_cascade', name: 'Cascade Capers'},
  {code: 'dkc3_gba_nuts', name: 'Nuts and Bolts'},

  // 130-139
  {code: 'dkc3_gba_cavern', name: 'Cavern Caprice'},
  {code: 'dkc3_gba_rockface', name: 'Rockface Rumble'},
  {code: 'dkc3_gba_bonus', name: 'Bonus Time'},
  {code: 'dkc3_gba_water', name: 'Water World'},
  {code: 'dkc3_gba_jangle', name: 'Jangle Bells'},
  {code: 'dkc3_gba_pokey', name: 'Pokey Pipes'},
  {code: 'dkc3_gba_over', name: 'Game Over'},
  {code: 'dkc3_gba_jungle', name: 'Jungle Jitter'},
  {code: 'dkc3_gba_chase', name: 'Chase'},
  {code: 'dkc3_gba_crystal', name: 'Crystal Chasm'},

  // 140-142
  {code: 'dkc3_gba_funky', name: 'Funky\'s Game'},
  {code: 'dkc3_gba_boss', name: 'Boss Boogie'},
  {code: 'dkc3_gba_credits', name: 'Credits'}
];

var ranges =
[
  [1, 27],
  [28, 65],
  [66, 102],
  [103, 113],
  [114, 116],
  [117, 142]
];

var games =
[
  'DKC SNES',
  'DKC2 SNES',
  'DKC3 SNES',
  'DKC GBA',
  'DKC2 GBA',
  'DKC3 GBA'
]

var music_selects = document.querySelector('.music-selects');
for (var i = 0; i < songs.length; i += 1)
{
  music_selects.insertAdjacentHTML('beforeend',
   '<div class="music-selects-button hidden" data-i="'+i+'">'
  +  '<img class="music-selects-img" src="images/small/'+songs[i].code+'.png" />'
  +  '<div class="music-selects-name">'+songs[i].name+'</div>'
  +'</div>');
}

var music_selectg = document.querySelector('.music-selectg');
var music_selectg_buttons = document.querySelectorAll('.music-selectg-button');
var music_selects_back = document.querySelector('.music-selects-back');
var music_selects_game = document.querySelector('.music-selects-game');
var music_selects_buttons = document.querySelectorAll('.music-selects-button');
var music_play = document.querySelector('.music-play');
var music_play_back = document.querySelector('.music-play-back');
var music_play_game = document.querySelector('.music-play-game');
var music_play_name = document.querySelector('.music-play-name');
var music_play_img = document.querySelector('.music-play-img');
var music_play_video = document.querySelector('.music-play-video');

music_selectg_buttons.forEach(function(button)
{
  button.addEventListener('click', function()
  {
    for (var i = 0; i < music_selects_buttons.length; i += 1)
    {
      if (i >= ranges[button.dataset.i-1][0]-1 && i <= ranges[button.dataset.i-1][1]-1)
        music_selects_buttons[i].classList.remove('hidden');
      else
        music_selects_buttons[i].classList.add('hidden');
    }
    music_selects_game.textContent = games[button.dataset.i-1];
    music_selects_game.dataset.color = button.dataset.color;
    music_play_game.textContent = games[button.dataset.i-1];
    music_selectg.classList.add('hidden');
    music_selects.classList.remove('hidden');
  });
});

music_selects_back.addEventListener('click', function()
{
  music_selects.classList.add('hidden');
  music_selectg.classList.remove('hidden');
});

music_selects_buttons.forEach(function(button)
{
  button.addEventListener('click', function()
  {
    music_play_name.textContent = songs[button.dataset.i].name;
    music_play_img.src = 'images/large/'+songs[button.dataset.i].code+'.png';
    music_play_video.src = 'videos/'+songs[button.dataset.i].code+'.mp4';
    music_selects.classList.add('hidden');
    music_play.classList.remove('hidden');
  });
});

music_play_back.addEventListener('click', function()
{
  music_play.classList.add('hidden');
  music_selects.classList.remove('hidden');
  music_play_video.pause();
});