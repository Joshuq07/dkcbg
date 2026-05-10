
"use client"

export default function Music() {

  return (
    <main>
      <head>
        <meta charset="UTF-8">
        <title>Music</title>
        <link rel="stylesheet" href="dkcbg_music.css">
      </head>
      <body>
        <div class="music-selectg">
          <div class="music-selectg-row">
            <div class="music-selectg-button" data-color="green" data-i="1">
              <img class="music-selectg-img" src="images/games/dkc_snes.png" />
              <div class="music-selectg-game">DKC SNES</div>
            </div>
            <div class="music-selectg-button" data-color="red" data-i="2">
              <img class="music-selectg-img" src="images/games/dkc2_snes.png" />
              <div class="music-selectg-game">DKC2 SNES</div>
            </div>
            <div class="music-selectg-button" data-color="blue" data-i="3">
              <img class="music-selectg-img" src="images/games/dkc3_snes.png" />
              <div class="music-selectg-game">DKC3 SNES</div>
            </div>
          </div>
          <div class="music-selectg-row">
            <div class="music-selectg-button" data-color="green" data-i="4">
              <img class="music-selectg-img" src="images/games/dkc_gba.png" />
              <div class="music-selectg-game">DKC GBA</div>
            </div>
            <div class="music-selectg-button" data-color="red" data-i="5">
              <img class="music-selectg-img" src="images/games/dkc2_gba.png" />
              <div class="music-selectg-game">DKC2 GBA</div>
            </div>
            <div class="music-selectg-button" data-color="blue" data-i="6">
              <img class="music-selectg-img" src="images/games/dkc3_gba.png" />
              <div class="music-selectg-game">DKC3 GBA</div>
            </div>
          </div>
        </div>

        <div class="music-selects hidden">
          <div class="music-selects-back">&lt; Back to Games</div>
          <div class="music-selects-game">DKC SNES</div>
        </div>

        <div class="music-play hidden">
          <div class="music-play-back">&lt; Back to Songs</div>
          <div class="music-play-game">DKC SNES</div>
          <div class="music-play-name">Opening Fanfare</div>
          <img class="music-play-img" src="images/large/dkc_snes_island.png" />
          <video class="music-play-video" width="1200" controls paused><source src="videos/dkc_snes_theme.mp4" type="video/mp4"></video>
        </div>
      </body>
      <script src="dkcbg_music.js"></script>
    </main>
  )
}
