// src/lib/dkcbg/data.ts

// -----------------------------
// Level Names
// -----------------------------
export const levelNames: string[] = [
  "Jungle Hijinxs",
  "Ropey Rampage",
  "Reptile Rumble",
  "Coral Capers",
  "Barrel Cannon Canyon",
  "Very Gnawty's Lair",
  "Winky's Walkway",
  "Mine Cart Carnage",
  "Bouncy Bonanza",
  "Stop & Go Station",
  "Millstone Mayhem",
  "Necky's Nuts",
  "Vulture Culture",
  "Tree Top Town",
  "Forest Frenzy",
  "Orang-Utan Gang",
  "Clam City",
  "Temple Tempest",
  "Bumble B. Rumble",
  "Snow Barrel Blast",
  "Slipslide Ride",
  "Croctopus Chase",
  "Ice Age Alley",
  "Rope Bridge Rumble",
  "Torchlight Trouble",
  "Really Gnawty Rampage",
  "Oil Drum Alley",
  "Trick Track Trek",
  "Poison Pond",
  "Elevator Antics",
  "Blackout Basement",
  "Mine Cart Madness",
  "Boss Dumb Drum",
  "Tanked Up Trouble",
  "Manic Mincers",
  "Misty Mine",
  "Loopy Lights",
  "Platform Perils",
  "Necky's Revenge",
  "Gang-Plank Galleon",
  "Pirate Panic",
  "Mainbrace Mayhem",
  "Gangplank Galley",
  "Lockjaw's Locker",
  "Topsail Trouble",
  "Krow's Nest",
  "Hot-Head Hop",
  "Kannon's Klaim",
  "Lava Lagoon",
  "Red-Hot Ride",
  "Squawks's Shaft",
  "Kleever's Kiln",
  "Barrel Bayou",
  "Glimmer's Galleon",
  "Krockhead Klamber",
  "Rattle Battle",
  "Slime Climb",
  "Bramble Blast",
  "Kudgel's Kontest",
  "Hornet Hole",
  "Target Terror",
  "Bramble Scramble",
  "Rickety Race",
  "Mudhole Marsh",
  "Rambi Rumble",
  "King Zing Sting",
  "Ghostly Grove",
  "Haunted Hall",
  "Gusty Glade",
  "Parrot Chute Panic",
  "Web Woods",
  "Kreepy Krow",
  "Arctic Abyss",
  "Castle Crush",
  "Clapper's Cavern",
  "Windy Well",
  "Chain Link Chamber",
  "Toxic Tower",
  "Stronghold Showdown",
  "Screech's Sprint",
  "K. Rool Duel",
  "Jungle Jinx",
  "Black Ice Battle",
  "Klobber Karnage",
  "Fiery Furnace",
  "Animal Antics",
  "Krocodile Kore",
  "Lakeside Limbo",
  "Doorstop Dash",
  "Tidal Trouble",
  "Skidda's Row",
  "Murky Mill",
  "Belcha's Barn",
  "Springin' Spiders",
  "Riverside Race",
  "Squeals on Wheels",
  "Barrel Shield Bust-Up",
  "Bobbing Barrel Brawl",
  "Arich's Ambush",
  "Bazza's Blockade",
  "Rocket Barrel Ride",
  "Kreeping Klasps",
  "Tracker Barrel Trek",
  "Fish Food Frenzy",
  "Squirt's Showdown",
  "Fire-Ball Frenzy",
  "Demolition Drain-Pipe",
  "Ripsaw Rage",
  "Blazing Bazukas",
  "Low-G Labyrinth",
  "KAOS Karnage",
  "Krevice Kreepers",
  "Tearaway Toboggan",
  "Barrel Drop Bounce",
  "Krack-Shot Kroc",
  "Lemguin Lunge",
  "Bleak's House",
  "Buzzer Barrage",
  "Kong-Fused Cliffs",
  "Floodlit Fish",
  "Pot Hole Panic",
  "Ropey Rumpus",
  "Kroctopus Krush",
  "Dingy Drain-Pipe",
  "Stormy Seas",
  "Sunken Spruce",
  "Cliffside Blast",
  "Ripcurl Reef",
  "Surf's Up",
  "Barbos's Barrier",
  "Konveyor Rope Klash",
  "Creepy Caverns",
  "Lightning Looks-Out",
  "Koindozer Klamber",
  "Poisonous Pipeline",
  "Kastle KAOS",
  "Stampede Sprint",
  "Criss Kross Cliffs",
  "Tyrant Twin Tussle",
  "Swoopy Salvo",
  "Rocket Rush",
  "Knautilus"
]

