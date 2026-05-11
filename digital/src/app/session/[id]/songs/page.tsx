"use client"

import { useState, useRef } from 'react'

// ── Data ────────────────────────────────────────────────────────────────────

const songs = [
  // 1-9
  { code: 'dkc_snes_opening',  name: 'Opening Fanfare' },
  { code: 'dkc_snes_theme',    name: 'Theme' },
  { code: 'dkc_snes_simian',   name: 'Simian Segue' },
  { code: 'dkc_snes_island',   name: 'DK Island Swing' },
  { code: 'dkc_snes_clear',    name: 'Stage Clear' },
  { code: 'dkc_snes_cranky',   name: "Cranky's Theme" },
  { code: 'dkc_snes_cave',     name: 'Cave Dweller Concert' },
  { code: 'dkc_snes_aquatic',  name: 'Aquatic Ambiance' },
  { code: 'dkc_snes_life',     name: 'Lose a Life' },
  // 10-19
  { code: 'dkc_snes_funky',    name: "Funky's Fugue" },
  { code: 'dkc_snes_candy',    name: "Candy's Love Song" },
  { code: 'dkc_snes_boss',     name: 'Bad Boss Boogie' },
  { code: 'dkc_snes_cart',     name: 'Mine Cart Madness' },
  { code: 'dkc_snes_misty',    name: 'Misty Menace' },
  { code: 'dkc_snes_temple',   name: 'Voices of the Temple' },
  { code: 'dkc_snes_forest',   name: 'Forest Frenzy' },
  { code: 'dkc_snes_bonus',    name: 'Bonus Boom Blitz' },
  { code: 'dkc_snes_win',      name: 'Bonus Win' },
  { code: 'dkc_snes_treetop',  name: 'Treetop Rock' },
  // 20-27
  { code: 'dkc_snes_northern', name: 'Northern Hemispheres' },
  { code: 'dkc_snes_ice',      name: 'Ice Cave Chant' },
  { code: 'dkc_snes_factory',  name: 'Fear Factory' },
  { code: 'dkc_snes_mines',    name: 'Life in the Mines' },
  { code: 'dkc_snes_lose',     name: 'Bonus Lose' },
  { code: 'dkc_snes_cacophony',name: "K. Rool's Cacophony" },
  { code: 'dkc_snes_gang',     name: 'Gang-Plank Galleon' },
  { code: 'dkc_snes_credits',  name: 'The Credits Concerto' },
  // 28-65  DKC2 SNES
  { code: 'dkc2_snes_opening', name: 'Opening Fanfare' },
  { code: 'dkc2_snes_returns', name: 'K. Rool Returns' },
  { code: 'dkc2_snes_rhumba',  name: 'Steel Drum Rhumba' },
  { code: 'dkc2_snes_welcome', name: 'Welcome to Crocodile Isle' },
  { code: 'dkc2_snes_klomp',   name: "Klomp's Romp" },
  { code: 'dkc2_snes_life',    name: 'Lose a Life' },
  { code: 'dkc2_snes_token',   name: 'Token Tango' },
  { code: 'dkc2_snes_jib',     name: 'Jib Jig' },
  { code: 'dkc2_snes_clear',   name: 'Stage Clear' },
  { code: 'dkc2_snes_school',  name: 'School House Harmony' },
  { code: 'dkc2_snes_lockjaw', name: "Lockjaw's Saga" },
  { code: 'dkc2_snes_funky',   name: 'Funky the Main Monkey' },
  { code: 'dkc2_snes_hot',     name: 'Hot-Head Hop' },
  { code: 'dkc2_snes_swanky',  name: "Swanky's Swing" },
  { code: 'dkc2_snes_mining',  name: 'Mining Melancholy' },
  { code: 'dkc2_snes_boss',    name: 'Boss Bossanova' },
  { code: 'dkc2_snes_diddy',   name: 'End Target (Diddy)' },
  { code: 'dkc2_snes_bayou',   name: 'Bayou Boogie' },
  { code: 'dkc2_snes_snakey',  name: 'Snakey Chantey' },
  { code: 'dkc2_snes_cranky',  name: "Cranky's Conga" },
  { code: 'dkc2_snes_sticker', name: 'Stickerbush Symphony' },
  { code: 'dkc2_snes_zinger',  name: 'Flight of the Zinger' },
  { code: 'dkc2_snes_disco',   name: 'Disco Train' },
  { code: 'dkc2_snes_dixie',   name: 'End Target (Dixie)' },
  { code: 'dkc2_snes_rambi',   name: 'Run, Rambi! Run!' },
  { code: 'dkc2_snes_forest',  name: 'Forest Interlude' },
  { code: 'dkc2_snes_haunted', name: 'Haunted Chase' },
  { code: 'dkc2_snes_snow',    name: 'In a Snow-Bound Land' },
  { code: 'dkc2_snes_krook',   name: "Krook's March" },
  { code: 'dkc2_snes_over',    name: 'Game Over' },
  { code: 'dkc2_snes_klubba',  name: "Klubba's Reveille" },
  { code: 'dkc2_snes_lost',    name: 'Lost World Anthem' },
  { code: 'dkc2_snes_primal',  name: 'Primal Rave' },
  { code: 'dkc2_snes_strong',  name: 'Stronghold Showdown' },
  { code: 'dkc2_snes_flying',  name: 'The Flying Krock' },
  { code: 'dkc2_snes_bird',    name: 'Bad Bird Rag' },
  { code: 'dkc2_snes_cacophony',name: 'Crocodile Cacophony' },
  { code: 'dkc2_snes_rescued', name: 'Donkey Kong Rescued' },
  // 66-102  DKC3 SNES
  { code: 'dkc3_snes_opening', name: 'Opening Fanfare' },
  { code: 'dkc3_snes_dixie',   name: 'Dixie Beat' },
  { code: 'dkc3_snes_crazy',   name: 'Crazy Calypso' },
  { code: 'dkc3_snes_northern',name: 'Northern Kremisphere' },
  { code: 'dkc3_snes_bear',    name: 'Brothers Bear' },
  { code: 'dkc3_snes_funky',   name: "Hangin' at Funky's" },
  { code: 'dkc3_snes_stilt',   name: 'Stilt Village' },
  { code: 'dkc3_snes_clear',   name: 'Stage Clear' },
  { code: 'dkc3_snes_mill',    name: 'Mill Fever' },
  { code: 'dkc3_snes_swanky',  name: "Swanky's Sideshow" },
  { code: 'dkc3_snes_boss',    name: 'Boss Boogie' },
  { code: 'dkc3_snes_submap',  name: 'Submap Shuffle' },
  { code: 'dkc3_snes_treetop', name: 'Treetop Tumble' },
  { code: 'dkc3_snes_river',   name: 'Enchanted Riverbank' },
  { code: 'dkc3_snes_cascade', name: 'Cascade Capers' },
  { code: 'dkc3_snes_bonus',   name: 'Bonus Time' },
  { code: 'dkc3_snes_nuts',    name: 'Nuts and Bolts' },
  { code: 'dkc3_snes_pursuit', name: 'Hot Pursuit' },
  { code: 'dkc3_snes_pokey',   name: 'Pokey Pipes' },
  { code: 'dkc3_snes_wrinkly', name: "Wrinkly's Save Cave" },
  { code: 'dkc3_snes_fit',     name: 'Get Fit A-Go-Go' },
  { code: 'dkc3_snes_64',      name: 'Wrinkly 64' },
  { code: 'dkc3_snes_jangle',  name: 'Jangle Bells' },
  { code: 'dkc3_snes_frosty',  name: 'Frosty Frolics' },
  { code: 'dkc3_snes_cavern',  name: 'Cavern Caprice' },
  { code: 'dkc3_snes_life',    name: 'Lose a Life' },
  { code: 'dkc3_snes_rockface',name: 'Rockface Rumble' },
  { code: 'dkc3_snes_water',   name: 'Water World' },
  { code: 'dkc3_snes_crystal', name: 'Crystal Chasm' },
  { code: 'dkc3_snes_jungle',  name: 'Jungle Jitter' },
  { code: 'dkc3_snes_over',    name: 'Game Over' },
  { code: 'dkc3_snes_big',     name: 'Big Boss Blues' },
  { code: 'dkc3_snes_parade',  name: 'Baddies on Parade' },
  { code: 'dkc3_snes_krematoa',name: 'Krematoa Koncerto' },
  { code: 'dkc3_snes_rocket',  name: 'Rocket Run' },
  { code: 'dkc3_snes_mama',    name: 'Mama Bird' },
  { code: 'dkc3_snes_chase',   name: 'Chase' },
  // 103-113  DKC GBA
  { code: 'dkc_gba_intro',     name: 'Intro Story' },
  { code: 'dkc_gba_funky',     name: "Funky's Fugue" },
  { code: 'dkc_gba_fishing',   name: 'Funky Fishing' },
  { code: 'dkc_gba_warp',      name: 'Warp Tune' },
  { code: 'dkc_gba_candy',     name: "Candy's Love Song" },
  { code: 'dkc_gba_dance1',    name: 'Candy Dance 1' },
  { code: 'dkc_gba_dance2',    name: 'Candy Dance 2' },
  { code: 'dkc_gba_dance3',    name: 'Candy Dance 3' },
  { code: 'dkc_gba_dance4',    name: 'Candy Dance 4' },
  { code: 'dkc_gba_dance5',    name: 'Candy Dance 5' },
  { code: 'dkc_gba_dance6',    name: 'Candy Dance 6' },
  // 114-116  DKC2 GBA
  { code: 'dkc2_gba_intro',    name: 'Intro Story' },
  { code: 'dkc2_gba_funky',    name: "Funky's Flights" },
  { code: 'dkc2_gba_expresso', name: 'Expresso Racing' },
  // 117-142  DKC3 GBA
  { code: 'dkc3_gba_intro',    name: 'Intro Tune' },
  { code: 'dkc3_gba_northern', name: 'Northern Kremisphere' },
  { code: 'dkc3_gba_bear',     name: 'Brothers Bear' },
  { code: 'dkc3_gba_stilt',    name: 'Stilt Village' },
  { code: 'dkc3_gba_mill',     name: 'Mill Fever' },
  { code: 'dkc3_gba_frosty',   name: 'Frosty Frolics' },
  { code: 'dkc3_gba_clear',    name: 'Stage Clear' },
  { code: 'dkc3_gba_treetop',  name: 'Treetop Tumble' },
  { code: 'dkc3_gba_cranky',   name: "Cranky's Dojo" },
  { code: 'dkc3_gba_river',    name: 'Enchanted Riverbank' },
  { code: 'dkc3_gba_arich',    name: 'Arich Boss' },
  { code: 'dkc3_gba_cascade',  name: 'Cascade Capers' },
  { code: 'dkc3_gba_nuts',     name: 'Nuts and Bolts' },
  { code: 'dkc3_gba_cavern',   name: 'Cavern Caprice' },
  { code: 'dkc3_gba_rockface', name: 'Rockface Rumble' },
  { code: 'dkc3_gba_bonus',    name: 'Bonus Time' },
  { code: 'dkc3_gba_water',    name: 'Water World' },
  { code: 'dkc3_gba_jangle',   name: 'Jangle Bells' },
  { code: 'dkc3_gba_pokey',    name: 'Pokey Pipes' },
  { code: 'dkc3_gba_over',     name: 'Game Over' },
  { code: 'dkc3_gba_jungle',   name: 'Jungle Jitter' },
  { code: 'dkc3_gba_chase',    name: 'Chase' },
  { code: 'dkc3_gba_crystal',  name: 'Crystal Chasm' },
  { code: 'dkc3_gba_funky',    name: "Funky's Game" },
  { code: 'dkc3_gba_boss',     name: 'Boss Boogie' },
  { code: 'dkc3_gba_credits',  name: 'Credits' },
]

