"use client";

import { useEffect, useMemo, useState } from "react";

const wishes = [
  "Чтобы ты чаще смотрела на себя моими глазами и видела, какая ты красивая",
  "Чтобы идеи для новых ОС появлялись именно тогда, когда хочется творить",
  "Чтобы рядом оставались люди, с которыми не надо притворяться",
  "Чтобы сложные дни заканчивались быстрее, а хорошие длились подольше",
  "Чтобы любимая музыка всегда попадала прямо в настроение",
  "Чтобы у тебя хватало смелости выбирать себя и свои мечты",
  "Чтобы каждый новый образ получался ещё круче прошлого",
  "Чтобы поводов смеяться было намного больше, чем поводов грустить",
  "Чтобы ты никогда не сомневалась, что заслуживаешь любви и заботы",
  "Чтобы в твоей жизни было больше маленьких внезапных чудес",
  "Чтобы желания не лежали в заметках, а постепенно становились реальностью",
  "Чтобы ты гордилась собой даже за маленькие победы",
  "Чтобы у тебя всегда было место, где спокойно и безопасно",
  "Чтобы твоя фантазия никогда не заканчивалась",
  "Чтобы тринадцатое августа каждый год становилось ещё теплее",
  "Чтобы шестнадцатый год жизни стал началом чего-то реально прекрасного",
];

const reasons = [
  ["01", "Твой взгляд", "В нём может быть и нежность, и характер. И оба варианта мне безумно нравятся."],
  ["02", "Твоя фантазия", "Ты умеешь придумывать персонажей и миры, которые до тебя просто не существовали."],
  ["03", "Твоя улыбка", "Она может за несколько секунд сделать мой день намного лучше."],
  ["04", "Твоя настоящесть", "Ты не копия кого-то. Ты именно ты, и в этом вся магия."],
  ["05", "Твой характер", "Иногда милый, иногда боевой, но всегда живой и родной."],
  ["06", "Твой голос", "Его хочется слушать даже тогда, когда ты рассказываешь какую-то полную мелочь."],
  ["07", "Твоя забота", "Она чувствуется в деталях, которые ты сама можешь даже не замечать."],
  ["08", "Твои странности", "Да, именно они. С ними ты ещё интереснее и ближе."],
  ["09", "Твои мечты", "Мне нравится, как у тебя загораются глаза, когда ты говоришь о важном."],
  ["10", "Твоя красота", "Не только на фото. В движениях, эмоциях, привычках и в том, как ты существуешь."],
  ["11", "Твоя сила", "Ты проходишь через большее, чем иногда показываешь, и всё равно остаёшься собой."],
  ["12", "Твой юмор", "С тобой можно смеяться с вещей, которые больше никто вообще не поймёт."],
  ["13", "Твоя нежность", "Она редкая, настоящая и поэтому особенно ценная."],
  ["14", "Твой стиль", "Чёрный, фиолетовый, зелёный и твоя собственная атмосфера. Тебя ни с кем не перепутать."],
  ["15", "Наши моменты", "Даже обычный разговор становится воспоминанием, если он был с тобой."],
  ["16", "Просто ты", "Главная причина. Мне не нужна идеальная версия тебя. Мне нужна ты."],
];

const chapters = [
  { number: "I", title: "До тебя", text: "Мир был обычным. Дни шли, музыка играла, что-то происходило. Но в нём не было человека, сообщения которого ждёшь чуть сильнее остальных." },
  { number: "II", title: "Ты появилась", text: "И вместе с тобой появились новые шутки, переживания, улыбки, разговоры и это странно приятное чувство, когда кто-то становится по-настоящему важным." },
  { number: "III", title: "Сейчас", text: "Теперь у меня есть ты. Настоящая, красивая, творческая, иногда упрямая и очень любимая. Я не хочу воспринимать это как что-то обычное." },
  { number: "IV", title: "Дальше", text: "Я не знаю весь сюжет наперёд. Но очень хочу быть рядом в следующих главах, поддерживать тебя, смешить и напоминать, какая ты замечательная." },
];