// -----------------------------
// Material Requirements Per Level
// -----------------------------
export const materialList: string[][] = [
  // Kongo Jungle
  ["Jungle", "Balloons", "Banana Hoard", "Rambi"], // Jungle Hijinxs
  ["Jungle", "Ropes", "Storm"], // Ropey Rampage
  ["Caves", "Tires"], // Reptile Rumble
  ["Coral Reef", "Water", "Enguarde"], // Coral Capers
  ["Jungle", "Barrel Cannons"], // Barrel Cannon Canyon
  ["Banana Hoard", "Boss"], // Very Gnawty's Lair

  // Monkey Mines
  ["Scaffolding", "Drums", "Spawners", "Winky"], // Winky's Walkway
  ["Mines", "Carts"], // Mine Cart Carnage
  ["Caves", "Tires", "Winky"], // Bouncy Bonanza
  ["Mines", "Barrels", "Gauntlet", "Lights"], // Stop & Go Station
  ["Temple", "Millstones", "Winky"], // Millstone Mayhem
  ["Banana Hoard", "Boss", "Tires"], // Necky's Nuts

  // Vine Valley
  ["Forest", "Barrel Cannons"], // Vulture Culture
  ["Trees", "Barrel Cannons"], // Tree Top Town
  ["Forest", "Gauntlet", "Ropes"], // Forest Frenzy
  ["Jungle", "Balloons", "Barrels", "Expresso"], // Orang-Utan Gang
  ["Coral Reef", "Gauntlet", "Water", "Enguarde"], // Clam City
  ["Temple", "Chase", "Ropes", "Millstones", "Expresso"], // Temple Tempest
  ["Banana Hoard", "Barrels", "Boss"], // Bumble B. Rumble

  // Gorilla Glacier
  ["Glacier", "Barrel Cannons", "Storm"], // Snow Barrel Blast
  ["Ice Cave", "Conveyors", "Ropes"], // Sliplide Ride
  ["Coral Reef", "Chase", "Water", "Enguarde"], // Croctopus Chase
  ["Glacier", "Ropes", "Storm", "Expresso"], // Ice Age Alley
  ["Trees", "Tires", "Winky"], // Rope Bridge Rumble
  ["Caves", "Drums", "Fire", "Lights", "Mincers", "Squawks"], // Torchlight Trouble
  ["Banana Hoard", "Caves", "Boss"], // Really Gnawty Rampage

  // Kremkroc Industries Inc.
  ["Factory", "Balloons", "Drums", "Fire", "Rambi"], // Oil Drum Alley
  ["Scaffolding", "Conveyors", "Gauntlet"], // Trick Track Trek
  ["Coral Reef", "Gauntlet", "Mincers", "Poison", "Water", "Enguarde"], // Poison Pond
  ["Caves", "Conveyors", "Drums", "Ropes", "Spawners"], // Elevator Antics
  ["Factory", "Conveyors", "Lights"], // Blackout Basement
  ["Scaffolding", "Carts", "Tires"], // Mine Cart Madness
  ["Banana Hoard", "Boss", "Drums", "Spawners"], // Boss Dumb Drum

  // Chimp Caverns / Gang-Plank Galleon
  ["Scaffolding", "Conveyors", "Drums", "Tires"], // Tanked Up Trouble
  ["Caves", "Mincers", "Rambi"], // Manic Mincers
  ["Mines", "Drums", "Ropes", "Spawners", "Expresso"], // Misty Mine
  ["Mines", "Barrels", "Lights"], // Loopy Lights
  ["Scaffolding", "Barrels", "Conveyors"], // Platform Perils
  ["Banana Hoard", "Boss", "Boss", "Tires"], // Necky's Revenge
  ["Ship Deck", "Boss", "Gauntlet"], // Gang-Plank Galleon

  // Gangplank Galleon
  ["Ship Deck", "Doors", "Rambi"], // Pirate Panic
  ["Rigging", "Ropes"], // Mainbrace Mayhem
  ["Ship Deck", "Hooks"], // Gangplank Galley
  ["Ship Hold", "Water", "Enguarde"], // Lockjaw's Locker
  ["Rigging", "Hooks", "Ropes", "Storm", "Rattly"], // Topsail Trouble
  ["Rigging", "Boss"], // Krow's Nes

  // Crocodile Cauldron
  ["Volcano", "Krockheads", "Squitter"], // Hot-Head Hop
  ["Mines", "Barrel Cannons", "Barrels"], // Kannon's Klaim
  ["Ship Hold", "Fire", "Water", "Clapper", "Enguarde"], // Lava Lagoon
  ["Volcano", "Balloons", "Wind", "Rambi"], // Red-Hot Ride
  ["Mines", "Barrel Cannons", "Gauntlet", "Squawks"], // Squawks's Shaft
  ["Volcano", "Boss", "Fire", "Hooks"], // Kleever's Kiln

  // Krem Quay
  ["Swamp", "Barrel Cannons", "Barrels", "Rambi"], // Barrel Bayou
  ["Ship Hold", "Gauntlet", "Lights", "Water", "Glimmer"], // Glimmer's Galleon
  ["Swamp", "Barrels", "Krockheads", "Ropes", "Squitter"], // Krockhead Klamber
  ["Ship Deck", "Gauntlet", "Rattly"], // Rattle Battle
  ["Rigging", "Chase", "Rising Danger", "Ropes", "Water"], // Slime Climb
  ["Brambles", "Barrel Cannons", "Squawks"], // Bramble Blast
  ["Swamp", "Barrels", "Boss"], // Kudgel's Kontest

  // Krazy Kremland
  ["Beehive", "Hooks", "Squitter"], // Hornet Hole
  ["Theme Park", "Barrels", "Carts", "Doors", "Squawks"], // Target Terror
  ["Brambles", "Gauntlet", "Ropes", "Squawks", "Squitter"], // Bramble Scramble
  ["Theme Park", "Carts", "Chase"], // Rickety Race
  ["Swamp", "Gauntlet", "Hooks", "Krockheads"], // Mudhole Marsh
  ["Beehive", "Chase", "Hooks", "Rambi"], // Rambi Rumble
  ["Beehive", "Boss", "Gauntlet", "Squawks"], // King Zing Sting

  // Gloomy Gulch
  ["Forest", "Ghosts", "Ropes"], // Ghostly Grove
  ["Library", "Barrels", "Carts", "Chase", "Doors", "Ghosts"], // Haunted Hall
  ["Forest", "Wind", "Rattly"], // Gusty Glade
  ["Beehive", "Gauntlet", "Quawks", "Squawks"], // Parrot Chute Panic
  ["Forest", "Gauntlet", "Squitter"], // Web Woods
  ["Rigging", "Boss", "Gauntlet", "Ghosts", "Hooks", "Ropes", "Storm"], // Kreepy Krow

  // K. Rool's Keep
  ["Ice Cave", "Gauntlet", "Water", "Enguarde"], // Arctic Abyss
  ["Castle", "Gauntlet", "Rising Danger", "Rambi", "Squawks"], // Castle Crush
  ["Ice Cave", "Chase", "Water", "Clapper", "Enguarde"], // Clapper's Cavern
  ["Mines", "Gauntlet", "Hooks", "Wind", "Squawks"], // Windy Well
  ["Castle", "Barrel Cannons", "Gauntlet", "Hooks", "Ropes"], // Chain Link Chamber
  ["Castle", "Poison", "Rising Danger", "Rattly", "Squawks", "Squitter"], // Toxic Tower
  ["Castle", "Boss", "Fire", "Krockheads"], // Stronghold Showdown

  // The Flying Krock
  ["Brambles", "Chase", "Gauntlet", "Squawks"], // Screech's Sprint
  ["Gunship", "Boss", "Gauntlet", "Poison", "Wind"], // K. Rool Duel

  // Lost World
  ["Jungle", "Spawners", "Tires"], // Jungle Jinx
  ["Ice Cave", "Gauntlet"], // Black Ice Battle
  ["Jungle", "Barrel Cannons", "Barrels"], // Klobber Karnage
  ["Volcano", "Barrel Cannons"], // Fiery Furnace
  ["Jungle", "Ice Cave", "Brambles", "Gauntlet", "Water", "Wind", "Rambi", "Enguarde", "Squitter", "Squawks", "Rattly"], // Animal Antics
  ["Altar", "Boss", "Gauntlet", "Poison"], // Krocodile Kore

  // Lake Orangatanga
  ["Docks", "Balloons", "Water", "Ellie"], // Lakeside Limbo
  ["Barn", "Doors", "Hooks"], // Doorstop Dash
  ["Docks", "Water", "Wind", "Enguarde"], // Tidal Trouble
  ["Glacier", "Storm"], // Skidda's Row
  ["Barn", "Barrels", "Lights", "Ellie"], // Murky Mill
  ["Barn", "Barrels", "Boss", "Mincers", "Spawners"], // Belcha's Barn

  // Kremwood Forest
  ["Trees", "Conveyors", "Squawks"], // Springin' Spiders
  ["River", "Water", "Chase"], // Riverside Race
  ["Barn", "Barrels", "Doors", "Millstones", "Parry"], // Squeals on Wheels
  ["Trees", "Barrels", "Gauntlet", "Ropes"], // Barrel Shield Bust-Up
  ["River", "Barrels", "Chase", "Water", "Ellie"], // Bobbing Barrel Brawl
  ["Trees", "Barrels", "Boss", "Poison"], // Arich's Ambush

  // Cotton-Top Cove
  ["Coral Reef", "Spawners", "Water", "Enguarde"], // Bazza's Blockade
  ["Waterfall", "Barrel Cannons", "Parry"], // Rocket Barrel Ride
  ["Docks", "Chase", "Gauntlet", "Ropes", "Water"], // Kreeping Klasps
  ["Waterfall", "Barrel Cannons", "Water", "Parry"], // Tracker Barrel Trek
  ["Coral Reef", "Chase", "Water"], // Fish Food Frenzy
  ["Waterfall", "Boss", "Water", "Wind", "Ellie"], // Squirt's Showdown

  // Mekanos
  ["Factory", "Fire", "Gauntlet", "Ropes", "Squitter"], // Fire-Ball Frenzy
  ["Pipes", "Carts", "Gauntlet", "Hooks"], // Demolition Drain-Pipe
  ["Trees", "Rising Danger"], // Ripsaw Rage
  ["Factory", "Barrel Cannons", "Barrels", "Ropes", "Squitter"], // Blazing Bazukas
  ["Pipes", "Barrels", "Poison", "Quawks", "Squawks"], // Low-G Labyrinth
  ["Factory", "Boss", "Electricity", "Fire"], // KAOS Karnage

  // K3
  ["Cliffs", "Gauntlet", "Ropes"], // Krevice Kreepers
  ["Glacier", "Carts", "Storm"], // Tearaway Toboggan
  ["Waterfall", "Barrels", "Parry"], // Barrel Drop Bounce
  ["Factory", "Chase", "Fire", "Squitter"], // Krack-Shot Kroc
  ["Glacier", "Spawners", "Storm"], // Lemguin Lunge
  ["Glacier", "Boss", "Gauntlet"], // Bleak's House

  // Razor Ridge
  ["Caves", "Barrels", "Gauntlet", "Quawks"], // Buzzer Barrage
  ["Cliffs", "Barrel Cannons", "Fire", "Rising Danger", "Ropes"], // Kong-Fused Cliffs
  ["Coral Reef", "Lights", "Water", "Enguarde"], // Floodlit Fish
  ["Caves", "Gauntlet", "Water", "Squawks", "Enguarde", "Ellie", "Squitter"], // Pot Hole Panic
  ["Cliffs", "Ropes", "Parry"], // Ropey Rumpus
  ["Waterfall", "Boss", "Fire", "Water"], // Kroctopus Krush

  // Pacifica
  ["Pipes", "Gauntlet", "Water", "Enguarde"], // Dingy Drain-Pipe
  ["Docks", "Ropes", "Storm", "Water", "Enguarde"], // Stormy Seas
  ["Trees", "Spawners", "Water"], // Sunken Spruce
  ["Cliffs", "Barrel Cannons", "Ropes"], // Cliffside Blast
  ["Coral Reef", "Spawners", "Water", "Wind"], // Ripcurl Reef
  ["Pipes", "Carts", "Gauntlet", "Hooks", "Water"], // Surf's Up
  ["Coral Reef", "Boss", "Gauntlet", "Water", "Enguarde"], // Barbos's Barrier

  // KAOS Kore
  ["Jungle", "Conveyors", "Ropes"], // Konveyor Rope Klash
  ["Caves", "Barrel Cannons", "Ghosts", "Squitter"], // Creepy Caverns
  ["River", "Barrels", "Electricity", "Storm", "Water"], // Lightning Looks-Out
  ["Jungle", "Gauntlet"], // Koindozer Klamber
  ["Pipes", "Gauntlet", "Poison", "Water", "Enguarde"], // Poisonous Pipeline
  ["Castle", "Barrels", "Boss", "Boss", "Electricity", "Fire", "Hooks"], // Kastle KAOS

  // Krematoa
  ["Jungle", "Chase", "Gauntlet", "Squawks", "Squitter", "Ellie", "Parry"], // Stampede Sprint
  ["Cliffs", "Barrels", "Ropes"], // Criss Kross Cliffs
  ["Caves", "Gauntlet", "Squitter"], // Tyrant Twin Tussle
  ["Trees", "Gauntlet", "Spawners", "Squawks"], // Swoopy Salvo
  ["Cliffs", "Drums", "Fire"], // Rocket Rush
  ["Ship Hold", "Barrels", "Boss", "Conveyors", "Electricity", "Fire"] // Knautilus
];

// -----------------------------
// Material Categories
// -----------------------------
export const animalList = [
  "Clapper", "Ellie", "Enguarde", "Expresso", "Glimmer", "Parry",
  "Quawks", "Rambi", "Rattly", "Squawks", "Squitter", "Winky"
]