// ranges are 1-based inclusive, matching the original JS
const ranges: [number, number][] = [
  [1,   27],
  [28,  65],
  [66,  102],
  [103, 113],
  [114, 116],
  [117, 142],
]

const games = [
  'DKC SNES',
  'DKC2 SNES',
  'DKC3 SNES',
  'DKC GBA',
  'DKC2 GBA',
  'DKC3 GBA',
]

type GameColor = 'green' | 'red' | 'blue'

const gameButtons: { color: GameColor; i: number }[] = [
  { color: 'green', i: 1 },
  { color: 'red',   i: 2 },
  { color: 'blue',  i: 3 },
  { color: 'green', i: 4 },
  { color: 'red',   i: 5 },
  { color: 'blue',  i: 6 },
]

// ── Styles (verbatim from dkcbg_music.css, translated to React CSSProperties) ──

const styles = {
  page: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    background: 'white',
    backgroundImage: 'url(/music_bg.png)',
    backgroundPosition: 'center center',
  },

  // ── Select Game ──
  selectG: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
  },
  selectGRow: {
    display: 'flex',
    flexDirection: 'row' as const,
  },
  selectGButton: (color: GameColor): React.CSSProperties => ({
    padding: '25px',
    margin: '25px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: `1px solid ${color === 'green' ? '#008000' : color === 'red' ? '#800000' : '#000080'}`,
    background: color === 'green' ? '#00a00080' : color === 'red' ? '#c0000080' : '#003fbf80',
    transition: 'background 0.15s',
  }),
  selectGImg: {
    width: '225px',
  } as React.CSSProperties,
  selectGGame: (color: GameColor): React.CSSProperties => ({
    fontSize: '24px',
    fontFamily: 'Helvetica',
    fontStyle: 'italic',
    letterSpacing: '1px',
    color: 'white',
    textAlign: 'center',
    marginTop: '10px',
    width: 'fit-content',
    borderRadius: '5px',
    padding: '5px',
    background: color === 'green' ? '#00800080' : color === 'red' ? '#c0000080' : '#003fbf80',
  }),

  // ── Select Song ──
  selectS: {
    display: 'flex',
    flexDirection: 'row' as const,
    width: '100%',
    height: '100%',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectSGame: (color: GameColor): React.CSSProperties => ({
    fontSize: '24px',
    fontFamily: 'Helvetica',
    fontStyle: 'italic',
    letterSpacing: '1px',
    color: 'white',
    textAlign: 'center',
    width: '100%',
    marginBottom: '10px',
    borderRadius: '5px',
    padding: '5px',
    background: color === 'green' ? '#00800080' : color === 'red' ? '#c0000080' : '#003fbf80',
  }),
  selectSButton: {
    border: '1px solid pink',
    padding: '8px',
    margin: '15px 6px',
    maxWidth: '200px',
    cursor: 'pointer',
    background: '#FFCCEF80',
    transition: 'background 0.15s',
  } as React.CSSProperties,
  selectSImg: {
    width: '200px',
    height: '80px',
    objectFit: 'cover' as const,
  },
  selectSName: {
    fontSize: '16px',
    color: '#ff0bb3',
    fontFamily: 'Book Antiqua',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    height: '20px',
  },

  // ── Back button (shared) ──
  backBtn: {
    fontSize: '16px',
    color: 'gray',
    fontFamily: 'Book Antiqua',
    border: '1px solid gray',
    fontWeight: 'bold',
    padding: '10px',
    cursor: 'pointer',
    position: 'absolute' as const,
    left: '20px',
    top: '20px',
    background: '#cccccc80',
    transition: 'background 0.15s',
    zIndex: 10,
  },

  // ── Play ──
  play: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    width: '1000px',
    maxWidth: '90%',
  },
  playGame: {
    fontSize: '24px',
    fontFamily: 'Helvetica',
    fontStyle: 'italic',
    letterSpacing: '1px',
    color: 'gray',
  } as React.CSSProperties,
  playName: {
    fontSize: '56px',
    color: '#ff0bb3',
    fontFamily: 'Book Antiqua',
    fontWeight: 'bold',
    marginBottom: '20px',
  } as React.CSSProperties,
  playMedia: {
    width: '1200px',
    height: '337.5px',
    maxWidth: '100%',
  } as React.CSSProperties,
}

