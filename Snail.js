const readline = require("readline");

var ta;
var rl;

// Переменные цветов
var green = "\x1b[32m";
var white = "\x1b[37m";
var red = "\x1b[31m";
var cyan = "\x1b[36m";
var yellow = "\x1b[33m";

// Переменные для игры
var day = 7;
var night = -2;
var count = 0;
var gamecount = 0;
var depth;
var answer;
var wasanswer = false;
let way = 0;
var zombieChance = 0;
var alreadyZombie = false;
var dead = false;
var coin = 0;
var min = 1;
var max = 100;
let life = 72;

console.info(white, "🎮 Игра начата 'улитка'");
console.info("\n\n❔ О чём игра: \n");
console.info(
  "◼️ Маленькая улитка упала на дно колодца, и пытается выбраться наверх \n"
);
console.info(
  "◼️ Улитки долго не живут, всего то 72 дня, так что ей стоит поторопиться! \n"
);
console.info("\n\n❔ Что делать: \n");
console.info("◼️ Вы указываете глубину колодца \n");
console.info("◼️ А дальше просто смотрите и молитесь за жизнь улитки :) \n");
console.info(green, "\n🎁 Бонусы: \n");
console.info(
  "🚀 Джетпак: выталкивает улитку вверх на 25 м [Шанс 30% каждый день]\n"
);
console.info(
  "🧟‍♂️Зомби: Даёт улитке ещё одну жизнь (72 дня) [Шанс 20% в конце жизни улитки]\n"
);
console.info(
  "🍬 Конфета: Даёт улитке до 2 дополнительных жизней [Шанс 3% каждый день]\n"
);
console.info(cyan, "\n💠 Нейтральные предметы: \n");
console.info(
  "💊 Волшебная таблетка: С некоторым шансом может либо добавить жизни улитке либо убавить. [Шанс найти таблетку 7%]\n"
);
console.info(
  "🧿 Дыра в пространстве: Телепортирует улитку либо намного выше по колодцу, либо намного ниже [Шанс 5% каждый день]\n"
);
console.info(
  "🐌 Тяга к свободе: В зависимости подавлена улитка или чувствует решительность, меняется ёё количесво пройденого\n пути за день [Шанс 6% каждый день]\n"
);
console.info(red, "\n🪨 Препятствия и ловушки: \n");
console.info(
  "🪨 Камень: Может упасть на улитку и сдвинуть её либо немного ниже, либо сбросить на дно колодца. [Шанс 10% каждый день] [Шанс упасть на дно 37%]\n"
);
console.info(
  "🕳️ Ямка на стене: Может задержать улитку на одном и том же месте до 8 дней! [Шанс 6% каждый день]\n"
);
console.info(
  "💧 Дождь: Из-за него улитка может соскользнуть вниз [Шанс 4% каждый день]\n",
  white
);

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

// Глубина колодца
function Depth() {
  if (gamecount >= 1) {
    rl.close();
    ta.close();
  }
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("🔽 Введите глубину колодца (м)\n", function (datastore) {
    depth = datastore;
    depth = parseInt(depth, 10);
    console.clear();
    console.log("🔽 Глубина колодца: " + depth + " м");
    CountWay();
    rl.close();
  });
}

Depth();

// Сыграть ещё
function TryAgain() {
  if (wasanswer == true) {
    ta.close();
  }
  rl.close();
  ta = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  wasanswer = true;
  ta.question(
    "♻️ Хотите попробовать ещё раз?\n[1]/[Да]/[Yes]/[y]\n[2]/[Нет]/[No]/[n]\n",
    function (answerread) {
      answer = answerread;
      if (
        answer == 1 ||
        answer == "Да" ||
        answer == "да" ||
        answer == "y" ||
        answer == "Yes" ||
        answer == "yes"
      ) {
        depth = 0;
        life = 72;
        way = 0;
        day = 7;
        night = -2;
        count = 0;
        zombieChance = 0;
        alreadyZombie = false;
        dead = false;
        min = 1;
        max = 100;
        console.clear();
        Depth();
        return;
      } else if (
        answer == 2 ||
        answer == "Нет" ||
        answer == "нет" ||
        answer == "n" ||
        answer == "No" ||
        answer == "no"
      ) {
        console.log("🍂 Возвращайтесь ещё!");
        ta.close();
      } else {
        console.clear();
        TryAgain();
        console.log("❌ Пожалуйста, введите только доступные ответы \n");
        return;
      }
    }
  );
}