export const resourceList = [
  "Balloons", "Barrel Cannons", "Barrels", "Boss", "Carts", "Chase",
  "Conveyors", "Doors", "Drums", "Electricity", "Fire", "Gauntlet", "Ghosts",
  "Hooks", "Krockheads", "Lights", "Millstones", "Mincers", "Poison",
  "Rising Danger", "Ropes", "Spawners", "Storm", "Tires", "Water", "Wind"
]

export const environmentList = [
  "Altar", "Banana Hoard", "Barn", "Beehive", "Brambles", "Castle", "Caves",
  "Cliffs", "Coral Reef", "Docks", "Factory", "Forest", "Glacier",
  "Gunship", "Ice Cave", "Jungle", "Library", "Mines", "Pipes",
  "Rigging", "River", "Scaffolding", "Ship Deck", "Ship Hold",
  "Swamp", "Temple", "Theme Park", "Trees", "Volcano", "Waterfall"
]

// -----------------------------
// Difficulty & Star Values OUTDATED
// -----------------------------
export const bonusDifficulties: number[] = [
  // Kongo Jungle
  2, // Jungle Hijinxs
  3, // Ropey Rampage
  4, // Reptile Rumble
  1, // Coral Capers
  5, // Barrel Cannon Canyon
  1, // Very Gnawty's Lair

  // Monkey Mines
  2, // Winky's Walkway
  1, // Mine Cart Carnage
  4, // Bouncy Bonanza
  4, // Stop & Go Station
  5, // Millstone Mayhem
  2, // Necky's Nuts

  // Vine Valley
  4, // Vulture Culture
  3, // Tree Top Town
  5, // Forest Frenzy
  7, // Orang-Utan Gang
  1, // Clam City
  5, // Temple Tempest
  4, // Bumble B. Rumble

  // Gorilla Glacier
  6, // Snow Barrel Blast
  5, // Sliplide Ride
  1, // Croctopus Chase
  6, // Ice Age Alley
  4, // Rope Bridge Rumble
  4, // Torchlight Trouble
  2, // Really Gnawty Rampage

  // Kremkroc Industries Inc.
  7, // Oil Drum Alley
  3, // Trick Track Trek
  1, // Poison Pond
  5, // Elevator Antics
  4, // Blackout Basement
  3, // Mine Cart Madness
  2, // Boss Dumb Drum

  // Chimp Caverns / Gang-Plank Galleon
  4, // Tanked Up Trouble
  4, // Manic Mincers
  6, // Misty Mine
  4, // Loopy Lights
  3, // Platform Perils
  3, // Necky's Revenge
  5, // Gang-Plank Galleon

  // Gangplank Galleon
  3, // Pirate Panic
  4, // Mainbrace Mayhem
  3, // Gangplank Galley
  3, // Lockjaw's Locker
  3, // Topsail Trouble
  2, // Krow's Nest

  // Crocodile Cauldron
  4, // Hot-Head Hop
  5, // Kannon's Klaim
  4, // Lava Lagoon
  4, // Red-Hot Ride
  5, // Squawks's Shaft
  4, // Kleever's Kiln

  // Krem Quay
  6, // Barrel Bayou
  5, // Glimmer's Galleon
  3, // Krockhead Klamber
  5, // Rattle Battle
  4, // Slime Climb
  5, // Bramble Blast
  3, // Kudgel's Kontest

  // Krazy Kremland
  4, // Hornet Hole
  4, // Target Terror
  7, // Bramble Scramble
  4, // Rickety Race
  5, // Mudhole Marsh
  5, // Rambi Rumble
  5, // King Zing Sting

  // Gloomy Gulch
  5, // Ghostly Grove
  4, // Haunted Hall
  3, // Gusty Glade
  4, // Parrot Chute Panic
  7, // Web Woods
  4, // Kreepy Krow

  // K. Rool's Keep
  4, // Arctic Abyss
  4, // Castle Crush
  4, // Clapper's Cavern
  3, // Windy Well
  6, // Chain Link Chamber
  4, // Toxic Tower
  4, // Stronghold Showdown

  // The Flying Krock
  4, // Screech's Sprint
  6, // K. Rool Duel

  // Lost World
  5, // Jungle Jinx
  4, // Black Ice Battle
  4, // Klobber Karnage
  3, // Fiery Furnace
  4, // Animal Antics
  6, // Krocodile Kore

  // Lake Orangatanga
  3, // Lakeside Limbo
  3, // Doorstop Dash
  3, // Tidal Trouble
  2, // Skidda's Row
  4, // Murky Mill
  2, // Belcha's Barn

  // Kremwood Forest
  4, // Springin' Spiders
  5, // Riverside Race
  3, // Squeals on Wheels
  3, // Barrel Shield Bust-Up
  3, // Bobbing Barrel Brawl
  2, // Arich's Ambush

  // Cotton-Top Cove
  3, // Bazza's Blockade
  3, // Rocket Barrel Ride
  3, // Kreeping Klasps
  3, // Tracker Barrel Trek
  4, // Fish Food Frenzy
  4, // Squirt's Showdown

  // Mekanos
  4, // Fire-Ball Frenzy
  3, // Demolition Drain-Pipe
  2, // Ripsaw Rage
  5, // Blazing Bazukas
  4, // Low-G Labyrinth
  3, // KAOS Karnage

  // K3
  4, // Krevice Kreepers
  3, // Tearaway Toboggan
  5, // Barrel Drop Bounce
  4, // Krack-Shot Kroc
  2, // Lemguin Lunge
  4, // Bleak's House

  // Razor Ridge
  4, // Buzzer Barrage
  3, // Kong-Fused Cliffs
  4, // Floodlit Fish
  4, // Pot Hole Panic
  5, // Ropey Rumpus
  3, // Kroctopus Krush

  // Pacifica
  4, // Dingy Drain-Pipe
  4, // Stormy Seas
  5, // Sunken Spruce
  3, // Cliffside Blast
  4, // Ripcurl Reef
  3, // Surf's Up
  4, // Barbos's Barrier

  // KAOS Kore
  4, // Konveyor Rope Klash
  4, // Creepy Caverns
  3, // Lightning Looks-Out
  4, // Koindozer Klamber
  3, // Poisonous Pipeline
  6, // Kastle KAOS

  // Krematoa
  4, // Stampede Sprint
  3, // Criss Kross Cliffs
  5, // Tyrant Twin Tussle
  5, // Swoopy Salvo
  2, // Rocket Rush
  6  // Knautilus
]

export const starValue: number[] = [
  // Kongo Jungle
  2, // Jungle Hijinxs
  1, // Ropey Rampage
  1, // Reptile Rumble
  2, // Coral Capers
  1, // Barrel Cannon Canyon
  1, // Very Gnawty's Lair

  // Monkey Mines
  4, // Winky's Walkway
  2, // Mine Cart Carnage
  3, // Bouncy Bonanza
  3, // Stop & Go Station
  3, // Millstone Mayhem
  1, // Necky's Nuts

  // Vine Valley
  1, // Vulture Culture
  1, // Tree Top Town
  2, // Forest Frenzy
  2, // Orang-Utan Gang
  3, // Clam City
  4, // Temple Tempest
  1, // Bumble B. Rumble

  // Gorilla Glacier
  3, // Snow Barrel Blast
  3, // Sliplide Ride
  4, // Croctopus Chase
  4, // Ice Age Alley
  3, // Rope Bridge Rumble
  5, // Torchlight Trouble
  1, // Really Gnawty Rampage

  // Kremkroc Industries Inc.
  5, // Oil Drum Alley
  2, // Trick Track Trek
  5, // Poison Pond
  5, // Elevator Antics
  3, // Blackout Basement
  3, // Mine Cart Madness
  2, // Boss Dumb Drum

  // Chimp Caverns / Gang-Plank Galleon
  4, // Tanked Up Trouble
  3, // Manic Mincers
  5, // Misty Mine
  2, // Loopy Lights
  4, // Platform Perils
  4, // Necky's Revenge
  1, // Gang-Plank Galleon

  // Gangplank Galleon
  4, // Pirate Panic
  1, // Mainbrace Mayhem
  2, // Gangplank Galley
  1, // Lockjaw's Locker
  5, // Topsail Trouble
  1, // Krow's Nest

  // Crocodile Cauldron
  1, // Hot-Head Hop
  2, // Kannon's Klaim
  5, // Lava Lagoon
  4, // Red-Hot Ride
  3, // Squawks's Shaft
  3, // Kleever's Kiln

  // Krem Quay
  4, // Barrel Bayou
  5, // Glimmer's Galleon
  5, // Krockhead Klamber
  2, // Rattle Battle
  5, // Slime Climb
  1, // Bramble Blast
  2, // Kudgel's Kontest

  // Krazy Kremland
  3, // Hornet Hole
  4, // Target Terror
  4, // Bramble Scramble
  3, // Rickety Race
  4, // Mudhole Marsh
  3, // Rambi Rumble
  3, // King Zing Sting

  // Gloomy Gulch
  2, // Ghostly Grove
  5, // Haunted Hall
  2, // Gusty Glade
  3, // Parrot Chute Panic
  2, // Web Woods
  5, // Kreepy Krow

  // K. Rool's Keep
  2, // Arctic Abyss
  4, // Castle Crush
  5, // Clapper's Cavern
  4, // Windy Well
  4, // Chain Link Chamber
  5, // Toxic Tower
  5, // Stronghold Showdown

  // The Flying Krock
  4, // Screech's Sprint
  5, // K. Rool Duel

  // Lost World
  4, // Jungle Jinx
  2, // Black Ice Battle
  3, // Klobber Karnage
  2, // Fiery Furnace
  5, // Animal Antics
  4, // Krocodile Kore

  // Lake Orangatanga
  2, // Lakeside Limbo
  1, // Doorstop Dash
  3, // Tidal Trouble
  2, // Skidda's Row
  3, // Murky Mill
  4, // Belcha's Barn

  // Kremwood Forest
  1, // Springin' Spiders
  2, // Riverside Race
  4, // Squeals on Wheels
  5, // Barrel Shield Bust-Up
  2, // Bobbing Barrel Brawl
  2, // Arich's Ambush

  // Cotton-Top Cove
  2, // Bazza's Blockade
  2, // Rocket Barrel Ride
  4, // Kreeping Klasps
  2, // Tracker Barrel Trek
  1, // Fish Food Frenzy
  5, // Squirt's Showdown

  // Mekanos
  3, // Fire-Ball Frenzy
  3, // Demolition Drain-Pipe
  1, // Ripsaw Rage
  4, // Blazing Bazukas
  3, // Low-G Labyrinth
  3, // KAOS Karnage

  // K3
  3, // Krevice Kreepers
  3, // Tearaway Toboggan
  1, // Barrel Drop Bounce
  4, // Krack-Shot Kroc
  3, // Lemguin Lunge
  2, // Bleak's House

  // Razor Ridge
  4, // Buzzer Barrage
  5, // Kong-Fused Cliffs
  3, // Floodlit Fish
  5, // Pot Hole Panic
  2, // Ropey Rumpus
  4, // Kroctopus Krush

  // Pacifica
  3, // Dingy Drain-Pipe
  5, // Stormy Seas
  3, // Sunken Spruce
  3, // Cliffside Blast
  3, // Ripcurl Reef
  3, // Surf's Up
  4, // Barbos's Barrier

  // KAOS Kore
  2, // Konveyor Rope Klash
  4, // Creepy Caverns
  5, // Lightning Looks-Out
  1, // Koindozer Klamber
  3, // Poisonous Pipeline
  5, // Kastle KAOS

  // Krematoa
  5, // Stampede Sprint
  3, // Criss Kross Cliffs
  2, // Tyrant Twin Tussle
  4, // Swoopy Salvo
  4, // Rocket Rush
  5  // Knautilus
];

