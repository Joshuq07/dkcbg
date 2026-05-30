'use client'

import { useAuth } from '@/lib/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'

const ACHIEVEMENTS = [
  { name: "It Ain't About the Money", stars: 2, challenge: "Max Out Kiddy's College Fund and Choose not to take it" },
  { name: "Broke but Beautiful", stars: 2, challenge: "Buy the Skin Pack" },
  { name: "Materialist", stars: 1, challenge: "Have your entire inventory filled with only materials" },
  { name: "Itemized", stars: 4, challenge: "Have your entire inventory filled with only Items" },
  { name: "Bank Failure", stars: 5, challenge: "Run out of money in the supply." },
  { name: "Surely These'll Be Useful", stars: 4, challenge: "Have a full inventory of only Gauntlet and Water" },
  { name: "Ability Sampler", stars: 1, challenge: "Use the effect of each ability your character can equip at least once" },
  { name: "Auction Addict", stars: 4, challenge: "Win an auction in all three games in one playthrough of the game" },
  { name: "Appreciator of the Classics", stars: 4, challenge: "Finish DKC 1 without building any levels from 2 or 3." },
  { name: "Complete Kong-Quest", stars: 4, challenge: "Finish DKC 2 without building any levels from 1 or 3." },
  { name: "Unforgettable Underdog", stars: 4, challenge: "Finish DKC 3 without building any levels from 1 or 2." },
  { name: "Absolute Perfectionist", stars: 5, challenge: "Build all of the levels in the game in order" },
  { name: "How'd I Get Here?", stars: 2, challenge: "Teleport into the Finish Space" },
  { name: "Beat by a Chicken Nugget", stars: 3, challenge: "Win an Expresso Race with Kubo Koko" },
  { name: "Way of the Dodo", stars: 3, challenge: "Win an Expresso Race with Dozy" },
  { name: "Dyna Dunce", stars: 2, challenge: "Get last place in an Expresso Race with Dyna Blade" },
  { name: "Stumped by Secrets", stars: 1, challenge: 'Fail every "!" in a world (Not TFK)' },
  { name: "Well, That Wasn't So Bad", stars: 2, challenge: "Get a Game Over and have the dice roll for levels you lose be a 0." },
  { name: "Swanky's Getting Suspicious", stars: 2, challenge: "Win every Swanky minigame in one board game playthrough (including green on roulette)" },
  { name: "Kerozene's Off Duty", stars: 1, challenge: "Steal someones Gunship Card" },
  { name: "Go Big or Go Home", stars: 1, challenge: "Build Animal Antics as your first Bonus Coin level." },
  { name: "Intruder Alert", stars: 2, challenge: "Warp into a Special World" },
  { name: "Good Clean Fightin'", stars: 3, challenge: "Beat any K. Rool fight in 1 turn without using E/R/A" },
  { name: "An Odd End", stars: 4, challenge: "Win the game as Odd Rock" },
  { name: "Leader of the Bunch", stars: 1, challenge: "Win the game as Donkey Kong" },
  { name: "He's Back Again", stars: 1, challenge: "Win the game as Diddy Kong" },
  { name: "Defiant Damsel", stars: 1, challenge: "Win the game as Dixie Kong" },
  { name: "Your Excellent Cousin", stars: 1, challenge: "Win the game as Kiddy Kong" },
  { name: "Skip and a Hop", stars: 1, challenge: "Win the game as Tiny Kong" },
  { name: "No Style, No Grace, No Problem", stars: 1, challenge: "Win the game as Lanky Kong" },
  { name: "One Hell of a Guy", stars: 1, challenge: "Win the game as Chunky Kong" },
  { name: "Got His Own Wish", stars: 1, challenge: "Win the game as Taj" },
  { name: "Climbing the Food Chain", stars: 1, challenge: "Win the game as Xananab" },
  { name: "Welcome to the Klub", stars: 1, challenge: "Win the game as Klubba" },
  { name: "Root of All Evil", stars: 1, challenge: "Win the game as VoidCo" },
  { name: "Kneel Before the King", stars: 1, challenge: "Win the game as K. Rool" },
  { name: "Teamwork Triumph", stars: 1, challenge: "Win the game as Banjo & Kazooie" },
  { name: "Good Fur Day", stars: 1, challenge: "Win the game as Conker" },
  { name: "Fully Staffed", stars: 3, challenge: "Build all Boss levels as Kremling Krew" },
  { name: "Book Nerd", stars: 3, challenge: "Win the game with only HW points" },
  { name: "Band Geek", stars: 3, challenge: "Win the game with only Music Points" },
  { name: "Prolific Builder", stars: 4, challenge: "Build 10 levels in a single turn" },
  { name: "Preposterous Builder", stars: 5, challenge: "Build 15 levels in a single turn" },
  { name: "How'd They Get There?", stars: 4, challenge: "Bring a non-player piece into the finish space before a player" },
  { name: "Ninja of Legend", stars: 3, challenge: "Last over _ seconds in spinjitzu" },
  { name: "Impostor Eliminated", stars: 2, challenge: "Beat K. Rool as K. Rool (in teams mode)" },
  { name: "Step 4: Profit", stars: 2, challenge: "Make $5000 in a single turn" },
  { name: "Get Lost", stars: 3, challenge: "Spend 20 turns in the lost world in a row" },
  { name: "Dedicated to the Craft", stars: 3, challenge: "Scrapbook a full inventory of cards in a single turn" },
  { name: "My Bad Mang", stars: 1, challenge: "Cause your teammate to get a GAME OVER" },
  { name: "Save the Best for Last", stars: 2, challenge: "Build Animal Antics as your last level" },
  { name: "End at the End", stars: 2, challenge: "Build Knautilus as your last level" },
  { name: "Start at the Start", stars: 2, challenge: "Build Jungle Hijinxs as your first level" },
  { name: "Photo Finish", stars: 3, challenge: "Win the game with your opponent being exactly 1 turn behind from winning" },
  { name: "We Like Fortnite", stars: 2, challenge: "Ride the Battle Bus with Tyler Ninja Blevins in your inventory" },
  { name: "I've Seen This One Before", stars: 3, challenge: "Win an auction in the same game twice in one game" },
  { name: "Worth Every Penny", stars: 2, challenge: "Spend all your money in an auction" },
  { name: "Bird Down", stars: 1, challenge: "Banana Bird to Lose a Bonus" },
  { name: "Playing Freestyle", stars: 4, challenge: "Complete a song with only rainbow notes" },
  { name: "Ultimate Summon", stars: 3, challenge: "Complete Donkey the Forbidden Kong" },
  { name: "Top-Tier Traveler", stars: 2, challenge: "Enter the finish space using flame runner" },
  { name: "Delayed Diploma", stars: 2, challenge: "Finish your HW as the last requirement you fulfill" },
  { name: "Dumped by Candy", stars: 2, challenge: "Win the game without saving or losing a level" },
  { name: "Anonymous", stars: 3, challenge: "Have 7 gray abilities equipped at once" },
  { name: "Against All Odds", stars: 2, challenge: "Get a game over and still win the game" },
  { name: "The Simple Life", stars: 4, challenge: "Win the game without ever having picked up any abilities other than core" },
  { name: "Guess I'll Die", stars: 5, challenge: "Starting with max lives, land on lose a life on consecutive turns and get GAME OVER" },
  { name: "Animal House", stars: 3, challenge: "Fill your inventory with only animals and have max inventory" },
  { name: "Everything Must Go", stars: 3, challenge: "Start your turn with max inventory and end it with 0 slots filled" },
  { name: "Betting It All", stars: 2, challenge: "Spend all your money at swanky's" },
  { name: "Big Money", stars: 1, challenge: "End the Game with $10000" },
  { name: "Huge Money", stars: 2, challenge: "End the Game with $15000" },
  { name: "Massive Money", stars: 3, challenge: "End the Game with $25000" },
  { name: "Ridiculous Money", stars: 4, challenge: "End the Game with $50000" },
  { name: "Absolutely Mental Money", stars: 5, challenge: "End the Game with $100000" },
  { name: "The Long Haul", stars: 3, challenge: "Win the game past rotation 500" },
  { name: "Speed Demon", stars: 4, challenge: "Win the game in under 200 turns" },
  { name: "Test Corrections", stars: 3, challenge: "Go under 200pts of Hw+Music after you've already gotten to/past 200" },
  { name: "Ya Missed One", stars: 3, challenge: "Lose a level after building all levels" },
  { name: "Supreme Showoff", stars: 5, challenge: "Win the Game while also completing another 5 difficulty achievement" },
  { name: "Scalper Scum", stars: 2, challenge: "Steal a golden ticket from someone and sell it" },
  { name: "Weaker than Worms", stars: 3, challenge: "Finish lower than Wizpig (not for the Taj player)" },
  { name: "Where Banana", stars: 2, challenge: "Land on DK's Banana Hoard and have it be empty" },
  { name: "Banana Parking Payday", stars: 3, challenge: "Land on DK's Banana Hoard and receive over $5000 from it" },
  { name: "A Cappella", stars: 1, challenge: "Complete a song without having unlocked your instrument" },
  { name: "Chombo!", stars: 1, challenge: 'Commit a "chombo" during Mahkong' },
  { name: "Surviving on Scraps", stars: 4, challenge: "Never go above your starting amount of money ($2425)" },
  { name: "Go Touch Grass", stars: 3, challenge: "Finish the entire game within 24 hours of real time" },
  { name: "Seen All There Is to See", stars: 5, challenge: "In one playthrough, go all the way through every draw pile" },
  { name: "Return by Death", stars: 4, challenge: "Build the same level 4 times" },
  { name: "Painful Nostalgia", stars: 4, challenge: "Lose Tree Top Town due to the Stormtroopers bonus, or Ripsaw Rage due to the hacksaw crazy bonus" },
  { name: "Weight-Loss Whack-Job", stars: 3, challenge: "Build Animal Antics for free from the Ozempic bonus" },
  { name: "Endgame Evasion", stars: 5, challenge: 'Avoid "The Snap" by winning the 1-in-14,000,605 roll' },
  { name: "100 Turns of Mystery", stars: 3, challenge: "Remain invisible with 2 VoidCo Kongs for 100 turns in a row." },
]