const coupons = [
  ["01", "Объятие вне очереди", "Можно использовать в любой день и при любом настроении."],
  ["02", "Твой выбор фильма", "Я смотрю вместе с тобой и не ною из-за выбора."],
  ["03", "Час полного внимания", "Рассказывай всё, что накопилось. Я слушаю и никуда не отвлекаюсь."],
  ["04", "День маленьких желаний", "Выбираешь приятные мелочи, а я помогаю сделать этот день лучше."],
];

function getCountdown() {
  const target = new Date("2026-08-13T00:00:00+03:00").getTime();
  const distance = Math.max(0, target - Date.now());
  return {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance / 3600000) % 24),
    minutes: Math.floor((distance / 60000) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
}

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [wish, setWish] = useState<number | null>(null);
  const [reason, setReason] = useState(0);
  const [countdown, setCountdown] = useState(getCountdown);
  const [boostUsed, setBoostUsed] = useState(false);
  const [boostOpen, setBoostOpen] = useState(false);
  const [coupon, setCoupon] = useState<number | null>(null);

  useEffect(() => {
    setBoostUsed(window.localStorage.getItem("birthday-boost-13-08-2026") === "used");
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const particles = useMemo(() => Array.from({ length: 42 }, (_, index) => ({
    left: `${(index * 37) % 100}%`,
    delay: `${(index % 9) * 0.08}s`,
    color: index % 3 === 0 ? "#b9ff45" : index % 3 === 1 ? "#a875ff" : "#64f0b4",
  })), []);

  const takeBoost = () => {
    if (boostUsed) return;
    setBoostUsed(true);
    setBoostOpen(true);
    window.localStorage.setItem("birthday-boost-13-08-2026", "used");
  };

  return (
    <main className={entered ? "world entered" : "world"}>
      <div className="noise" aria-hidden="true" />
      <div className="aurora auroraOne" aria-hidden="true" />
      <div className="aurora auroraTwo" aria-hidden="true" />

      {!entered && (
        <section className="gate" aria-label="Открыть поздравление">
          <div className="gateHalo" aria-hidden="true"><span>16</span></div>
          <p className="eyebrow">PERSONAL GACHA STORY • 13.08.2026</p>
          <h1>Эта глава существует только для тебя</h1>
          <p className="gateText">Я собрал здесь всё, что иногда трудно сказать одним сообщением.</p>
          <button className="enterButton" onClick={() => setEntered(true)}><span>Войти в свою историю</span><b>♡</b></button>
          <p className="tiny">осторожно, внутри много любви и немного магии</p>
        </section>
      )}

      <div className="siteShell">
        <header className="topbar">
          <a className="mark" href="#top">LVL<span>16</span></a>
          <p>Личная глава • создана с любовью</p>
          <a href="#letter">13 августа</a>
        </header>

        <section className="hero" id="top">
          <div className="portraitCard">
            <div className="photoFrame">
              <img src="/her-photo.jpg" alt="Любимая девушка у воды" />
              <span className="scanline" aria-hidden="true" />
              <div className="rarity">ONE OF ONE</div>
              <div className="levelBadge"><small>LEVEL</small><strong>16</strong></div>
            </div>
            <p className="photoCaption">главная героиня моей любимой истории ♡</p>
          </div>

          <div className="heroCopy">
            <p className="eyebrow"><span>●</span> НОВАЯ ГЛАВА ОТКРЫТА</p>
            <h2>С днём рождения,<br /><em>моя любимая</em></h2>
            <p className="lead">13 августа тебе исполняется 16. Я хотел сделать не просто открытку, которую посмотрят один раз, а маленький мир про тебя. Про твою красоту, фантазию, характер и про то, как много ты для меня значишь.</p>
            <div className="heroActions">
              <a className="primaryAction" href="#countdown">Начать историю <span>↓</span></a>
              <a className="ghostAction" href="#boost">Забрать буст</a>
            </div>
          </div>

          <aside className="ocCard">
            <div className="ocGlow" aria-hidden="true" />
            <p className="ocTag">ТВОЙ ОС • ХРАНИТЕЛЬ ГЛАВЫ</p>
            <img src="/gacha-oc.png" alt="Её персонаж Gacha" />
            <div className="speech">Квесты сегодня отменяются. Главная миссия, улыбаться и принимать любовь!</div>
          </aside>
        </section>

        <section className="countdownSection" id="countdown">
          <div className="sectionLabel"><span>01</span><p>ДО ТВОЕГО ДНЯ</p></div>
          <div className="countdownPanel">
            <div><strong>{String(countdown.days).padStart(2, "0")}</strong><span>дней</span></div>
            <div><strong>{String(countdown.hours).padStart(2, "0")}</strong><span>часов</span></div>
            <div><strong>{String(countdown.minutes).padStart(2, "0")}</strong><span>минут</span></div>
            <div><strong>{String(countdown.seconds).padStart(2, "0")}</strong><span>секунд</span></div>
            <p>13 • 08 • 2026</p>
          </div>
        </section>

        <section className="storySection">
          <div className="sectionLabel"><span>02</span><p>НАША ИСТОРИЯ В ЧЕТЫРЁХ ГЛАВАХ</p></div>
          <div className="chapterGrid">
            {chapters.map((chapter) => <article className="chapterCard" key={chapter.number}><span>{chapter.number}</span><h3>{chapter.title}</h3><p>{chapter.text}</p></article>)}
          </div>
        </section>

        <section className="reasonsSection">
          <div className="sectionLabel"><span>03</span><p>16 ПРИЧИН, ПОЧЕМУ ТЫ ОСОБЕННАЯ</p></div>
          <div className="reasonShowcase">
            <div className="reasonPortrait"><img src="/her-photo.jpg" alt="Портрет любимой девушки" /><b>{reasons[reason][0]}</b></div>
            <div className="reasonCopy"><small>ПРИЧИНА {reasons[reason][0]} / 16</small><h3>{reasons[reason][1]}</h3><p>{reasons[reason][2]}</p><div className="reasonNav"><button onClick={() => setReason((reason + 15) % 16)}>←</button><span>{reason + 1} из 16</span><button onClick={() => setReason((reason + 1) % 16)}>→</button></div></div>
            <div className="reasonDots">{reasons.map((item, index) => <button className={index === reason ? "active" : ""} key={item[0]} onClick={() => setReason(index)} aria-label={`Причина ${index + 1}`}>{item[0]}</button>)}</div>
          </div>
        </section>

        <section className="messageSection" id="letter">
          <div className="sectionLabel"><span>04</span><p>ТО, ЧТО Я ХОЧУ СКАЗАТЬ ТЕБЕ</p></div>
          <div className="messageCard">
            <p className="quoteMark">“</p>
            <h3>Мне правда повезло, что именно ты появилась в моей жизни</h3>
            <div className="messageText">
              <p>Мне нравится в тебе не что-то одно. Мне нравится, как ты думаешь, как создаёшь своих персонажей, как можешь быть смешной, серьёзной, милой и упрямой. Ты настоящая. Рядом с тобой даже обычные разговоры ощущаются важными, потому что они наши.</p>
              <p>Я не обещаю, что каждый день будет идеальным. Но я хочу быть человеком, который замечает твоё настроение, слушает твои истории, радуется твоим победам и остаётся рядом, когда всё идёт не по плану. Ты не обязана быть удобной или всегда весёлой, чтобы я тебя любил.</p>
              <p>В свои шестнадцать ты открываешь новую главу. Я хочу, чтобы в ней было больше свободы, уверенности, творчества и моментов, которые захочется сохранить. И чтобы ты никогда не забывала, насколько ты ценная.</p>
              <p>Спасибо тебе за то, что ты есть. За твой голос, сообщения, идеи, эмоции и даже за те моменты, когда ты вредничаешь. Всё это делает тебя тобой. А именно тебя я и люблю.</p>
            </div>
            <p className="signature">с любовью, твой человек ♡</p>
          </div>
        </section>

        <section className="wishesSection" id="wishes">
          <div className="sectionLabel"><span>05</span><p>16 КРИСТАЛЛОВ ЖЕЛАНИЙ</p></div>
          <div className="wishesHeading"><h3>Выбери любой кристалл</h3><p>В каждом спрятано отдельное пожелание для твоего шестнадцатого года.</p></div>
          <div className="crystalGrid">{wishes.map((text, index) => <button className={wish === index ? "crystal active" : "crystal"} key={text} onClick={() => setWish(index)}><span>{index + 1}</span></button>)}</div>
          <div className={wish === null ? "wishReveal" : "wishReveal visible"}><small>{wish === null ? "КРИСТАЛЛ ЖДЁТ" : `ЖЕЛАНИЕ ${String(wish + 1).padStart(2, "0")}`}</small><p>{wish === null ? "Нажми на кристалл, чтобы раскрыть его" : wishes[wish]}</p></div>
        </section>

        <section className="boostSection" id="boost">
          <div className="boostVisual"><div className="boostRing"><img src="/gacha-oc.png" alt="Gacha персонаж держит буст" /></div><span className="boostPlus">+16</span></div>
          <div className="boostCopy"><p className="eyebrow">ОДНОРАЗОВЫЙ ЛЕГЕНДАРНЫЙ ПРЕДМЕТ</p><h3>Буст хорошего настроения</h3><p>Даёт +100 к ощущению, что ты красивая, любимая и невероятно важная. Срабатывает один раз, зато эффект остаётся надолго.</p><button className={boostUsed ? "boostButton used" : "boostButton"} onClick={takeBoost} disabled={boostUsed}>{boostUsed ? "БУСТ УЖЕ ТВОЙ ✓" : "ЗАБРАТЬ ЕДИНСТВЕННЫЙ БУСТ"}</button>{boostUsed && <small>Одного буста тебе хватит. Не забывай, что я у тебя один ♡</small>}</div>
        </section>

        <section className="couponSection">
          <div className="sectionLabel"><span>06</span><p>ПОДАРКИ, КОТОРЫЕ НЕ ЗАКАНЧИВАЮТСЯ</p></div>
          <div className="couponGrid">{coupons.map((item, index) => <button className={coupon === index ? "coupon active" : "coupon"} key={item[0]} onClick={() => setCoupon(index)}><small>COUPON • {item[0]}</small><strong>{item[1]}</strong><span>{item[2]}</span><b>{coupon === index ? "АКТИВИРОВАНО ♡" : "НАЖМИ, ЧТОБЫ ВЫБРАТЬ"}</b></button>)}</div>
        </section>

        <section className="finalSection">
          <img src="/gacha-oc.png" alt="Gacha персонаж" />
          <p className="eyebrow">FINAL MESSAGE</p>
          <h3>В любом мире<br />я бы всё равно выбрал тебя</h3>
          <p>С шестнадцатилетием, моя любимая. Пусть 13 августа станет началом твоей самой красивой главы.</p>
          <div className="finalDate">13 • 08 • 2026</div>
        </section>

        <footer><img src="/gacha-oc.png" alt="" /><p>Этот сайт существует в одном экземпляре. Как и ты.</p><span>Сделано с любовью • 13 августа 2026</span></footer>
      </div>

      {boostOpen && <div className="boostCelebration" role="dialog" aria-modal="true" aria-label="Буст активирован">{particles.map((particle, index) => <i key={index} style={{ left: particle.left, animationDelay: particle.delay, background: particle.color }} />)}<div className="boostModal"><button onClick={() => setBoostOpen(false)}>×</button><div className="boostHeart">♡</div><p className="eyebrow">BOOST ACTIVATED</p><h2>+100 К СЧАСТЬЮ</h2><strong>Теперь официально: ты самая любимая девушка в этом мире.</strong><span>Одного буста тебе хватит. Не забывай, что я у тебя один ♡</span><button className="primaryAction" onClick={() => setBoostOpen(false)}>Сохранить эффект</button></div></div>}
    </main>
  );
}