// -----------------------------
// Level IDs
// -----------------------------
export const totalLevels = Array.from({ length: 142 }, (_, i) => i + 1)



// GAME → WORLD → LEVEL INDEX
export const LEVEL_CODE = {
  1: { // Game 1
    1: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 },                     // Kongo Jungle
    2: { 1: 7, 2: 8, 3: 9, 4: 10, 5: 11, 6: 12 },                  // Monkey Mines
    3: { 1: 13, 2: 14, 3: 15, 4: 16, 5: 17, 6: 18, 7: 19 },        // Vine Valley

    4: { 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26 },        // Gorilla Glacier
    5: { 1: 27, 2: 28, 3: 29, 4: 30, 5: 31, 6: 32, 7: 33 },        // Kremkroc
    6: { 1: 34, 2: 35, 3: 36, 4: 37, 5: 38, 6: 39 },               // Chimp Caverns
    7: { 1: 40 }                                                   // Gangplank Galleon
  },

  2: { // Game 2
    1: { 1: 41, 2: 42, 3: 43, 4: 44, 5: 45, 6: 46 },               // Gangplank Galleon
    2: { 1: 47, 2: 48, 3: 49, 4: 50, 5: 51, 6: 52 },               // Crocodile Cauldron
    3: { 1: 53, 2: 54, 3: 55, 4: 56, 5: 57, 6: 58, 7: 59 },        // Krem Quay
    4: { 1: 60, 2: 61, 3: 62, 4: 63, 5: 64, 6: 65, 7: 66 },        // Krazy Kremland
    5: { 1: 67, 2: 68, 3: 69, 4: 70, 5: 71, 6: 72 },               // Gloomy Gulch
    6: { 1: 73, 2: 74, 3: 75, 4: 76, 5: 77, 6: 78, 7: 79 },        // K. Rool's Keep
    7: { 1: 80, 2: 81 },                                           // Flying Krock
    8: { 1: 82, 2: 83, 3: 84, 4: 85, 5: 86, 6: 87 }, // Lost World
  },

  3: { // Game 3

    1: { 1: 88, 2: 89, 3: 90, 4: 91, 5: 92, 6: 93 },               // Lake Orangatanga
    2: { 1: 94, 2: 95, 3: 96, 4: 97, 5: 98, 6: 99 },               // Kremwood Forest
    3: { 1: 100, 2: 101, 3: 102, 4: 103, 5: 104, 6: 105 },         // Cotton Top Cove
    4: { 1: 106, 2: 107, 3: 108, 4: 109, 5: 110, 6: 111 },         // Mekanos
    5: { 1: 112, 2: 113, 3: 114, 4: 115, 5: 116, 6: 117 },         // K3
    6: { 1: 118, 2: 119, 3: 120, 4: 121, 5: 122, 6: 123 },         // Razor Ridge
    7: { 1: 124, 2: 125, 3: 126, 4: 127, 5: 128, 6: 129, 7: 130 }, // Pacifica
    8: { 1: 131, 2: 132, 3: 133, 4: 134, 5: 135, 6: 136 },         // KAOS Kore
    9: { 1: 137, 2: 138, 3: 139, 4: 140, 5: 141, 6: 142 }          // Krematoa
  }
}

export function getLevelCode(levelId: number) {
  const code = LEVEL_CODE as Record<string, Record<string, Record<string, number>>>
  for (const game in code) {
    for (const world in code[game]) {
      for (const num in code[game][world]) {
        if (code[game][world][num] === levelId) {
          return `${game}-${world}-${num}`
        }
      }
    }
  }
  return '?-?-?'
}

