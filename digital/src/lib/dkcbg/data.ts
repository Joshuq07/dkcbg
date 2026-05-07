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
export const materialList: string[][] =  [
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

export const starValue: number[] =  [
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

