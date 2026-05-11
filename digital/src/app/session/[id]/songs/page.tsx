"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function Music() {
  useEffect(() => {
    const gameButtons = document.querySelectorAll(".music-selectg-button");
    const gameScreen = document.querySelector(".music-selectg") as HTMLElement;
    const songScreen = document.querySelector(".music-selects") as HTMLElement;
    const playScreen = document.querySelector(".music-play") as HTMLElement;

    const backToGames = document.querySelector(".music-selects-back") as HTMLElement;
    const backToSongs = document.querySelector(".music-play-back") as HTMLElement;

    gameButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        gameScreen.classList.add("hidden");
        songScreen.classList.remove("hidden");

        const color = btn.getAttribute("data-color");
        const gameName = btn.querySelector(".music-selectg-game")?.textContent;

        const gameTitle = document.querySelector(".music-selects-game") as HTMLElement;
        gameTitle.textContent = gameName || "";
        gameTitle.setAttribute("data-color", color || "");
      });
    });

    backToGames?.addEventListener("click", () => {
      songScreen.classList.add("hidden");
      gameScreen.classList.remove("hidden");
    });

    backToSongs?.addEventListener("click", () => {
      playScreen.classList.add("hidden");
      songScreen.classList.remove("hidden");
    });
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <style>{`
        .hidden
{
  display: none !important;
}

html
{
  height: 100%;
}

body
{
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  background: white;
  background-image: url(music_bg.png);
  background-position: center center;
}

.music-selectg
{
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-wrap: wrap;
  align-items: center;
}

.music-selectg-row
{
  display: flex;
  flex-direction: row;
}

.music-selectg-button
{
  padding: 25px;
  margin: 25px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.music-selectg-button[data-color="green"]
{
  border: 1px solid #008000;
  background: #00a00080;
}
.music-selectg-button[data-color="green"]:hover
{
  background: #00d00080;
}
.music-selectg-button[data-color="red"]
{
  border: 1px solid #800000;
  background: #c0000080;
}
.music-selectg-button[data-color="red"]:hover
{
  background: #ff000080;
}
.music-selectg-button[data-color="blue"]
{
  border: 1px solid #000080;
  background: #003fbf80;
}
.music-selectg-button[data-color="blue"]:hover
{
  background: #3D81FF80;
}

.music-selectg-game,
.music-selects-game
{
  font-size: 24px;
  font-family: 'Helvetica';
  font-style: italic;
  letter-spacing: 1px;
  color: white;
  text-align: center;
  margin-top: 10px;
  width: fit-content;
  border-radius: 5px;
  padding: 5px;
}
[data-color="green"] .music-selectg-game,
.music-selects-game[data-color="green"]
{
  background: #00800080;
}
[data-color="red"] .music-selectg-game,
.music-selects-game[data-color="red"]
{
  background: #c0000080;
}
[data-color="blue"] .music-selectg-game,
.music-selects-game[data-color="blue"]
{
  background: #003fbf80;
}

.music-selectg-img
{
  width: 225px;
}

.music-selects
{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  flex-basis: 0;
}

.music-selects-button
{
  border: 1px solid pink;
  padding: 8px;
  margin: 15px 6px;
  max-width: 200px;
  cursor: pointer;
  background: #FFCCEF80;
}
.music-selects-button:hover
{
  background: white;
}

.music-selects-img
{
  width: 200px;
  height: 80px;
}

.music-selects-name
{
  font-size: 16px;
  color: #ff0bb3;
  font-family: 'Book Antiqua';
  font-weight: bold;
  text-align: center;
  height: 20px;
}

.music-selects-back,
.music-play-back
{
  font-size: 16px;
  color: gray;
  font-family: 'Book Antiqua';
  border: 1px solid gray;
  font-weight: bold;
  padding: 10px;
  cursor: pointer;
  position: absolute;
  left: 20px;
  top: 20px;
  background: #cccccc80;
}
.music-selects-back:hover,
.music-play-back:hover
{
  background: #eeeeee80;
}

.music-play
{
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 1000px;
  max-width: 90%;
}

.music-play-game
{
  font-size: 24px;
  font-family: 'Helvetica';
  font-style: italic;
  letter-spacing: 1px;
  color: gray;
}

.music-play-name
{
  font-size: 56px;
  color: #ff0bb3;
  font-family: 'Book Antiqua';
  font-weight: bold;
  margin-bottom: 20px;
}

.music-play-img,
.music-play-video
{
  width: 1200px;
  height: 337.5px;
}
      `}</style>

      <div className="max-w-5xl mx-auto">
        <div className="music-selectg">
          <div className="music-selectg-row">
            <div className="music-selectg-button" data-color="green">
              <Image src="/games/dkc_snes.png" alt="DKC SNES" width={225} height={150} />
              <div className="music-selectg-game">DKC SNES</div>
            </div>

            <div className="music-selectg-button" data-color="red">
              <Image src="/games/dkc2_snes.png" alt="DKC2 SNES" width={225} height={150} />
              <div className="music-selectg-game">DKC2 SNES</div>
            </div>

            <div className="music-selectg-button" data-color="blue">
              <Image src="/games/dkc3_snes.png" alt="DKC3 SNES" width={225} height={150} />
              <div className="music-selectg-game">DKC3 SNES</div>
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

          <Image
            src="/large/dkc_snes_island.png"
            alt="DKC SNES Island"
            width={1200}
            height={337}
          />

          <video className="music-play-video" controls>
            <source src="videos/dkc_snes_theme.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </main>
  );
}