export const SPACE_COORDINATES = [
  [1361, 145],  // 1
  [2592, 954],  // 2
  [1376, 1711], // 3
  [100, 952],   // 4
  [1372, 1314], // 5
  [1362, 309],  // 6
  // Kongo Jungle
  [1490, 144],  // 7
  [1565, 144],  // 8
  [1640, 144],  // 9
  [1712, 144],  // 10
  [1791, 144],  // 11
  [1864, 144],  // 12
  [1937, 141],  // 13
  [2014, 126],  // 14
  [2085, 119],  // 15
  [2155, 137],  // 16
  [2227, 157],  // 17
  [2305, 161],  // 18
  [2372, 151],  // 19
  [2444, 138],  // 20
  [2516, 138],  // 21
  [2573, 182],  // 22
  [2577, 248],  // 23
  // Monkey Mines
  [1893, 221],  // 24
  [1941, 287],  // 25
  [1997, 351],  // 26
  [2051, 408],  // 27
  [2109, 367],  // 28
  [2163, 317],  // 29
  [2236, 292],  // 30
  [2320, 284],  // 31
  [2327, 343],  // 32
  [2336, 405],  // 33
  [2346, 473],  // 34
  [2271, 482],  // 35
  [2203, 498],  // 36
  [2158, 552],  // 37
  [2120, 609],  // 38
  [2083, 670],  // 39
  [2038, 731],  // 40
  // Vine Valley
  [2544, 307],  // 41
  [2494, 364],  // 42
  [2535, 414],  // 43
  [2572, 466],  // 44
  [2532, 521],  // 45
  [2490, 580],  // 46
  [2528, 641],  // 47
  [2573, 700],  // 48
  [2531, 753],  // 49
  [2486, 803],  // 50
  [2434, 856],  // 51
  [2411, 921],  // 52
  [2438, 999],  // 53
  [2485, 1053], // 54
  [2544, 1094], // 55
  [2600, 1139], // 56
  [2560, 1194], // 57
  [2524, 1251], // 58
  [2489, 1312], // 59
  [2456, 1394], // 60
  // Gorilla Glacier
  [2502, 1502], // 61
  [2555, 1573], // 62
  [2557, 1658], // 63
  [2530, 1736], // 64
  [2472, 1685], // 65
  [2408, 1630], // 66
  [2383, 1711], // 67
  [2359, 1790], // 68
  [2300, 1736], // 69
  [2237, 1687], // 70
  [2114, 1581], // 71
  [2056, 1525], // 72
  [2033, 1607], // 73
  [1970, 1555], // 74
  [1910, 1503], // 75
  [1889, 1580], // 76
  [1831, 1527], // 77
  [1769, 1477], // 78
  [1737, 1552], // 79
  [1708, 1633], // 80
  // Kremkroc Industries Inc.
  [1184, 827],  // 81
  [1111, 825],  // 82
  [1045, 827],  // 83
  [980, 815],   // 84
  [925, 769],   // 85
  [874, 826],   // 86
  [823, 893],   // 87
  [754, 898],   // 88
  [675, 903],   // 89
  [675, 823],   // 90
  [675, 750],   // 91
  [675, 673],   // 92
  [599, 696],   // 93
  [539, 741],   // 94
  [498, 688],   // 95
  [425, 728],   // 96
  [361, 764],   // 97
  [383, 832],   // 98
  [399, 903],   // 99
  [326, 922],   // 100
  // Chimp Caverns
  [1307, 898],  // 101
  [1365, 861],  // 102
  [1375, 794],  // 103
  [1332, 738],  // 104
  [1291, 682],  // 105
  [1303, 623],  // 106
  [1355, 584],  // 107
  [1347, 525],  // 108
  [1278, 530],  // 109
  [1209, 546],  // 110
  [1152, 490],  // 111
  [1087, 463],  // 112
  [1036, 511],  // 113
  [987, 553],   // 114
  [976, 610],   // 115
  [1018, 655],  // 116
  [1087, 639],  // 117
  [1151, 644],  // 118
  [1191, 687],  // 119
  [1185, 750],  // 120
  // Gangplank Galleon
  [1691, 245],  // 121
  [1741, 300],  // 122
  [1793, 353],  // 123
  [1842, 415],  // 124
  [1898, 462],  // 125
  [1938, 509],  // 126
  [1985, 558],  // 127
  [2035, 600],  // 128
  [2201, 622],  // 129
  [2279, 629],  // 130
  [2344, 656],  // 131
  [2321, 727],  // 132
  [2246, 748],  // 133
  [2185, 789],  // 134
  [2184, 858],  // 135
  [2246, 887],  // 136
  [2321, 898],  // 137
  // Crocodile Cauldron
  [1891, 703],  // 138
  [1939, 745],  // 139
  [1994, 795],  // 140
  [2048, 874],  // 141
  [2066, 919],  // 142
  [2119, 973],  // 143
  [2141, 1047], // 144
  [2140, 1118], // 145
  [2067, 1127], // 146
  [1995, 1119], // 147
  [1924, 1092], // 148
  [1844, 1119], // 149
  [1773, 1269], // 150
  [1809, 1350], // 151
  [1890, 1350], // 152
  [1973, 1372], // 153
  [2060, 1372], // 154
  [2088, 1446], // 155
  // Krem Quay
  [2406, 1485], // 156
  [2336, 1509], // 157
  [2308, 1452], // 158
  [2244, 1448], // 159
  [2212, 1523], // 160
  [2188, 1606], // 161
  [2162, 1684], // 162
  [2130, 1768], // 163
  [2045, 1797], // 164
  [1996, 1724], // 165
  [1911, 1718], // 166
  [1856, 1769], // 167
  [1770, 1771], // 168
  [1688, 1741], // 169
  [1624, 1663], // 170
  [1546, 1599], // 171
  [1466, 1583], // 172
  [1391, 1582], // 173
  [1319, 1582], // 174
  [1247, 1580], // 175
  // Krazy Kremland
  [1381, 1038], // 176
  [1393, 1097], // 177
  [1367, 1151], // 178
  [1306, 1144], // 179
  [1200, 1033], // 180
  [1147, 1037], // 181
  [1097, 1084], // 182
  [1051, 1128], // 183
  [1005, 1175], // 184
  [959, 1217],  // 185
  [911, 1265],  // 186
  [864, 1308],  // 187
  [815, 1352],  // 188
  [768, 1397],  // 189
  [723, 1445],  // 190
  [677, 1492],  // 191
  [625, 1539],  // 192
  [575, 1580],  // 193
  [520, 1614],  // 194
  [455, 1638],  // 195
  // Gloomy Gulch
  [1216, 1667], // 196
  [1148, 1675], // 197
  [1172, 1742], // 198
  [1202, 1811], // 199
  [1130, 1812], // 200
  [1059, 1806], // 201
  [985, 1808],  // 202
  [906, 1809],  // 203
  [846, 1770],  // 204
  [845, 1690],  // 205
  [780, 1692],  // 206
  [753, 1781],  // 207
  [681, 1814],  // 208
  [600, 1814],  // 209
  [517, 1814],  // 210
  [442, 1814],  // 211
  [447, 1740],  // 212
  // K. Rool's Keep
  [1168, 1587], // 213
  [1107, 1587], // 214
  [1045, 1590], // 215
  [1030, 1667], // 216
  [961, 1660],  // 217
  [961, 1581],  // 218
  [981, 1500],  // 219
  [919, 1491],  // 220
  [849, 1514],  // 221
  [789, 1567],  // 222
  [715, 1605],  // 223
  [638, 1626],  // 224
  [588, 1457],  // 225
  [604, 1393],  // 226
  [671, 1333],  // 227
  [614, 1273],  // 228
  [541, 1330],  // 229
  [472, 1287],  // 230
  [516, 1239],  // 231
  [561, 1187],  // 232
  // The Flying Krock
  [891, 148],   // 233
  [987, 149],   // 234
  [1064, 143],  // 235
  [1149, 145],  // 236
  [1226, 145],  // 237
  // Lost World
  [388, 1689],  // 238
  [305, 1689],  // 239
  [268, 1746],  // 240
  [268, 1818],  // 241
  [191, 1824],  // 242
  [116, 1817],  // 243
  [116, 1746],  // 244
  [116, 1677],  // 245
  [116, 1600],  // 246
  [116, 1520],  // 247
  [189, 1530],  // 248
  [251, 1565],  // 249
  [327, 1522],  // 250
  [399, 1541],  // 251
  [461, 1512],  // 252
  [449, 1430],  // 253
  [384, 1397],  // 254
  [1592, 243],  // 255
  [1551, 293],  // 256
  [1574, 354],  // 257
  [1610, 411],  // 258
  [1653, 459],  // 259
  [1692, 519],  // 260
  [1730, 582],  // 261
  [1670, 619],  // 262
  [1629, 569],  // 263
  [1571, 538],  // 264
  [1499, 539],  // 265
  [1499, 609],  // 266
  [1499, 681],  // 267
  [1499, 747],  // 268
  [1499, 817],  // 269
  [1499, 887],  // 270
  [1497, 957],  // 271
  // Kremwood Forest
  [1829, 495],  // 272
  [1831, 568],  // 273
  [1833, 651],  // 274
  [1785, 716],  // 275
  [1765, 778],  // 276
  [1823, 821],  // 277
  [1883, 859],  // 278
  [1911, 917],  // 279
  [1887, 981],  // 280
  [1828, 997],  // 281
  [1770, 966],  // 282
  [1740, 910],  // 283
  [1707, 848],  // 284
  [1654, 819],  // 285
  [1601, 845],  // 286
  [1614, 904],  // 287
  [1639, 964],  // 288
  // Cotton-Top Cove
  [1497, 1052], // 289
  [1514, 1138], // 290
  [1559, 1202], // 291
  [1559, 1273], // 292
  [1532, 1335], // 293
  [1500, 1394], // 294
  [1464, 1453], // 295
  [1390, 1453], // 296
  [1314, 1454], // 297
  [1264, 1398], // 298
  [1229, 1334], // 299
  [1190, 1271], // 300
  [1188, 1202], // 301
  [1225, 1137], // 302
  [1259, 1066], // 303
  [1294, 1005], // 304
  [1351, 964],  // 305
  // Mekanos
  [761, 672],   // 306
  [814, 619],   // 307
  [866, 577],   // 308
  [876, 500],   // 309
  [805, 500],   // 310
  [730, 500],   // 311
  [678, 535],   // 312
  [606, 547],   // 313
  [607, 470],   // 314
  [605, 396],   // 315
  [691, 396],   // 316
  [778, 396],   // 317
  [861, 375],   // 318
  [925, 318],   // 319
  [1007, 317],  // 320
  [1069, 276],  // 321
  [1130, 218],  // 322
  // K3
  [2381, 1335], // 323
  [2361, 1254], // 324
  [2350, 1177], // 325
  [2338, 1100], // 326
  [2276, 1095], // 327
  [2251, 1171], // 328
  [2226, 1255], // 329
  [2160, 1253], // 330
  [2094, 1250], // 331
  [2022, 1245], // 332
  [1958, 1240], // 333
  [1887, 1233], // 334
  [1831, 1199], // 335
  [1766, 1170], // 336
  [1710, 1132], // 337
  [1670, 1068], // 338
  [1596, 1031], // 339
  // Razor Ridge
  [1210, 1502], // 340
  [1156, 1447], // 341
  [1105, 1399], // 342
  [1049, 1344], // 343
  [987, 1299],  // 344
  [838, 1230],  // 345
  [767, 1204],  // 346
  [689, 1174],  // 347
  [622, 1136],  // 348
  [680, 1081],  // 349
  [750, 1050],  // 350
  [829, 1005],  // 351
  [896, 1007],  // 352
  [967, 983],   // 353
  [1037, 960],  // 354
  [1107, 936],  // 355
  [1172, 903],  // 356
  // Pacifica
  [558, 1078],  // 357
  [498, 1017],  // 358
  [422, 1013],  // 359
  [370, 1081],  // 360
  [372, 1156],  // 361
  [371, 1235],  // 362
  [346, 1312],  // 363
  [295, 1381],  // 364
  [209, 1382],  // 365
  [144, 1345],  // 366
  [116, 1270],  // 367
  [145, 1194],  // 368
  [195, 1135],  // 369
  [238, 1076],  // 370
  [251, 1005],  // 371
  [247, 932],   // 372
  [236, 863],   // 373
  [207, 794],   // 374
  [173, 716],   // 375
  [163, 635],   // 376
  // KAOS Kore
  [246, 611],   // 377
  [314, 619],   // 378
  [372, 592],   // 379
  [392, 525],   // 380
  [471, 512],   // 381
  [477, 446],   // 382
  [408, 441],   // 383
  [339, 415],   // 384
  [330, 346],   // 385
  [383, 307],   // 386
  [389, 238],   // 387
  [441, 191],   // 388
  [508, 189],   // 389
  [559, 239],   // 390
  [627, 223],   // 391
  [695, 230],   // 392
  [760, 256],   // 393
  [815, 212],   // 394
  [156, 550],   // 395
  [178, 475],   // 396
  [196, 404],   // 397
  [213, 340],   // 398
  [228, 271],   // 399
  [161, 254],   // 400
  [105, 212],   // 401
  [114, 147],   // 402
  [176, 120],   // 403
  [238, 150],   // 404
  [304, 152],   // 405
  [369, 120],   // 406
  [438, 93],    // 407
  [509, 92],    // 408
  [594, 108],   // 409
  [662, 106],   // 410
  [736, 110],   // 411
  [805, 113],   // 412
]