// ── Component ────────────────────────────────────────────────────────────────

type View = 'selectGame' | 'selectSong' | 'play'

export default function Music() {
  const [view, setView] = useState<View>('selectGame')
  const [selectedGameIdx, setSelectedGameIdx] = useState<number>(0)   // 0-based index into games[]
  const [selectedGameColor, setSelectedGameColor] = useState<GameColor>('green')
  const [selectedSongIdx, setSelectedSongIdx] = useState<number>(0)   // 0-based index into songs[]
  const videoRef = useRef<HTMLVideoElement>(null)

  // hover states
  const [hoveredGame, setHoveredGame] = useState<number | null>(null)
  const [hoveredSong, setHoveredSong] = useState<number | null>(null)
  const [hoveredBack, setHoveredBack] = useState(false)

  // Songs visible for the currently selected game (0-based indices into songs[])
  const visibleSongIndices = (() => {
    const [start, end] = ranges[selectedGameIdx]    // 1-based
    const result: number[] = []
    for (let i = start - 1; i <= end - 1; i++) result.push(i)
    return result
  })()

  function selectGame(buttonI: number, color: GameColor) {
    const idx = buttonI - 1   // convert to 0-based
    setSelectedGameIdx(idx)
    setSelectedGameColor(color)
    setView('selectSong')
  }

  function selectSong(songIdx: number) {
    setSelectedSongIdx(songIdx)
    setView('play')
  }

  function backToGames() {
    setView('selectGame')
  }

  function backToSongs() {
    if (videoRef.current) videoRef.current.pause()
    setView('selectSong')
  }

  const song = songs[selectedSongIdx]

  return (
    <div style={styles.page}>

      {/* ── SELECT GAME ── */}
      {view === 'selectGame' && (
        <div style={styles.selectG}>
          {/* Row 1: SNES */}
          <div style={styles.selectGRow}>
            {gameButtons.slice(0, 3).map(({ color, i }) => (
              <div
                key={i}
                style={{
                  ...styles.selectGButton(color),
                  background: hoveredGame === i
                    ? color === 'green' ? '#00d00080' : color === 'red' ? '#ff000080' : '#3D81FF80'
                    : styles.selectGButton(color).background,
                }}
                onClick={() => selectGame(i, color)}
                onMouseEnter={() => setHoveredGame(i)}
                onMouseLeave={() => setHoveredGame(null)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img style={styles.selectGImg} src={`/games/${games[i - 1].toLowerCase().replace(' ', '_')}.png`} alt={games[i - 1]} />
                <div style={styles.selectGGame(color)}>{games[i - 1]}</div>
              </div>
            ))}
          </div>
          {/* Row 2: GBA */}
          <div style={styles.selectGRow}>
            {gameButtons.slice(3).map(({ color, i }) => (
              <div
                key={i}
                style={{
                  ...styles.selectGButton(color),
                  background: hoveredGame === i
                    ? color === 'green' ? '#00d00080' : color === 'red' ? '#ff000080' : '#3D81FF80'
                    : styles.selectGButton(color).background,
                }}
                onClick={() => selectGame(i, color)}
                onMouseEnter={() => setHoveredGame(i)}
                onMouseLeave={() => setHoveredGame(null)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img style={styles.selectGImg} src={`/games/${games[i - 1].toLowerCase().replace(' ', '_')}.png`} alt={games[i - 1]} />
                <div style={styles.selectGGame(color)}>{games[i - 1]}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SELECT SONG ── */}
      {view === 'selectSong' && (
        <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
          <div
            style={{ ...styles.backBtn, background: hoveredBack ? '#eeeeee80' : '#cccccc80' }}
            onClick={backToGames}
            onMouseEnter={() => setHoveredBack(true)}
            onMouseLeave={() => setHoveredBack(false)}
          >
            &lt; Back to Games
          </div>

          <div style={styles.selectS}>
            <div style={styles.selectSGame(selectedGameColor)}>
              {games[selectedGameIdx]}
            </div>

            {visibleSongIndices.map((songIdx) => (
              <div
                key={songIdx}
                style={{
                  ...styles.selectSButton,
                  background: hoveredSong === songIdx ? 'white' : '#FFCCEF80',
                }}
                onClick={() => selectSong(songIdx)}
                onMouseEnter={() => setHoveredSong(songIdx)}
                onMouseLeave={() => setHoveredSong(null)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img style={styles.selectSImg} src={`/small/${songs[songIdx].code}.png`} alt={songs[songIdx].name} />
                <div style={styles.selectSName}>{songs[songIdx].name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PLAY ── */}
      {view === 'play' && (
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div
            style={{ ...styles.backBtn, background: hoveredBack ? '#eeeeee80' : '#cccccc80' }}
            onClick={backToSongs}
            onMouseEnter={() => setHoveredBack(true)}
            onMouseLeave={() => setHoveredBack(false)}
          >
            &lt; Back to Songs
          </div>

          <div style={styles.play}>
            <div style={styles.playGame}>{games[selectedGameIdx]}</div>
            <div style={styles.playName}>{song.name}</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img style={styles.playMedia} src={`/large/${song.code}.png`} alt={song.name} />
            <video
              ref={videoRef}
              style={styles.playMedia}
              width={1200}
              controls
              src={`/videos/${song.code}.mp4`}
            />
          </div>
        </div>
      )}

    </div>
  )
}
