"use client"

//@ts-ignore
import './dkcbg_music.css'

export default function Music() {

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
      <head>
        <title>Music</title>
        <link rel="stylesheet" href="dkcbg_music.css"></link>
      </head>

      <body>
        <div className="music-selectg">
          <div className="music-selectg-row">
            <div className="music-selectg-button" data-color="green" data-i="1">
              <img className="music-selectg-img" src="images/games/dkc_snes.png" />
              <div className="music-selectg-game">DKC SNES</div>
            </div>
            <div className="music-selectg-button" data-color="red" data-i="2">
              <img className="music-selectg-img" src="images/games/dkc2_snes.png" />
              <div className="music-selectg-game">DKC2 SNES</div>
            </div>
            <div className="music-selectg-button" data-color="blue" data-i="3">
              <img className="music-selectg-img" src="images/games/dkc3_snes.png" />
              <div className="music-selectg-game">DKC3 SNES</div>
            </div>
          </div>
          <div className="music-selectg-row">
            <div className="music-selectg-button" data-color="green" data-i="4">
              <img className="music-selectg-img" src="images/games/dkc_gba.png" />
              <div className="music-selectg-game">DKC GBA</div>
            </div>
            <div className="music-selectg-button" data-color="red" data-i="5">
              <img className="music-selectg-img" src="images/games/dkc2_gba.png" />
              <div className="music-selectg-game">DKC2 GBA</div>
            </div>
            <div className="music-selectg-button" data-color="blue" data-i="6">
              <img className="music-selectg-img" src="images/games/dkc3_gba.png" />
              <div className="music-selectg-game">DKC3 GBA</div>
            </div>
          </div>
        </div>

        <div className="music-selects hidden">
          <div className="music-selects-back">&lt; Back to Games</div>
          <div className="music-selects-game">DKC SNES</div>
        </div>

        <div className="music-play hidden">
          <div className="music-play-back">&lt; Back to Songs</div>
          <div className="music-play-game">DKC SNES</div>
          <div className="music-play-name">Opening Fanfare</div>
          <img className="music-play-img" src="images/large/dkc_snes_island.png" />
          <video className="music-play-video" width="1200" controls><source src="videos/dkc_snes_theme.mp4" type="video/mp4"></source></video>
        </div>
      </body>

      <script src="dkcbg_music.js"></script>
      </div>
    </main>
  )
}