export const FULL_SPACE_GUIDE: string[][] = [
  ["Candy's Save Point"],           // 1
  ["King K. Rool"],                 // 2
  ["Kaptain K. Rool"],              // 3
  ["Baron K. Roolenstein"],         // 4
  ["Queen Banana Bird"],            // 5
  ["306% COMPLETE"],                // 6
  ["M", "Banana Hoard", "Rambi", "Water"],          // 7
  ["M", "Caves", "Barrel Cannons", "Storm"],        // 8
  ["DKC Bonus"],                    // 9
  ["Wrinkly's Kong Kollege"],       // 10
  ["M", "Coral Reef", "Enguarde", "Tires"],         // 11
  ["ANY Bonus"],                    // 12
  ["Swanky's Bonus Bonanza"],       // 13
  ["Camera Piece"],                 // 14
  ["M", "Jungle", "Banana Hoard", "Ropes"],         // 15
  ["DKC Bonus"],                    // 16
  ["Camera Piece"],                 // 17
  ["Cranky's Cabin"],               // 18
  ["M", "Jungle", "Balloons", "Boss"],              // 19
  ["Crystal Coconut"],              // 20
  ["Bazaar's General Store"],       // 21
  ["Camera Piece"],                 // 22
  ["Funky's Flights"],              // 23
  ["M", "Caves", "Carts", "Drums"],                 // 24
  ["M", "Mines", "Scaffolding", "Tires"],           // 25
  ["Camera Piece"],                 // 26
  ["DKC Bonus"],                    // 27
  ["Swanky's Bonus Bonanza"],       // 28
  ["Wrinkly's Kong Kollege"],       // 29
  ["Camera Piece"],                 // 30
  ["M", "Barrels", "Gauntlet", "Millstones"],       // 31
  ["M", "Mines", "Boss", "Winky"],                  // 32
  ["Funky's Flights"],              // 33
  ["Candy's Save Point"],           // 34
  ["M", "Temple", "Lights", "Tires"],               // 35
  ["DKC Bonus"],                    // 36
  ["Camera Piece"],                 // 37
  ["Cranky's Cabin"],               // 38
  ["DKC Bonus"],                    // 39
  ["M", "Banana Hoard", "Spawners", "Winky"],       // 40
  ["M", "Barrel Cannons", "Expresso", "Ropes"],     // 41
  ["Lose a Life"],                  // 42
  ["Wrinkly's Kong Kollege"],       // 43
  ["DKC Bonus"],                    // 44
  ["M", "Jungle", "Expresso", "Gauntlet"],          // 45
  ["M", "Barrel Cannons", "Enguarde", "Gauntlet"],  // 46
  ["Camera Piece"],                 // 47
  ["M", "Ropes", "Boss", "Water"],                  // 48
  ["M", "Chase", "Balloons", "Banana Hoard"],       // 49
  ["Funky's Flights"],              // 50
  ["Cranky's Cabin"],               // 51
  ["DKC Bonus"],                    // 52
  ["M", "Forest", "Millstones", "Barrels"],         // 53
  ["Camera Piece"],                 // 54
  ["Candy's Save Point"],           // 55
  ["DKC Bonus"],                    // 56
  ["M", "Temple", "Trees", "Enguarde"],             // 57
  ["Camera Piece"],                 // 58
  ["M", "Forest", "Barrels", "Coral Reef"],         // 59
  ["Bramble's Bungalow"],           // 60
  ["DKC Bonus"],                    // 61
  ["M", "Caves", "Ropes", "Storm"],                 // 62
  ["Camera Piece"],                 // 63
  ["M", "Banana Hoard", "Mincers", "Water"],        // 64
  ["M", "Coral Reef", "Barrel Cannons", "Winky"],   // 65
  ["Wrinkly's Kong Kollege"],       // 66
  ["Camera Piece"],                 // 67
  ["Candy's Save Point"],           // 68
  ["Blizzard's Basecamp"],          // 69
  ["M", "Enguarde", "Conveyors", "Boss"],           // 70
  ["Lose a Life"],                  // 71
  ["M", "Glacier", "Squawks", "Winky"],             // 72
  ["Camera Piece"],                 // 73
  ["M", "Ice Cave", "Lights", "Ropes"],             // 74
  ["M", "Expresso", "Caves", "Fire"],               // 75
  ["ANY Bonus"],                    // 76
  ["Cranky's Cabin"],               // 77
  ["DKC Bonus"],                    // 78
  ["M", "Trees", "Glacier", "Storm"],               // 79
  ["M", "Glacier", "Drums", "Tires"],               // 80
  ["DKC Bonus"],                    // 81
  ["Funky's Flights"],              // 82
  ["M", "Drums", "Scaffolding", "Ropes"],           // 83
  ["Camera Piece"],                 // 84
  ["M", "Factory", "Conveyors", "Caves"],           // 85
  ["DKC Bonus"],                    // 86
  ["M", "Carts", "Rambi", "Factory"],               // 87
  ["M", "Balloons", "Conveyors", "Gauntlet"],       // 88
  ["Wrinkly's Kong Kollege"],       // 89
  ["M", "Tires", "Drums", "Lights"],                // 90
  ["M", "Spawners", "Fire", "Conveyors"],           // 91
  ["Lose a Life"],                  // 92
  ["M", "Gauntlet", "Mincers", "Boss"],             // 93
  ["M", "Poison", "Scaffolding", "Enguarde"],       // 94
  ["Crystal Coconut"],              // 95
  ["M", "Gauntlet", "Spawners", "Coral Reef"],      // 96
  ["M", "Water", "Banana Hoard", "Drums"],          // 97
  ["Cranky's Cabin"],               // 98
  ["Camera Piece"],                 // 99
  ["ANY Bonus"],                    // 100
  ["M", "Caves", "Boss", "Drums"],                  // 101
  ["M", "Conveyors", "Mines", "Rambi"],             // 102
  ["DKC Bonus"],                    // 103
  ["Crystal Coconut"],              // 104
  ["M", "Banana Hoard", "Gauntlet", "Lights"],      // 105
  ["M", "Tires", "Expresso", "Conveyors"],          // 106
  ["Camera Piece"],                 // 107
  ["Cranky's Cabin"],               // 108
  ["DKC Bonus"],                    // 109
  ["M", "Boss", "Spawners", "Scaffolding"],         // 110
  ["Candy's Save Point"],           // 111
  ["M", "Barrels", "Mincers", "Drums"],             // 112
  ["Camera Piece"],                 // 113
  ["DKC Bonus"],                    // 114
  ["M", "Mines", "Barrels", "Tires"],               // 115
  ["Wrinkly's Kong Kollege"],       // 116
  ["Blunder's Booth"],              // 117
  ["M", "Scaffolding", "Ropes", "Ship Deck"],       // 118
  ["Swanky's Bonus Bonanza"],       // 119
  ["Camera Piece"],                 // 120
  ["M", "Ship Deck", "Enguarde", "Storm"],          // 121
  ["M", "Doors", "Rigging", "Hooks"],               // 122
  ["DKC2 Bonus"],                   // 123
  ["Golden Feather"],               // 124
  ["M", "Boss", "Ropes", "Rattly"],                 // 125
  ["M", "Ship Deck", "Rigging", "Water"],           // 126
  ["DKC2 Bonus"],                   // 127
  ["Golden Feather"],               // 128
  ["Wrinkly's Kong Kollege"],       // 129
  ["M", "Ship Hold", "Hooks", "Ropes"],             // 130
  ["Funky's Flights"],              // 131
  ["Crystal Coconut"],              // 132
  ["M", "Water", "Rigging", "Rambi"],               // 133
  ["Cranky's Cabin"],               // 134
  ["ANY Bonus"],                    // 135
  ["Lose a Life"],                  // 136
  ["Golden Feather"],               // 137
  ["M", "Wind", "Volcano", "Water"],                // 138
  ["DKC2 Bonus"],                   // 139
  ["M", "Mines", "Krockheads", "Enguarde"],         // 140
  ["Golden Feather"],               // 141
  ["M", "Ship Hold", "Barrel Cannons", "Fire"],     // 142
  ["M", "Boss", "Balloons", "Gauntlet"],            // 143
  ["Swanky's Bonus Bonanza"],       // 144
  ["M", "Squawks", "Volcano", "Mines"],             // 145
  ["Lose a Life"],                  // 146
  ["M", "Barrel Cannons", "Gauntlet", "Rambi"],     // 147
  ["ANY Bonus"],                    // 148
  ["Golden Feather"],               // 149
  ["M", "Fire", "Squitter", "Hooks"],               // 150
  ["Cranky's Cabin"],               // 151
  ["DKC2 Bonus"],                   // 152
  ["M", "Squawks", "Gauntlet", "Fire"],             // 153
  ["Candy's Save Point"],           // 154
  ["M", "Volcano", "Barrels", "Clapper"],           // 155
  ["ANY Bonus"],                    // 156
  ["Golden Feather"],               // 157
  ["M", "Barrels", "Glimmer", "Barrel Cannons"],    // 158
  ["Swanky's Bonus Bonanza"],       // 159
  ["M", "Water", "Gauntlet", "Swamp"],              // 160
  ["M", "Boss", "Brambles", "Water"],               // 161
  ["Cranky's Cabin"],               // 162
  ["Golden Feather"],               // 163
  ["DKC2 Bonus"],                   // 164
  ["M", "Ship Deck", "Barrels", "Gauntlet"],        // 165
  ["M", "Swamp", "Barrel Cannons", "Ropes"],        // 166
  ["Lose a Life"],                  // 167
  ["Golden Feather"],               // 168
  ["M", "Ship Hold", "Chase", "Rambi"],             // 169
  ["Wrinkly's Kong Kollege"],       // 170
  ["M", "Lights", "Krockheads", "Rigging"],         // 171
  ["Funky's Flights"],              // 172
  ["M", "Swamp", "Ropes", "Rattly"],                // 173
  ["M", "Rising Danger", "Squawks", "Squitter"],    // 174
  ["DKC2 Bonus"],                   // 175
  ["Golden Feather"],               // 176
  ["M", "Squitter", "Gauntlet", "Theme Park"],      // 177
  ["Wrinkly's Kong Kollege"],       // 178
  ["M", "Doors", "Hooks", "Beehive"],               // 179
  ["M", "Chase", "Beehive", "Ropes"],               // 180
  ["Golden Feather"],               // 181
  ["M", "Carts", "Brambles", "Hooks"],              // 182
  ["DKC2 Bonus"],                   // 183
  ["Candy's Save Point"],           // 184
  ["M", "Chase", "Squawks", "Rambi"],               // 185
  ["Swanky's Bonus Bonanza"],       // 186
  ["M", "Barrels", "Krockheads", "Squitter"],       // 187
  ["M", "Swamp", "Squawks", "Gauntlet"],            // 188
  ["Cranky's Cabin"],               // 189
  ["Golden Feather"],               // 190
  ["ANY Bonus"],                    // 191
  ["M", "Boss", "Hooks", "Theme Park"],             // 192
  ["M", "Carts", "Squawks", "Beehive"],             // 193
  ["DKC2 Bonus"],                   // 194
  ["Funky's Flights"],              // 195
  ["M", "Forest", "Gauntlet", "Chase"],             // 196
  ["M", "Ghosts", "Rigging", "Squitter"],           // 197
  ["M", "Library", "Ropes", "Boss"],                // 198
  ["Candy's Save Point"],           // 199
  ["Golden Feather"],               // 200
  ["DKC2 Bonus"],                   // 201
  ["M", "Carts", "Ghosts", "Rattly"],               // 202
  ["M", "Forest", "Doors", "Squawks"],              // 203
  ["Wrinkly's Kong Kollege"],       // 204
  ["Crystal Coconut"],              // 205
  ["DKC2 Bonus"],                   // 206
  ["Funky's Flights"],              // 207
  ["Cranky's Cabin"],               // 208
  ["M", "Beehive", "Ghosts", "Wind"],               // 209
  ["M", "Quawks", "Ropes", "Hooks"],                // 210
  ["Golden Feather"],               // 211
  ["M", "Forest", "Barrels", "Storm"],              // 212
  ["M", "Castle", "Water", "Clapper"],              // 213
  ["M", "Mines", "Hooks", "Rising Danger"],         // 214
  ["M", "Fire", "Castle", "Squitter"],              // 215
  ["DKC2 Bonus"],                   // 216
  ["Benny's Chairlift"],            // 217
  ["Wrinkly's Kong Kollege"],       // 218
  ["Golden Feather"],               // 219
  ["M", "Ice Cave", "Squawks", "Boss"],             // 220
  ["DKC2 Bonus"],                   // 221
  ["M", "Poison", "Gauntlet", "Chase"],             // 222
  ["Cranky's Cabin"],               // 223
  ["M", "Water", "Barrel Cannons", "Gauntlet"],     // 224
  ["Swanky's Bonus Bonanza"],       // 225
  ["M", "Rising Danger", "Enguarde", "Rambi"],      // 226
  ["M", "Gauntlet", "Hooks", "Enguarde"],           // 227
  ["M", "Castle", "Ice Cave", "Wind"],              // 228
  ["Golden Feather"],               // 229
  ["M", "Castle", "Squawks", "Ropes"],              // 230
  ["M", "Gauntlet", "Krockheads", "Rattly"],        // 231
  ["Funky's Flights"],              // 232
  ["ANY Bonus"],                    // 233
  ["M", "Gauntlet", "Poison", "Squawks"],           // 234
  ["M", "Brambles", "Boss", "Gunship"],             // 235
  ["DKC2 Bonus"],                   // 236
  ["M", "Chase", "Wind", "Boss"],                   // 237
  ["ANY Bonus"],                    // 238
  ["M", "Jungle", "Boss", "Wind"],                  // 239
  ["M", "Barrel Cannons", "Gauntlet", "Squitter"],  // 240
  ["Golden Feather"],               // 241
  ["M", "Brambles", "Gauntlet", "Spawners"],        // 242
  ["Cranky's Cabin"],               // 243
  ["M", "Ice Cave", "Volcano", "Barrels"],          // 244
  ["DKC2 Bonus"],                   // 245
  ["M", "Poison", "Enguarde", "Squawks"],           // 246
  ["Candy's Save Point"],           // 247
  ["M", "Jungle", "Ice Cave", "Rambi"],             // 248
  ["Crystal Coconut"],              // 249
  ["DKC2 Bonus"],                   // 250
  ["M", "Tires", "Barrel Cannons", "Altar"],        // 251
  ["M", "Barrels", "Gauntlet", "Water"],            // 252
  ["Golden Feather"],               // 253
  ["M", "Jungle", "Barrels", "Rattly"],             // 254
  ["M", "Docks", "Spawners", "Barrels"],            // 255
  ["M", "Barn", "Glacier", "Wind"],                 // 256
  ["DKC3 Bonus"],                   // 257
  ["M", "Doors", "Water", "Ellie"],                 // 258
  ["Bachelor's Pad"],               // 259
  ["Banana Bird"],                  // 260
  ["M", "Barn", "Boss", "Water"],                   // 261
  ["Cranky's Cabin"],               // 262
  ["Crystal Coconut"],              // 263
  ["ANY Bonus"],                    // 264
  ["M", "Mincers", "Storm", "Ellie"],               // 265
  ["Swanky's Bonus Bonanza"],       // 266
  ["Banana Bird"],                  // 267
  ["Wrinkly's Kong Kollege"],       // 268
  ["M", "Docks", "Hooks", "Lights"],                // 269
  ["DKC3 Bonus"],                   // 270
  ["M", "Barn", "Balloons", "Enguarde"],            // 271
  ["M", "Trees", "Conveyors", "Millstones"],        // 272
  ["M", "River", "Gauntlet", "Squawks"],            // 273
  ["DKC3 Bonus"],                   // 274
  ["M", "Trees", "Barrels", "Ellie"],               // 275
  ["Candy's Save Point"],           // 276
  ["Banana Bird"],                  // 277
  ["M", "Barn", "Chase", "Gauntlet"],               // 278
  ["Funky's Flights"],              // 279
  ["M", "Chase", "Barrels", "Doors"],               // 280
  ["Cranky's Cabin"],               // 281
  ["M", "Trees", "Water", "Parry"],                 // 282
  ["DKC3 Bonus"],                   // 283
  ["Brash's Stadium"],              // 284
  ["Swanky's Bonus Bonanza"],       // 285
  ["Banana Bird"],                  // 286
  ["M", "River", "Poison", "Ropes"],                // 287
  ["M", "Barrels", "Boss", "Water"],                // 288
  ["Candy's Save Point"],           // 289
  ["M", "Coral Reef", "Barrel Cannons", "Water"],   // 290
  ["M", "Waterfall", "Spawners", "Boss"],           // 291
  ["Banana Bird"],                  // 292
  ["M", "Docks", "Water", "Wind"],                  // 293
  ["M", "Barrel Cannons", "Water", "Ellie"],        // 294
  ["Cranky's Cabin"],               // 295
  ["M", "Coral Reef", "Chase", "Ellie"],            // 296
  ["Crystal Coconut"],              // 297
  ["M", "Waterfall", "Chase", "Enguarde"],          // 298
  ["DKC3 Bonus"],                   // 299
  ["Blue's Beach Hut"],             // 300
  ["M", "Gauntlet", "Water", "Parry"],              // 301
  ["Funky's Flights"],              // 302
  ["M", "Waterfall", "Ropes", "Water"],             // 303
  ["Lose a Life"],                  // 304
  ["ANY Bonus"],                    // 305
  ["M", "Factory", "Squawks", "Carts"],             // 306
  ["M", "Pipes", "Squitter", "Rising Danger"],      // 307
  ["Banana Bird"],                  // 308
  ["M", "Fire", "Pipes", "Barrels"],                // 309
  ["M", "Ropes", "Poison", "Squitter"],             // 310
  ["Candy's Save Point"],           // 311
  ["ANY Bonus"],                    // 312
  ["M", "Gauntlet", "Factory", "Trees"],            // 313
  ["Bazooka's Barracks"],           // 314
  ["M", "Barrel Cannons", "Gauntlet", "Quawks"],    // 315
  ["DKC3 Bonus"],                   // 316
  ["Funky's Flights"],              // 317
  ["Wrinkly's Kong Kollege"],       // 318
  ["Banana Bird"],                  // 319
  ["M", "Electricity", "Ropes", "Hooks"],           // 320
  ["Cranky's Cabin"],               // 321
  ["M", "Factory", "Barrels", "Boss"],              // 322
  ["Cranky's Cabin"],               // 323
  ["M", "Factory", "Glacier", "Gauntlet"],          // 324
  ["M", "Boss", "Spawners", "Storm"],               // 325
  ["Banana Bird"],                  // 326
  ["Barter's Swap Shop"],           // 327
  ["DKC3 Bonus"],                   // 328
  ["M", "Chase", "Fire", "Parry"],                  // 329
  ["Funky's Flights"],              // 330
  ["Crystal Coconut"],              // 331
  ["M", "Cliffs", "Carts", "Storm"],                // 332
  ["DKC3 Bonus"],                   // 333
  ["M", "Glacier", "Chase", "Ropes"],               // 334
  ["Swanky's Bonus Bonanza"],       // 335
  ["M", "Barrels", "Squitter", "Waterfall"],        // 336
  ["Banana Bird"],                  // 337
  ["ANY Bonus"],                    // 338
  ["Lose a Life"],                  // 339
  ["M", "Barrel Cannons", "Enguarde", "Caves"],     // 340
  ["M", "Cliffs", "Squawks", "Lights"],             // 341
  ["Swanky's Bonus Bonanza"],       // 342
  ["Cranky's Cabin"],               // 343
  ["M", "Caves", "Ropes", "Water"],                 // 344
  ["DKC3 Bonus"],                   // 345
  ["M", "Boss", "Gauntlet", "Ellie"],               // 346
  ["Banana Bird"],                  // 347
  ["M", "Quawks", "Rising Danger", "Parry"],        // 348
  ["DKC3 Bonus"],                   // 349
  ["M", "Barrels", "Enguarde", "Squitter"],         // 350
  ["Björn's Chairlift"],            // 351
  ["M", "Cliffs", "Fire", "Water"],                 // 352
  ["Candy's Save Point"],           // 353
  ["Banana Bird"],                  // 354
  ["M", "Waterfall", "Gauntlet", "Water"],          // 355
  ["M", "Coral Reef", "Ropes", "Fire"],             // 356
  ["Cranky's Cabin"],               // 357
  ["M", "Gauntlet", "Spawners", "Coral Reef"],      // 358
  ["Banana Bird"],                  // 359
  ["M", "Ropes", "Water", "Wind"],                  // 360
  ["M", "Pipes", "Gauntlet", "Water"],              // 361
  ["Banana Bird"],                  // 362
  ["M", "Docks", "Boss", "Water"],                  // 363
  ["Barnacle's Island"],            // 364
  ["M", "Coral Reef", "Hooks", "Storm"],            // 365
  ["Lose a Life"],                  // 366
  ["M", "Pipes", "Barrel Cannons", "Water"],        // 367
  ["DKC3 Bonus"],                   // 368
  ["Crystal Coconut"],              // 369
  ["M", "Gauntlet", "Spawners", "Water"],           // 370
  ["DKC3 Bonus"],                   // 371
  ["M", "Trees", "Enguarde", "Ropes"],              // 372
  ["Banana Bird"],                  // 373
  ["Swanky's Bonus Bonanza"],       // 374
  ["M", "Cliffs", "Carts", "Enguarde"],             // 375
  ["ANY Bonus"],                    // 376
  ["Funky's Flights"],              // 377
  ["M", "River", "Gauntlet", "Poison"],             // 378
  ["M", "Conveyors", "Storm", "Water"],             // 379
  ["Baffle's Code Room"],           // 380
  ["Lose a Life"],                  // 381
  ["M", "Electricity", "Barrels", "Gauntlet"],      // 382
  ["Cranky's Cabin"],               // 383
  ["Banana Bird"],                  // 384
  ["DKC3 Bonus"],                   // 385
  ["M", "Jungle", "Ropes", "Squitter"],             // 386
  ["Swanky's Bonus Bonanza"],       // 387
  ["M", "Caves", "Barrels", "Water"],               // 388
  ["DKC3 Bonus"],                   // 389
  ["M", "Castle", "Electricity", "Barrel Cannons"], // 390
  ["M", "Enguarde", "Barrels", "Boss"],             // 391
  ["Banana Bird"],                  // 392
  ["M", "Jungle", "Fire", "Ghosts"],                // 393
  ["M", "Pipes", "Boss", "Hooks"],                  // 394
  ["M", "Cliffs", "Fire", "Barrels"],               // 395
  ["Candy's Save Point"],           // 396
  ["M", "Trees", "Drums", "Gauntlet"],              // 397
  ["M", "Caves", "Boss", "Squawks"],                // 398
  ["Lose a Life"],                  // 399
  ["DKC3 Bonus"],                   // 400
  ["M", "Spawners", "Conveyors", "Jungle"],         // 401
  ["Wrinkly's Kong Kollege"],       // 402
  ["M", "Squawks", "Ellie", "Parry"],               // 403
  ["Banana Bird"],                  // 404
  ["ANY Bonus"],                    // 405
  ["M", "Jungle", "Cliffs", "Barrels"],             // 406
  ["Boomer's Bomb Shelter"],        // 407
  ["M", "Electricity", "Chase", "Gauntlet"],        // 408
  ["Cranky's Cabin"],               // 409
  ["M", "Squitter", "Fire", "Gauntlet"],            // 410
  ["Swanky's Bonus Bonanza"],       // 411
  ["M", "Ropes", "Ship Hold", "Squitter"],          // 412
]

