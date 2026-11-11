// Editorial source: concise paraphrases of the ranking-series captions.
// One entry per undirected pair or directed counter; never infer edges from TODOs.
(() => {
  const episodes = [
    ['qRD_7-c7aJs', 'Smash Up Spring 2026 2-Player Tier List: C-Tier Part 1'],
    ['EcSWmVpla6A', 'Smash Up Spring 2026 2-Player Tier List: C-Tier Part 2'],
    ['EukcrAeaco8', 'Smash Up Spring 2026 2-Player Tier List: C-Tier Part 3'],
    ['aLuyhEN3Wek', 'Smash Up Spring 2026 2-Player Tier List: B-Tier Part 1'],
    ['6h5Ly4qCOks', 'Smash Up Spring 2026 2-Player Tier List: B-Tier Part 2'],
    ['RH5tl_2qxTc', 'Smash Up Spring 2026 2-Player Tier List: B-Tier Part 3'],
    ['xq0ccBhHWtU', 'Smash Up Summer 2026 2-Player Tier List: B-Tier Part 4'],
    ['MqX4PHgxf24', 'Smash Up Fall* 2026 2-Player Tier List: A-Tier Part 1'],
  ].map(([videoId,title]) => ({videoId,title,transcript:'auto-generated English captions',reviewStatus:'partial',url:`https://www.youtube.com/watch?v=${videoId}`}));
  const entries = [];
  const todos = [];
  const seconds = timestamp => timestamp.split(':').reduce((total,part) => total*60+Number(part),0);
  function batch(videoId,type,rows) {
    for (const [from,to,timestamp,summary,conditions=[]] of rows) entries.push({
      type, factions:[from,to], summary, conditions, reviewStatus:'caption-summary',
      sources:[{videoId,startSeconds:seconds(timestamp)}],
    });
  }
  function todo(videoId,faction,timestamp,proposedTag,summary) {
    todos.push({faction,proposedTag,summary,status:'needs-tags-and-review',source:{videoId,startSeconds:seconds(timestamp)}});
  }

  batch('qRD_7-c7aJs','pair',[
    ['S.H.I.E.L.D.','Ghosts','5:56','Ghosts supply small minions that fit S.H.I.E.L.D.’s extra plays. Ghostly Arrival accelerates deployment, while S.H.I.E.L.D. can empty the hand quickly enough to enable Ghosts’ low-hand effects.'],
    ['Fairies','Ancient Egyptians','17:23','Spirit of the Forest can let Ancient Egyptians use both alternatives on cards with an “or” ability, opening additional plays with cards such as Lost Knowledge.',['Uses Spirit of the Forest.']],
    ['Fairies','Dinosaurs','17:35','Fairies provide extra card plays for Dinosaurs’ powerful cards. Glimmer can weaken targets so the Dinosaurs’ destruction effects can remove them more easily.'],
    ['Fairies','Kitty Cats','17:58','Glimmer lowers enemy minion power, helping Kitty Cats bring those minions within reach of their control effects.'],
    ['Fairies','Vampires','17:58','Glimmer weakens enemy minions so Vampires can destroy them more easily and gain their destruction rewards.'],
    ['Vikings','Time Travelers','21:55','Time Travelers let Vikings replay their stealing effects. Reusing cards such as Shield Maiden, Valkyrie, and Raiding Party turns one theft into repeated disruption.'],
    ['Vikings','Thieves','22:09','Both factions take opponents’ cards. Thieves can then use the cards stolen by Vikings as resources for their own abilities.',['Discusses rebalanced Thieves.']],
    ['Vikings','Penguins','22:28','Vikings can put a minion from hand back on top of the deck, setting up a more predictable Penguin play from the deck.'],
    ['Sinister Six','Grannies','26:13','Great-Grandma can repeatedly play Green Goblin from the bottom of the deck, giving Sinister Six access to an important minion and a substantial power burst.',['Uses Great-Grandma.']],
    ['Sinister Six','Killer Plants','26:52','Sinister Six can retrieve and reposition Overgrowth. Killer Plants also provide Sprouts that can find Green Goblin, supporting both the base-action plan and minion access.'],
    ['Sinister Six','Wraithrustlers','27:20','Wraithrustlers supply useful base actions for Sinister Six to manipulate, and Demon Dogs can bring Green Goblin back into play.'],
    ['Spider-Verse','Cowboys','32:50','Cowboy duels create additional opportunities to play Spider-Verse actions. A Sheriff duel during scoring lets those actions be used in their preferred scoring window.'],
    ['Masters of Evil','Grimms\' Fairy Tales','38:53','Acceptable Losses can turn a large minion’s destruction into VP while enabling Big Bad Wolf. Grimms’ Fairy Tales also help bring Baron Zemo back into play.'],
    ['Masters of Evil','The Lion King','38:53','The Lion King has large minions it wants destroyed. Acceptable Losses supplies a destruction outlet that also earns Masters of Evil VP.'],
    ['Masters of Evil','Super Heroes','39:17','Mild-Mannered Citizen can repeatedly find Baron Zemo. When Zemo’s ability returns him to the deck, he remains available for another search and more scoring opportunities.'],
  ]);
  batch('qRD_7-c7aJs','counter',[
    ['Dragons','S.H.I.E.L.D.','11:15','Dragons make bases difficult to enter and punish small-minion swarms, directly obstructing S.H.I.E.L.D.’s main way of building power.'],
    ['Tricksters','S.H.I.E.L.D.','11:15','Tricksters’ area control penalizes the repeated small-minion plays S.H.I.E.L.D. needs to build a scoring burst.'],
    ['Princesses','S.H.I.E.L.D.','11:32','Eliza restricts extra card plays, cutting off the chains of minion plays that S.H.I.E.L.D. relies on.'],
    ['Fairies','Cyborg Apes','16:11','Fairies can remove or steal minion modifiers, dismantling the upgraded minions on which Cyborg Apes concentrate their resources.'],
    ['Time Travelers','Fairies','17:03','Into the Time Slip can remove Spirit of the Forest without needing to win a Titan clash, forcing Fairies to spend resources bringing their Titan back.',['Targets Spirit of the Forest.']],
    ['Truckers','Sinister Six','28:21','Truckers can steal the base actions that Sinister Six depends on, turning their setup against them.'],
    ['The Nightmare Before Christmas','Sinister Six','28:30','Jack-in-the-Box interferes with card draw, while Ghostly Presence prevents most Sinister Six minions from entering its base. Both attack key parts of the faction’s engine.'],
    ['Tornados','Spider-Verse','35:48','Tornados can move Spider-Verse’s remaining minion off a base before it scores, removing the foothold needed for a Miles Morales scoring play.'],
  ]);
  todo('qRD_7-c7aJs','Sinister Six','25:46','base-modifiers','Review other play-on-base factions as partners. The podcast recommends the archetype broadly; identify and verify individual pairings before adding edges.');
  todo('qRD_7-c7aJs','Fairies','17:23','or-abilities','Review factions with valuable “or” abilities for Spirit of the Forest. Tag the relevant mechanics before proposing more pairings.');

  batch('EcSWmVpla6A','pair',[
    ['Truckers','Super Heroes','3:21','Super Heroes can repeatedly find El Bandido, helping Truckers establish their base-action engine. Truckers can also reposition The Everything Glove.',['The Titan movement benefit uses The Everything Glove.']],
    ['Truckers','Zombies','3:35','Zombies can bring El Bandido and Rubber Chicken back after they leave play, keeping the Truckers engine running instead of losing its key minions after a score.'],
    ['Ancient Egyptians','Luchadors','14:34','Lost Knowledge can uncover a buried Capa Roja before a base scores, letting its printed-power destruction affect the scoring battle immediately.',['Discusses the rebalanced Luchadors.']],
    ['Ancient Egyptians','Mega Troopers','15:14','Both factions offer scoring-window tricks. Red Trooper also allows Sphinx and Mega Bot to be in play together.',['Uses the rebalanced Mega Troopers and both Titans.']],
    ['Ancient Egyptians','Vampires','17:17','Rebalanced Vampires interact with burying and offer free special plays that ease the Egyptians’ setup. Ancient Curse can also reduce power to help Vampire destruction and trigger Stakeout.',['Discusses rebalanced Vampires.']],
    ['Mythic Horses','Magical Girls','29:09','Mythic Horses provide many minions for Magical Girls’ scaling abilities. Magical Girls add movement, extra minion plays, and recursion to help the Horses spread out and recover.'],
  ]);
  batch('EcSWmVpla6A','counter',[
    ['Truckers','Killer Plants','2:49','Truckers can steal Overgrowth and use the Plants’ base-action setup against them.'],
    ['Truckers','Ancient Incas','2:49','Truckers can take the Incas’ base actions, removing important engine pieces while gaining their benefits.'],
    ['Polynesian Voyagers','Truckers','8:04','Māui restricts movement to its base, while Volcanic Uprising can destroy a base and remove the Truckers’ accumulated base actions.'],
    ['Sheep','Truckers','8:52','Little Bo Peep shuts down opposing movement. Sheep offer few attractive base actions to steal, and their own movement tools can keep pace with Truckers.'],
    ['Luchadors','Mythic Horses','35:41','Luchadors can cancel a large Horse minion’s ability and then take control of it with Reversal, turning a carefully built setup against its owner.'],
    ['Ninjas','Mythic Horses','35:50','Ninjas can destroy the minions Horses need to maintain their play chains, then use scoring specials to contest a base after the Horses have committed resources.'],
  ]);
  todo('EcSWmVpla6A','Truckers','0:53','base-modifiers','Review play-on-base factions as both partners and opposing matchups. Sharing an archetype can support a pairing while also creating a theft vulnerability; do not infer the same relationship type for every faction.');

  batch('EukcrAeaco8','pair',[
    ['Cowboys','Dinosaurs','5:23','Dinosaurs supply strong power boosts and Rampage for Cowboy burst turns, while Cowboys add control. The discussion gives Gunfighter plus Quick Draw followed by Rampage as an example.',['Titan interactions depend on Fort Titanosaurus and the timing limits discussed in the episode.']],
    ['Cowboys','Astroknights','5:30','Astroknights provide power boosts for Cowboy duels and burst plays; Cowboys supply control that the Astroknights otherwise lack.'],
    ['Mounties','Mermaids','14:20','Both factions can reposition friendly and enemy minions, helping Mounties find bases with opposing minions. Mermaid effects can also force an opponent to supply a target.'],
    ['Mounties','Tornados','14:20','Tornados can position enemy minions where Mounties need them and move friendly minions into those contested bases.'],
    ['World Champs','Smash Up All Stars','21:03','All Stars provide extra card plays that let World Champs deploy several minions and still use a power-boosting action, overcoming a shortage of plays.'],
    ['Changerbots','Cyborg Apes','31:56','Changerbots contribute more minion modifiers than their theme suggests. Cyborg Apes exploit those modifiers, while Solarshout can supply additional action plays for the setup.'],
  ]);
  batch('EukcrAeaco8','counter',[
    ['Cyborg Apes','Cowboys','8:08','A Cowboy duel gives Cyborg Apes a chance to play modifiers out of sequence, increasing the target’s power and potentially preparing a dangerous Flying Monkey play.'],
    ['Kree','Cowboys','8:42','Duels let Kree play additional power-boosting actions during the Cowboys’ turn. That can reverse the duel or even help Kree score a base before their own turn begins.'],
    ['Super Spies','World Champs','24:56','Random discard can remove a valuable one-of card from the World Champs hand, disrupting the particular combination they were saving.'],
  ]);
  todo('EukcrAeaco8','Mounties','14:52','force-opponent-plays','Pearl and the Images is discussed as a theorycrafted way to force enemy minions into play for Mounties. Playtest and review before adding a confirmed pairing.');

  batch('aLuyhEN3Wek','pair',[
    ['Pirates','Cyborg Apes','3:30','Cyborg Apes can build a much larger First Mate. Pirates’ persistence then lets that invested power contribute to successive bases.'],
    ['Pirates','Giant Ants','3:30','Giant Ants can add power counters to First Mates, creating large persistent minions that remain useful across multiple base scores.'],
    ['Pirates','Magical Girls','6:44','Persistent First Mates provide extra bodies for Magical Girls’ abilities, maintaining the minion count their scaling effects want.'],
    ['Pirates','Russian Fairy Tales','7:26','Russian Fairy Tales add their own persistence to First Mates, Full Sail, and Kraken, allowing substantial power to carry over from one base to another.',['The Kraken contribution requires that Titan.']],
    ['Mythic Greeks','Super Heroes','11:00','Super Heroes provide another way to find Odysseus, increasing access to the minion that drives the Greeks’ action-based engine.'],
    ['Sheep','Elves','31:12','Elf-help Guru can help trigger Counting Sheep. Ram can also return a gifted Flower Child to hand after a trade, allowing that exchange to be used again.'],
  ]);
  batch('aLuyhEN3Wek','counter',[
    ['Aliens','Pirates','6:06','Aliens can return an upgraded First Mate to hand, removing it from play and stripping away the power investment that made it a persistent threat.'],
    ['Polynesian Voyagers','Pirates','6:12','Movement restrictions interfere with the First Mate plan, preventing its stored power from freely following the Pirates from base to base.'],
    ['Sheep','Pirates','6:12','Sheep can shut down movement, disrupting the Pirates’ plan of repeatedly carrying First Mate power to the next base.'],
    ['Giant Ants','Samurai','17:27','Death on Six Legs can remove a crucial power counter before Bushi reaches the discard pile, dropping him below the power needed for his VP effect.',['Uses the clarified, rebalanced Death on Six Legs timing.']],
  ]);

  batch('6h5Ly4qCOks','pair',[
    ['Anansi Tales','Time Travelers','4:21','Anansi’s action access and recycling can be used to repeat powerful Time Traveler actions such as Time Walk. The hosts discuss an elaborate multi-play sequence rather than an automatic result.',['Requires the right setup and sequencing.']],
    ['Anansi Tales','Super Heroes','4:54','Super Heroes help find Anansi the Spider, improving consistency when the Tales would otherwise struggle to draw their key support minion.'],
    ['Goblins','Smash Up All Stars','15:59','Goblin Recruiters recycle the All Stars’ powerful cards into the deck, helping them recover after spending the limited selection that fuels their best turns.'],
    ['Ultimates','Kree','32:10','Kree supply extra action plays that Ultimates want. Ultimates provide movement so the Kree can spread out instead of committing everything to one base.'],
    ['Halflings','Pearl and the Images','37:33','Pearl supports the Halflings’ small-minion plays, while Ruby supplies group power boosts that make those numerous bodies more threatening.'],
    ['Halflings','Elves','38:07','Elf-help Guru can increase the opponent’s power, helping Halflings satisfy the conditions on their extra-minion effects.'],
    ['Teens','Wizards','45:24','Wizards add draw and consistency to help Teens assemble their sequences. Chronomage also fits the Teens’ emphasis on three-power minions.'],
    ['Teens','Killer Plants','45:35','Rebalanced Killer Plants have useful three-power minions, and Sprout can search for the particular Teen needed for the next step of a chain.',['Discusses rebalanced Killer Plants.']],
    ['Steampunks','Skeletons','54:16','Mechanic and Scrap Diving recycle Skeleton actions, Zeppelin repositions Lord of Bones, and the Skeleton swarm can take advantage of Rotary Slug Thrower.'],
  ]);
  batch('6h5Ly4qCOks','counter',[
    ['Vikings','Aladdin','10:35','Vikings can steal Genie, leaving Aladdin unable to use the Wishes in hand until Genie can be recovered.'],
    ['Itty Critters','Aladdin','10:52','Critter Cube can remove Genie from circulation, shutting off unused Wishes and making the faction’s most powerful actions inaccessible.'],
    ['Grannies','Cyborg Apes','24:58','Knitting Circle can dismantle the Apes’ modifier setup. The hosts note that two Shieldings can protect one another, making that protected setup harder to remove.',['The double-Shielding exception matters.']],
    ['Thieves','Cyborg Apes','25:13','Thieves can take modifiers directly from Cyborg Ape minions, removing the upgrades on which the Apes have concentrated their resources.'],
  ]);
  todo('6h5Ly4qCOks','Cyborg Apes','24:35','minion-modifiers','Review other minion-modifier factions and extra-action support. Keep named recommendations separate from automatic tag-based matches.');
  todo('6h5Ly4qCOks','Teens','47:18','movement','The hosts speculate about movement partners such as Tornados using Slacker. Treat this as an exploration task, not a tested pairing recommendation.');

  batch('RH5tl_2qxTc','pair',[
    ['Dwarves','The Lion King','15:23','The Lion King helps Dwarves access Gold Digger and Loot Lover, key pieces that enable the treasure and recursion engine.',['Discusses rebalanced Dwarves.']],
    ['Dwarves','Clowns','15:45','Clowns replay Dwarf standard actions that return an action play, including Hidden Assets and Greed Is Good. That advances the Dwarf engine without consuming the Clowns’ entire turn.',['Discusses rebalanced Dwarves.']],
    ['Bear Cavalry','Shapeshifters','31:50','General Ivan protects minions from destruction, allowing Shapeshifters to exploit their destruction-for-extra-play effects without losing the protected minion. Mimic can also benefit from Ivan’s high printed power.'],
    ['Bear Cavalry','Mega Troopers','32:16','Mega Troopers add friendly movement and scoring specials, complementing Bear Cavalry’s ability to push opposing minions into useful positions.',['Discusses rebalanced Bear Cavalry and Mega Troopers.']],
    ['Ancient Incas','Goblins','35:31','Ancient Incas can find and support an important base action such as Goblin Recruiters, helping Goblins establish the recursion engine they want.'],
    ['Ancient Incas','Mulan','36:22','Ancient Incas supply power counters that support Mulan’s counter-based plays, offering useful support beyond a purely play-on-base partnership.'],
    ['Ancient Incas','Giant Ants','36:38','Giant Ants provide extra action plays for the Incas, while Inca effects generate more power counters for the Ant engine.'],
    ['Astroknights','Itty Critters','46:28','Itty Critters prefer to keep useful minions in the deck, while Astroknights mainly draw actions. That lets the combined deck gain resources without filling its hand with unwanted minions.'],
  ]);
  batch('RH5tl_2qxTc','counter',[
    ['Time Travelers','Explorers','7:14','Into the Time Slip removes Very Large Boulder, undoing the slow accumulation of Titan power that Explorers have invested in.',['Targets Very Large Boulder.']],
    ['Teddy Bears','Bear Cavalry','33:27','Love Overload and Cuddle disrupt the Bear Cavalry’s large minions and abilities, while Too Cute can protect Teddy Bears from destruction.',['Discusses rebalanced Bear Cavalry.']],
  ]);
  todo('RH5tl_2qxTc','Ancient Incas','34:30','base-modifiers','Review other play-on-base factions and factions that depend on one important base action. The recommendation is broader than the named pairings; confirm each proposed edge.');
  todo('RH5tl_2qxTc','Penguins','1:01:54','plays-outside-hand','Rebalanced Penguins trigger on plays from outside the hand, including uncovering and discard plays. Review bury, stasis, and recursion partners rather than assuming every faction with those mechanics is a good pairing.');

  batch('xq0ccBhHWtU','pair',[
    ['Extramorphs','Vikings','10:48','Vikings can put a minion drawn into hand back on top of the deck, gain power, and let Extramorphs play that minion through their deck-access effects.'],
    ['Extramorphs','Hydra','11:41','Head Grabber can be attached to a friendly Hydra Agent, adding a self-sacrifice interaction to the Extramorphs’ minion-access tools.'],
    ['Kaiju','Skeletons','20:26','Skeletons help recur Kaiju’s scarce minions and contribute base actions. Kaiju in return generate power counters that Skeletons can use.'],
    ['Kaiju','Grannies','20:53','Nana and Granny’s Purse are more likely to reveal playable actions in an action-heavy Kaiju deck, accelerating its development.',['Managing Great-Grandma and Gorgodzolla can require switching Titans.']],
    ['Kaiju','Extramorphs','21:36','Extramorphs help find and recur Kaiju’s three minions. Eggfield and Hive Queen can also prepare a safer base for bringing Gorgodzolla into play.',['The Titan setup benefit uses Gorgodzolla.']],
    ['Teddy Bears','Mythic Horses','30:01','Both factions offer group power boosts, letting a wide board of small minions become a large burst. The hosts recommend preparing those actions in advance because extra action plays are limited.'],
    ['Teddy Bears','Super Heroes','30:38','Mild-Mannered Citizen can become Sir Squeezes, who can then supply more Citizens at the start of the turn to transform into powerful Super Heroes.'],
    ['Teddy Bears','Wreck-It Ralph','31:06','Wreck-It Ralph reuses useful Teddy base actions such as Bear Picnic and adds movement, while the Teddy swarm supports Ralph’s minion-count payoffs.'],
    ['Elder Things','Sharks','37:55','Eldest Thing destroys friendly minions as part of its play. Sharks can replace those losses with Makos, while their Titan gains power from the destroyed minions.',['The Titan benefit requires Sharks’ Titan.']],
    ['Elder Things','Anansi Tales','38:28','Hornets played through Anansi’s effects provide expendable bodies for Eldest Thing’s destruction requirement, even when those Hornets are spread across bases.'],
    ['Kitty Cats','Orcs','1:01:24','Angry Pillagers lowers enemy power so Muffin can take control of the target. Dogpile can also preserve an important Cat minion after scoring.',['Discusses rebalanced Orcs.']],
    ['Kitty Cats','The Nightmare Before Christmas','1:01:55','Nightmare modifiers can penalize an enemy minion, then become beneficial after Kitty Cats take control of that minion.'],
  ]);
  batch('xq0ccBhHWtU','counter',[
    ['Elder Things','Kree','4:55','Elder Things can force the Kree to discard an action saved for a later burst, including a specifically named card through The Power of Madness. The hosts disagree about its severity and explicitly avoid calling it a hard counter.',['Situational; the hosts debate this matchup.']],
    ['Tornados','Kaiju','22:22','Tornados can destroy a base and clear its accumulated actions and Gorgodzolla. Category 5 also threatens opposing Titans through movement and clashes.',['Titan interactions are part of this explanation.']],
    ['Vikings','Kaiju','22:55','Kaiju’s action-heavy deck gives Viking stealing effects many usable targets. Vikings can also take an action already in play.'],
  ]);
  todo('xq0ccBhHWtU','Kaiju','16:47','base-modifiers','The hosts deliberately omit obvious play-on-base partners from the slide. Review those broad recommendations and additional swarm partners individually before adding more edges.');
  todo('xq0ccBhHWtU','Disco Dancers','44:41','copyable-standard-actions','Review partners with strong standard actions that Disco Dancers can copy. Mythic Greeks are discussed positively for three-player games, but the host explicitly questions the same payoff in two-player games; do not promote that example to a confirmed two-player edge.');

  batch('MqX4PHgxf24','pair',[
    ['Luchadors','Tornados','6:34','Tornados move escaping enemy minions back where Luchadors need them. Ripped Off can also transfer setup actions between targets, preserving their usefulness.'],
    ['Luchadors','The Nightmare Before Christmas','7:07','Nightmare supplies additional minion modifiers for the Luchador leader to play, while Dr. Finkelstein can transfer setup actions between minions.',['Discusses rebalanced Luchadors.']],
    ['Luchadors','Steampunks','7:41','Steampunks add movement and draw. Change of Venue replays a setup action on another target, and Scrap Diving retrieves useful actions from the discard pile.'],
    ['Luchadors','Slashers','8:14','Luchadors provide extra minion destruction to support Slashers’ rewards. Slashers also contribute minion modifiers and action-transfer tools to the combined control plan.'],
    ['Vampires','Super Heroes','21:21','Mild-Mannered Citizens destroy themselves to transform, supplying destruction triggers for Vampires and helping bring The Count into play.',['Discusses rebalanced Vampires and The Count.']],
    ['Tricksters','Magical Girls','35:43','Trickster protection and Enshrouding Mist help Magical Girls maintain enough minions for their scaling talents. Magical Girls return the favor with movement that Tricksters lack.',['Discusses rebalanced Tricksters.']],
    ['Tricksters','Steampunks','36:07','Steampunks provide movement and can recur Take the Shinies, making the Tricksters’ random-discard pressure repeatable over successive turns.'],
    ['Giant Ants','Shapeshifters','46:45','Killer Queen can access printed-power-one-or-less minions such as Mimic, helping the Ants deploy a useful partner minion directly from the deck.',['Discusses rebalanced Giant Ants.']],
    ['Giant Ants','Kung Fu Fighters','48:20','Sifu adds an additional counter when counters are transferred between minions, multiplying the value of the Giant Ants’ counter-transfer effects.',['Uses Sifu.']],
    ['Warriors','Tornados','54:27','Tornados can move monsters to reposition their breakpoint contribution, helping Warriors turn monster setups into scoring opportunities.'],
    ['Dinosaurs','Wizards','1:05:40','Wizards supply extra card plays, letting Dinosaurs deploy more of their powerful cards instead of being limited to a single large play.'],
    ['Dinosaurs','Zombies','1:05:46','Zombies repeatedly bring King Rex back from the discard pile, letting the deck reuse one of the Dinosaurs’ biggest power drops.'],
    ['Dinosaurs','Aladdin','1:06:48','Wishes provide extra card plays that Dinosaurs can turn into more power in one turn. A Wish can also supply a direct power boost when needed.'],
    ['Princesses','Backtimers','1:18:47','Backtimers can store Princess minions in stasis and then release several in one turn, producing a large burst of five-power bodies.'],
    ['Princesses','Super Heroes','1:19:01','Mild-Mannered Citizen can find the particular Princess needed, including Eliza when restricting enemy extra plays is the priority.'],
  ]);
  batch('MqX4PHgxf24','counter',[
    ['Hydra','Luchadors','11:40','Hydra can destroy one of its own minions after Luchadors attach a setup action, removing the target while wasting the Luchadors’ action investment.'],
    ['Giant Ants','Vampires','21:44','Drone protects the Ants’ minions from destruction, denying Vampire triggers. Death on Six Legs can also take counters from minions going to the discard pile.',['Discusses rebalanced Drone and Titan interactions.']],
    ['Elder Things','Vampires','26:39','Resetting the Vampires’ discard pile interrupts their recursion and removes resources they planned to reuse.',['Discusses the rebalanced Vampires’ discard dependence.']],
    ['Magical Girls','Vampires','26:39','Magical Girls can reset a discard pile, disrupting the Vampires’ ability to recover and repeatedly use discarded cards.'],
    ['Zombies','Tricksters','38:13','Forced discard is less punishing for Zombies because they can use the discarded minions as resources, undermining a major part of Trickster disruption.'],
    ['Miskatonic University','Tricksters','38:52','You Meddling Kids can destroy multiple actions, clearing the Tricksters’ accumulated action-based setup.'],
    ['Kung Fu Fighters','Giant Ants','49:00','Kung Fu Fighters can steal the Ants’ power counters and destroy vulnerable minions when Drone is absent.',['Drone’s protection changes the matchup.']],
    ['Tornados','Warriors','54:27','Tornados can move monsters away from the Warriors’ prepared base, disrupting the monster-dependent setup and changing the breakpoint calculation.'],
    ['Tricksters','Dinosaurs','1:07:14','Random discard can remove a high-value card such as King Rex while the Dinosaurs are waiting for the right turn to play it.',['A recursion partner such as Zombies can reduce the damage.']],
  ]);
  todo('MqX4PHgxf24','Giant Ants','46:45','printed-power-one-or-less','Review factions with useful minions of printed power one or less for Killer Queen. Named examples are evidence; a matching tag alone should not create a pairing.');
  todo('MqX4PHgxf24','Clowns','1:23:21','standard-actions-with-extra-plays','Review partners whose strong standard actions refund a card play when Clowns replay them. Record individual reasons before adding additional pairings.');

  window.RELATIONSHIP_DATA = {channelUrl:'https://www.youtube.com/@UseTheFoursPodcast',episodes,entries,todos};
})();