// Тяга к свободе
function Freedom(freedomChance, freedomDay, freedomNight) {
  if (freedomChance > 94) {
    day = freedomDay;
    night = freedomNight;
    console.log(
      `\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`
    );
    if (freedomDay < 0) {
      console.log(
        red,
        `\n~~ 🐌 Улитка выглядит подавленой. Теперь она ползёт каждый день ${yellow}${freedomDay}${red} м ~~`,
        white
      );
    } else if (freedomDay == 0) {
      console.log(
        cyan,
        `\n~~ 🐌 Улитка задумалась. Её отношение к происходящему не поменялось. ~~`,
        white
      );
    } else {
      console.log(
        green,
        `\n~~ 🐌 Улитка хочет на свободу ещё больше. Теперь она ползёт каждый день ${yellow}${freedomDay}${green} м ~~`,
        white
      );
    }
    if (freedomNight == 0) {
      console.log(
        green,
        `~~ 🐌 Улитка задумалась ещё раз. Она всё же хочет на свободу и не будет отдыхать ночью. ~~\n`,
        white
      );
    } else {
      console.log(
        red,
        `~~ 🐌 Улитка подумала, что ей ещё далеко. Она сползает каждую ночь что-бы отдохнуть на ${yellow}${freedomNight}${red} м вниз ~~\n`,
        white
      );
    }
    console.log(
      `\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`
    );
  }
}

// Дождь
function Rain(rainWay, rainWayChance) {
  if (rainWayChance > 96) {
    way = way - rainWay;
    console.log(
      `\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`
    );
    console.log(red, "\n~~ 💧 Начался дождь ~~");
    if (rainWay == 0) {
      console.log(
        cyan,
        `~~ 💧 Улитка пыталась держаться изо всех сил, и у неё это получилось! Она не сползла ни на метр ~~\n`,
        white
      );
    } else {
      console.log(
        `~~ 💧 Улитка попала под дождь и сползла на ${yellow}${rainWay}${red} м вниз ~~\n`,
        white
      );
    }
    console.log(
      `\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`
    );
  }
}

// Конфета
function Candy(candyLife, candyLifeChance) {
  if (candyLifeChance > 97) {
    life = life + candyLife;
    if (candyLife == 0) {
      console.log(
        cyan,
        `\n~~ 🍬 Конфета была конечно вкусной, но кажется, она ничего не дала... ~~\n`,
        white
      );
    } else {
      console.log(
        green,
        `\n~~ 🍬 Попробовав эту вкусную конфету, улитке захотелось жить на ${yellow}${candyLife}${green} день(дня) больше ~~\n`,
        white
      );
    }
  }
}

// Ямка на стене
function WallHole(wallHole, wallHoleChance) {
  if (wallHoleChance > 94) {
    count = count + wallHole;
    if (wallHole > 0) {
      console.log(
        red,
        `\n~~ 🕳️⏬ Вы попали в ямку на стене колодца и задержались там на${yellow}${wallHole}${red} дней ~~\n`,
        white
      );
    } else if (wallHole == 0) {
      console.log(
        cyan,
        `\n~~ 🕳️ Вы попали в ямку на стене колодца, но улитка сумела сразу выбраться от туда ~~\n`,
        white
      );
    }
  }
}

// Дыра в пространстве
function TimeHole(timeHole, timeHoleChance) {
  if (timeHoleChance > 95) {
    console.log(
      `\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`
    );
    console.log(cyan, `~~ 🧿 Оу.. Улитку засосало в дыру в пространстве... ~~`);
    way = way + timeHole;
    if (way < 0) {
      way = 0;
    }
    if (timeHole < 0) {
      console.log(
        red,
        `~~ 🧿⏬ Улитку выбросило из дыры на ${yellow}${timeHole}${red} м вниз, и теперь она проползла ${yellow}${way}${red} м ~~`,
        white
      );
    } else if (timeHole == 0) {
      console.log(
        cyan,
        `~~ 🧿 Хех, улитку выбросило назад из той же дыры и она осталась на том же месте ~~`,
        white
      );
    } else {
      console.log(
        green,
        `~~ 🧿⏫ Ого! Улитку выбросило из дыры на ${yellow}${timeHole}${green} м вверх! Теперь она проползла ${yellow}${way}${green} м ~~`,
        white
      );
    }
    console.log(
      `\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`
    );
  }
}

// Волшебная таблетка
function PillBuff(magicPill, magicPillChance) {
  if (magicPillChance > 93) {
    if (magicPill < 0) {
      console.log(
        red,
        `\n~~ 💊⏬Вы нашли плохую волшебную таблеточку. Вы будете жить на ${yellow}${magicPill}${red} дня меньше ~~\n`,
        white
      );
    } else if (magicPill == 0) {
      console.log(
        cyan,
        `\n~~ 💊Вы нашли таблетку пустышку. Кому вообще пришлов голову выпускать такие таблетки?  ~~\n`,
        white
      );
    } else {
      console.log(
        green,
        `\n~~ 💊⏫Вы нашли хорошую волшебную таблеточку. Вы будете жить ещё на ${yellow}${magicPill}${green} дня больше ~~\n`,
        white
      );
    }
    life = life + magicPill;
  }
}

// Джетпак
function JetPack(chance, boost) {
  if (chance > 70) {
    way = way + boost;
    console.log(
      green,
      `~~ 🚀 Улитка нашла джетпак и теперь она проползла ${yellow}${way}${green} м ~~\n`,
      white
    );
  }
}