export const WORLD_MAP: Record<number, string | null> = {
  // No world
  ...Object.fromEntries(Array.from({ length: 6 }, (_, i) => [i + 1, null])),

  // Kongo Jungle
  ...Object.fromEntries(Array.from({ length: 17 }, (_, i) => [i + 7, "Kongo Jungle"])),

  // Monkey Mines
  ...Object.fromEntries(Array.from({ length: 17 }, (_, i) => [i + 24, "Monkey Mines"])),

  // Vine Valley
  ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i + 41, "Vine Valley"])),

  // Gorilla Glacier
  ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i + 61, "Gorilla Glacier"])),

  // Kremkroc Industries, Inc.
  ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i + 81, "Kremkroc Industries, Inc."])),

  // Chimp Caverns
  ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i + 101, "Chimp Caverns"])),

  // Gangplank Galleon
  ...Object.fromEntries(Array.from({ length: 17 }, (_, i) => [i + 121, "Gangplank Galleon"])),

  // Crocodile Cauldron
  ...Object.fromEntries(Array.from({ length: 18 }, (_, i) => [i + 138, "Crocodile Cauldron"])),

  // Krem Quay
  ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i + 156, "Krem Quay"])),

  // Krazy Kremland
  ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i + 176, "Krazy Kremland"])),

  // Gloomy Gulch
  ...Object.fromEntries(Array.from({ length: 17 }, (_, i) => [i + 196, "Gloomy Gulch"])),

  // K. Rool's Keep
  ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i + 213, "K. Rool's Keep"])),

  // The Flying Krock
  ...Object.fromEntries(Array.from({ length: 5 }, (_, i) => [i + 233, "The Flying Krock"])),

  // Lost World
  ...Object.fromEntries(Array.from({ length: 17 }, (_, i) => [i + 238, "Lost World"])),

  // Lake Orangatanga
  ...Object.fromEntries(Array.from({ length: 17 }, (_, i) => [i + 255, "Lake Orangatanga"])),

  // Kremwood Forest
  ...Object.fromEntries(Array.from({ length: 17 }, (_, i) => [i + 272, "Kremwood Forest"])),

  // Cotton-Top Cove
  ...Object.fromEntries(Array.from({ length: 17 }, (_, i) => [i + 289, "Cotton-Top Cove"])),

  // Mekanos
  ...Object.fromEntries(Array.from({ length: 17 }, (_, i) => [i + 306, "Mekanos"])),

  // K3
  ...Object.fromEntries(Array.from({ length: 17 }, (_, i) => [i + 323, "K3"])),

  // Razor Ridge
  ...Object.fromEntries(Array.from({ length: 17 }, (_, i) => [i + 340, "Razor Ridge"])),

  // Pacifica
  ...Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i + 357, "Pacifica"])),

  // KAOS Kore
  ...Object.fromEntries(Array.from({ length: 18 }, (_, i) => [i + 377, "KAOS Kore"])),

  // Krematoa
  ...Object.fromEntries(Array.from({ length: 17 }, (_, i) => [i + 395, "Krematoa"]))
};