const CHARACTER_NAMES = [
  "Donkey Kong", "Diddy Kong", "Dixie Kong", "Kiddy Kong",
  "Tiny Kong", "Lanky Kong", "Chunky Kong", "Taj",
  "Xananab", "Klubba", "VoidCo", "King K. Rool"
]

const PLAYERS = [
  { id: 'josh', name: 'Josh' },
  { id: 'justin', name: 'Justin' },
  { id: 'austin', name: 'Austin' },
  { id: 'tom', name: 'Tom' },
  { id: 'chris', name: 'Chris' },
  { id: 'dario', name: 'Dario' },
  { id: 'eddie', name: 'Eddie' },
  { id: 'everett', name: 'Everett' },
]

type Completion = {
  id: string
  achievement_name: string
  user_email: string
  display_name: string | null
  character_name: string | null
  player_id: string | null
  game_number: number | null
  created_at: string
}

function Stars({ count }: { count: number }) {
  return (
    <span className="text-yellow-500 shrink-0">{'★'.repeat(count)}</span>
  )
}

function CompletionTrophy({ completion }: { completion: Completion }) {
  const [hovered, setHovered] = useState(false)
  const imgSrc = completion.player_id ? `/trophies/${completion.player_id}.png` : null

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-10 h-10 rounded-full overflow-hidden border-2 cursor-pointer"
        style={{ borderColor: '#FFD700' }}
      >
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={completion.display_name ?? completion.user_email}
            width={40}
            height={40}
            className="object-contain w-full h-full"
            style={{ filter: 'brightness(0.95) sepia(1) saturate(3) hue-rotate(10deg)' }}
          />
        ) : (
          <div className="w-full h-full bg-yellow-100 flex items-center justify-center text-xs font-bold text-yellow-600">
            {(completion.display_name ?? completion.user_email)[0]?.toUpperCase()}
          </div>
        )}
      </div>

      {hovered && (
        <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded-lg shadow-xl pointer-events-none"
          style={{ minWidth: 180, padding: '10px 12px' }}>
          <div className="text-xs font-bold mb-1" style={{ color: '#FFD700' }}>🏆 Completed</div>
          {completion.display_name && <div className="text-xs text-white mb-0.5">{completion.display_name}</div>}
          <div className="text-xs text-gray-400 mb-0.5">{completion.user_email}</div>
          {completion.character_name && <div className="text-xs text-gray-300 mb-0.5">as {completion.character_name}</div>}
          {completion.game_number && <div className="text-xs text-gray-400">Game #{completion.game_number}</div>}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
            style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #111827' }}
          />
        </div>
      )}
    </div>
  )
}

