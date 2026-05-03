export interface Novel {
  id: string;
  title: string;
  author: string;
  cover: string;
  status: "reading" | "waitlist" | "read";
  slug: string;
}

const coverModules = import.meta.glob<{ default: string }>(
  "../assets/novels/*.jpg",
  { eager: true }
);

const _covers: Record<string, string> = {};
for (const path in coverModules) {
  const stem = path.split("/").pop()!.replace(".jpg", "");
  _covers[stem] = coverModules[path].default;
}

export function getCover(stem: string): string {
  return _covers[stem] ?? "";
}

export const novels: Novel[] = [
  // Currently Reading
  { id: "twisted-games",       title: "Twisted Games",               author: "Ana Huang",       cover: "TwistedGames",                      status: "reading",  slug: "twisted-games"                    },
  { id: "oath-of-vayuputras",  title: "The Oath of the Vayuputras",  author: "Amish Tripathi",  cover: "TheOathOfTheVayuputras",             status: "reading",  slug: "the-oath-of-the-vayuputras"       },

  // Waitlist
  { id: "twisted-lies",        title: "Twisted Lies",                author: "Ana Huang",       cover: "TwistedLies",                       status: "waitlist", slug: "twisted-lies"                     },
  { id: "twisted-hate",        title: "Twisted Hate",                author: "Ana Huang",       cover: "TwistedHate",                       status: "waitlist", slug: "twisted-hate"                     },

  // Read — Amish Tripathi
  { id: "immortals-of-meluha", title: "The Immortals of Meluha",     author: "Amish Tripathi",  cover: "TheImmortalsOfMeluha",              status: "read",     slug: "the-immortals-of-meluha"          },
  { id: "secret-of-nagas",     title: "The Secret of the Nagas",     author: "Amish Tripathi",  cover: "TheSecretOfTheNagas",               status: "read",     slug: "the-secret-of-the-nagas"          },

  // Read — Ana Huang
  { id: "twisted-love",        title: "Twisted Love",                author: "Ana Huang",       cover: "TwistedLove",                       status: "read",     slug: "twisted-love"                     },

  // Read — Chetan Bhagat
  { id: "one-indian-girl",     title: "One Indian Girl",             author: "Chetan Bhagat",   cover: "OneIndianGirl",                     status: "read",     slug: "one-indian-girl"                  },
  { id: "revolution-2020",     title: "Revolution 2020",             author: "Chetan Bhagat",   cover: "Revolution2020",                    status: "read",     slug: "revolution-2020"                  },

  // Read — Colleen Hoover
  { id: "it-ends-with-us",     title: "It Ends With Us",             author: "Colleen Hoover",  cover: "ItEndsWithUs",                      status: "read",     slug: "it-ends-with-us"                  },
  { id: "it-starts-with-us",   title: "It Starts With Us",           author: "Colleen Hoover",  cover: "ItStartsWithUs",                    status: "read",     slug: "it-starts-with-us"                },

  // Read — Durjoy Datta
  { id: "if-not-forever-dd",     title: "If It's Not Forever, It's Not Love", author: "Durjoy Datta",    cover: "IfItsNotForeverItsNotLove",         status: "read",     slug: "if-its-not-forever-its-not-love-dd"   },
  { id: "someone-like-you-dd",   title: "Someone Like You",              author: "Durjoy Datta",    cover: "SomeoneLikeYou",                    status: "read",     slug: "someone-like-you-dd"                  },
  { id: "worlds-best-boyfriend", title: "World's Best Boyfriend",        author: "Durjoy Datta",    cover: "TheWorldsBestBoyfriend",            status: "read",     slug: "worlds-best-boyfriend"                },

  // Read — J.K. Rowling
  { id: "hp-1",                title: "Harry Potter and the Philosopher's Stone",    author: "J.K. Rowling", cover: "HarryPotterAndThePhilosophersStone",   status: "read", slug: "hp-philosophers-stone"    },
  { id: "hp-2",                title: "Harry Potter and the Chamber of Secrets",     author: "J.K. Rowling", cover: "HarryPotterAndTheChamberOfSecrets",    status: "read", slug: "hp-chamber-of-secrets"    },
  { id: "hp-3",                title: "Harry Potter and the Prisoner of Azkaban",    author: "J.K. Rowling", cover: "HarryPotterAndThePrisonerOfAzkaban",   status: "read", slug: "hp-prisoner-of-azkaban"   },
  { id: "hp-4",                title: "Harry Potter and the Goblet of Fire",         author: "J.K. Rowling", cover: "HarryPotterAndTheGobletOfFire",        status: "read", slug: "hp-goblet-of-fire"        },
  { id: "hp-5",                title: "Harry Potter and the Order of the Phoenix",   author: "J.K. Rowling", cover: "HarryPotterAndTheOrderOfThePhoenix",   status: "read", slug: "hp-order-of-the-phoenix"  },
  { id: "hp-6",                title: "Harry Potter and the Half Blood Prince",      author: "J.K. Rowling", cover: "HarryPotterAndTheHalfBloodPrince",     status: "read", slug: "hp-half-blood-prince"     },
  { id: "hp-7",                title: "Harry Potter and the Deathly Hallows",        author: "J.K. Rowling", cover: "HarryPotterAndTheDeathlyHallows",      status: "read", slug: "hp-deathly-hallows"       },
  { id: "hp-8",                title: "Harry Potter and the Cursed Child",           author: "J.K. Rowling", cover: "HarryPotterAndTheCursedChild",         status: "read", slug: "hp-cursed-child"          },

  // Read — Nicholas Sparks
  { id: "the-notebook",        title: "The Notebook",                author: "Nicholas Sparks", cover: "TheNotebook",                       status: "read",     slug: "the-notebook"                     },
  { id: "walk-to-remember",    title: "A Walk to Remember",          author: "Nicholas Sparks", cover: "AWalkToRemember",                   status: "read",     slug: "a-walk-to-remember"               },
  { id: "dear-john",           title: "Dear John",                   author: "Nicholas Sparks", cover: "DearJohn",                          status: "read",     slug: "dear-john"                        },
  { id: "message-in-bottle",   title: "Message in a Bottle",         author: "Nicholas Sparks", cover: "MessageInABottle",                  status: "read",     slug: "message-in-a-bottle"              },

  // Read — Nikita Singh
  { id: "if-not-forever-ns",     title: "If It's Not Forever, It's Not Love", author: "Nikita Singh",    cover: "IfItsNotForeverItsNotLove",         status: "read",     slug: "if-its-not-forever-its-not-love-ns"   },
  { id: "someone-like-you-ns",   title: "Someone Like You",              author: "Nikita Singh",    cover: "SomeoneLikeYou",                    status: "read",     slug: "someone-like-you-ns"                  },

  // Read — Polly Horvath
  { id: "everything-waffle",   title: "Everything on a Waffle",      author: "Polly Horvath",   cover: "EverythingOnAWaffle",               status: "read",     slug: "everything-on-a-waffle"           },

  // Read — Rick Riordan
  { id: "lightning-thief",     title: "The Lightning Thief",         author: "Rick Riordan",    cover: "TheLightningThief",                 status: "read",     slug: "the-lightning-thief"              },
  { id: "sea-of-monsters",     title: "The Sea of Monsters",         author: "Rick Riordan",    cover: "TheSeaOfMonsters",                  status: "read",     slug: "the-sea-of-monsters"              },
  { id: "titans-curse",        title: "The Titan's Curse",           author: "Rick Riordan",    cover: "TheTitansCurse",                    status: "read",     slug: "the-titans-curse"                 },
  { id: "battle-labyrinth",    title: "The Battle of the Labyrinth", author: "Rick Riordan",    cover: "TheBattleOfTheLabyrinth",           status: "read",     slug: "the-battle-of-the-labyrinth"      },
  { id: "last-olympian",       title: "The Last Olympian",           author: "Rick Riordan",    cover: "TheLastOlympian",                   status: "read",     slug: "the-last-olympian"                },

  // Read — Ravinder Singh
  { id: "i-too-had-a-love-story", title: "I Too Had a Love Story",      author: "Ravinder Singh",  cover: "ITooHadALoveStory",                 status: "read",     slug: "i-too-had-a-love-story"               },
  { id: "can-love-happen-twice",  title: "Can Love Happen Twice?",      author: "Ravinder Singh",  cover: "CanLoveHappenTwice",                status: "read",     slug: "can-love-happen-twice"                },

  // Read — Spencer Johnson
  { id: "who-moved-cheese",    title: "Who Moved My Cheese",         author: "Spencer Johnson", cover: "WhoMovedMyCheese",                  status: "read",     slug: "who-moved-my-cheese"              },

  // Read — Sudeep Nagarkar
  { id: "thats-way-we-met",    title: "That's The Way We Met",       author: "Sudeep Nagarkar", cover: "ThatsTheWayWeMet",                  status: "read",     slug: "thats-the-way-we-met"             },
  { id: "sorry-not-my-type",   title: "Sorry You're Not My Type",    author: "Sudeep Nagarkar", cover: "SorryYoureNotMyType",               status: "read",     slug: "sorry-youre-not-my-type"          },
  { id: "password-to-my-life", title: "You Are The Password To My Life", author: "Sudeep Nagarkar", cover: "YouAreThePasswordToMyLife",     status: "read",     slug: "you-are-the-password-to-my-life"  },
  { id: "few-things-unsaid",   title: "Few Things Left Unsaid",      author: "Sudeep Nagarkar", cover: "FewThingsLeftUnsaid",               status: "read",     slug: "few-things-left-unsaid"           },
  { id: "friend-request",      title: "It Started With A Friend Request", author: "Sudeep Nagarkar", cover: "ItStartedWithAFriendRequest", status: "read",     slug: "it-started-with-a-friend-request" },

  // Read — Suzanne Collins
  { id: "hunger-games",        title: "The Hunger Games",            author: "Suzanne Collins", cover: "TheHungerGames",                    status: "read",     slug: "the-hunger-games"                 },
  { id: "catching-fire",       title: "Catching Fire",               author: "Suzanne Collins", cover: "CatchingFire",                      status: "read",     slug: "catching-fire"                    },
  { id: "mockingjay",          title: "Mockingjay",                  author: "Suzanne Collins", cover: "Mockingjay",                        status: "read",     slug: "mockingjay"                       },
];