// Камень
function Rock(rockChance, fallChance, depthFall) {
  if (rockChance > 90) {
    way = way - depthFall;
    console.log(
      `\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`
    );
    console.log(red, "~~ 🪨На Вас упал камень ~~");
    if (fallChance > 67) {
      console.log("~~ 🐌Улитка свалилась в самый низ ~~", white);
      way = 0;
    } else {
      console.log(
        cyan,
        "~~ 🧱Вы сумели зацепиться за стену и не упасть в самый низ  ~~",
        white
      );
    }
    console.log(
      `\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`
    );
  }
}

// Проверка ленивой улитки
function LazySnail() {
  if (day < night * -1) {
    night = 0;
    day = 0;
  }
  if (day == 0) {
    if (day < night) {
      night = 0;
      console.log(red, `~~ 🐌 Улитка не хочет никуда ползти... ~~\n`, white);
    }
  }
  if (night == day) {
    console.log(red, `~~ 🐌 Улитка не хочет никуда ползти... ~~\n`, white);
  }
  if ((day == 0 && night == 0) || day == night * -1) {
    console.log(red, `~~ 🐌 Улитка не хочет никуда ползти... ~~\n`, white);
  }
}

// Обсчёт монет
function Coins() {
  if (dead == false) {
    coin = Math.floor(coin + way * 0.05 + count * 0.25 + 50);
  } else {
    coin = Math.floor(coin + way * 0.05 + count * 0.25);
  }
}

// Основная функция рассчёта пути улитки и вывода сообщений
async function CountWay() {
  while (way < depth) {
    await timer(1000);
    if (count < life) {
      count++;
    } else {
      dead = true;

      break;
    }

    //

    Freedom(
      Math.floor(Math.random() * (max - min) + min),
      Math.floor(Math.random() * (20 - 0) + 0),
      Math.floor(Math.random() * (0 - -10) + -10)
    );
    LazySnail();
    Rain(
      Math.floor(Math.random() * (197 - 0) + 0),
      Math.floor(Math.random() * (max - min) + min)
    );
    Candy(
      Math.floor(Math.random() * (2 - 0) + 0),
      Math.floor(Math.random() * (max - min) + min)
    );
    WallHole(
      Math.floor(Math.random() * (8 - 0) + 0),
      Math.floor(Math.random() * (max - min) + min)
    );
    TimeHole(
      Math.floor(Math.random() * (250 - -100) + -100),
      Math.floor(Math.random() * (max - min) + min)
    );
    JetPack(Math.floor(Math.random() * (max - min) + min), 25);
    PillBuff(
      Math.floor(Math.random() * (10 - -5) + -5),
      Math.floor(Math.random() * (max - min) + min)
    );
    Rock(
      Math.floor(Math.random() * (max - min) + min),
      Math.floor(Math.random() * (max - min) + min),
      Math.floor(Math.random() * (50 - 5) + 5)
    );
    await timer(1000);

    if (way < 0) {
      way = 0;
    }
    way = way + day;
    console.log("☀️ День " + count + ": " + way + " м");
    if (way < depth) {
      way = way + night;
      console.log("🌙 Ночь " + count + ": " + way + " м");
    } else {
      break;
    }
  }

  if (dead == true) {
    zombieChance = Math.floor(Math.random() * (min - max + 1) + min) * -1;
    if (alreadyZombie == true) {
      gamecount++;
      Coins();
      console.log("\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n");
      console.log(
        "☠️🧟‍♂️ Улитка-зомби умерла на " + yellow + count + white + " дне"
      );
      console.log(`⏫ Всего улитка проползла ${yellow}${way}${white} м`);
      console.log("\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n");
      console.log(
        "🎮 Игра окончена\n❌ Вы проиграли!" + ` Всего игр: ${gamecount}`
      );
      console.log(`🪙 Вы заработали ${coin} монет`);
      TryAgain();
    } else {
      //  Зомби
      if (zombieChance > 80) {
        console.log(
          green,
          "~~ 🧟‍♂️ Вам повезло, и после смерти, Вы стали зомби! ~~",
          white
        );
        life = 72 * 2;
        alreadyZombie = true;
        dead = false;
        CountWay();
      } else {
        Coins();
        gamecount++;
        console.log("\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n");
        console.log("☠️ Улитка умерла на " + yellow + count + white + " дне");
        console.log(`⏫ Всего улитка проползла ${yellow}${way}${white} м`);
        console.log("\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n");
        console.log(
          "🎮 Игра окончена\n❌ Вы проиграли!" + ` Всего игр: ${gamecount}`
        );
        console.log(`🪙 Вы заработали ${coin} монет`);
        TryAgain();
      }
    }
  } else {
    Coins();
    gamecount++;
    console.log("\n========================================\n");
    console.log(
      "🛣️ Улитка выползла из колодца на:" + yellow + count + white + " дне"
    );
    console.log("\n========================================\n");
    console.log(
      "🎮 Игра окончена\n✔️ Вы выиграли!🎆" + ` Всего игр: ${gamecount}`
    );
    console.log(`🪙 Вы заработали ${coin} монет`);
    TryAgain();
  }
}