export default function AchievementsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const [completions, setCompletions] = useState<Completion[]>([])
  const [sortByStars, setSortByStars] = useState(false)
  const [modalAchievement, setModalAchievement] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [characterName, setCharacterName] = useState('')
  const [playerId, setPlayerId] = useState('')
  const [gameNumber, setGameNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/')
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    fetch('/api/achievements')
      .then(r => r.json())
      .then(data => setCompletions(data.completions ?? []))
  }, [])

  useEffect(() => {
    if (user?.name) setDisplayName(user.name)
  }, [user])

  const displayedAchievements = sortByStars
    ? [...ACHIEVEMENTS].sort((a, b) => b.stars - a.stars)
    : ACHIEVEMENTS

  async function handleSubmit() {
    if (!user?.email || !modalAchievement) return
    setSubmitting(true)
    const res = await fetch('/api/achievements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        achievement_name: modalAchievement,
        user_email: user.email,
        display_name: displayName || null,
        character_name: characterName || null,
        player_id: playerId || null,
        game_number: gameNumber ? parseInt(gameNumber) : null,
      })
    })
    const data = await res.json()
    if (data.completion) {
      setCompletions(prev => [...prev, data.completion])
    }
    setSubmitting(false)
    setModalAchievement(null)
    setCharacterName('')
    setPlayerId('')
    setGameNumber('')
  }

  if (isLoading || !user) return <div className="page-container">Loading...</div>

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Achievements</h1>
        <button
          onClick={() => setSortByStars(s => !s)}
          className={`px-3 py-1.5 rounded border text-sm font-medium transition-colors ${sortByStars
              ? 'bg-yellow-400 text-yellow-900 border-yellow-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
        >
          {sortByStars ? 'Sort: By Stars' : 'Sort: Default'}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {displayedAchievements.map(achievement => {
          const achieved = completions.filter(c => c.achievement_name === achievement.name)
          return (
            <div
              key={achievement.name}
              className="flex items-center gap-3 p-3 border rounded-lg bg-white shadow-sm"
            >
              <Stars count={achievement.stars} />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-gray-800">{achievement.name}</span>
                <span className="text-sm text-gray-500 ml-2">{achievement.challenge}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {achieved.map(c => (
                  <CompletionTrophy key={c.id} completion={c} />
                ))}
                <button
                  onClick={() => setModalAchievement(achievement.name)}
                  className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center text-lg font-bold leading-none ml-1 shrink-0"
                >
                  +
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {modalAchievement && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900 pr-4 leading-tight">{modalAchievement}</h2>
              <button
                onClick={() => setModalAchievement(null)}
                className="text-gray-400 hover:text-gray-700 text-xl leading-none shrink-0"
              >✕</button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Display Name</label>
                <input
                  className="w-full border rounded px-3 py-1.5 text-sm"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Account Email</label>
                <div className="w-full border rounded px-3 py-1.5 text-sm bg-gray-50 text-gray-500">{user.email}</div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Character</label>
                <select
                  className="w-full border rounded px-3 py-1.5 text-sm bg-white"
                  value={characterName}
                  onChange={e => setCharacterName(e.target.value)}
                >
                  <option value="">Select character...</option>
                  {CHARACTER_NAMES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Player Image</label>
                <select
                  className="w-full border rounded px-3 py-1.5 text-sm bg-white"
                  value={playerId}
                  onChange={e => setPlayerId(e.target.value)}
                >
                  <option value="">Select player...</option>
                  {PLAYERS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Game Number</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-1.5 text-sm"
                  value={gameNumber}
                  onChange={e => setGameNumber(e.target.value)}
                  placeholder="e.g. 7"
                  min={1}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-semibold"
              >
                {submitting ? 'Saving...' : 'Mark as Completed'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}