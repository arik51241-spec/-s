"use client";

import { useEffect, useMemo, useState } from "react";

const birthday = new Date("2026-08-13T00:00:00+03:00").getTime();

const reasons = [
  ["Твой взгляд", "В нём одновременно нежность, характер и целая вселенная."],
  ["Твоя фантазия", "Ты создаёшь персонажей и истории, которых до тебя не существовало."],
  ["Твоя улыбка", "Она умеет сделать мой день лучше за несколько секунд."],
  ["Твоя настоящесть", "Ты не копия кого-то. Ты именно ты, и в этом вся магия."],
  ["Твой характер", "Иногда милый, иногда боевой, но всегда живой и родной."],
  ["Твой голос", "Его хочется слушать, даже когда ты рассказываешь полную мелочь."],
  ["Твоя забота", "Она чувствуется в деталях, которые ты сама можешь не замечать."],
  ["Твои странности", "Да, именно они. С ними ты ещё интереснее и ближе."],
  ["Твои мечты", "Мне нравится, как у тебя загораются глаза, когда ты говоришь о важном."],
  ["Твоя красота", "Не только на фото. В движениях, эмоциях и привычках."],
  ["Твоя сила", "Ты проходишь через большее, чем иногда показываешь."],
  ["Твой юмор", "С тобой можно смеяться с того, что больше никто не поймёт."],
  ["Твоя нежность", "Редкая, настоящая и поэтому особенно ценная."],
  ["Твой стиль", "Чёрный, фиолетовый, зелёный и твоя собственная атмосфера."],
  ["Наши моменты", "Даже обычный разговор становится воспоминанием, если он был с тобой."],
  ["Просто ты", "Главная причина. Мне не нужна идеальная версия тебя. Мне нужна ты."],
];

const wishes = [
  "Чаще видеть себя моими глазами и понимать, какая ты красивая",
  "Создавать новых ОС именно тогда, когда хочется творить",
  "Иметь рядом людей, с которыми не надо притворяться",
  "Чтобы сложные дни заканчивались быстро, а хорошие длились дольше",
  "Всегда находить музыку, которая попадает прямо в настроение",
  "Смело выбирать себя и свои мечты",
  "Гордиться даже маленькими победами",
  "Никогда не сомневаться, что ты заслуживаешь любви и заботы",
  "Получать больше приятных сюрпризов без повода",
  "Чтобы желания становились планами, а планы реальностью",
  "Не терять свою невероятную фантазию",
  "Чаще смеяться до боли в щеках",
  "Всегда иметь место, где спокойно и безопасно",
  "Находить вдохновение в самых неожиданных вещах",
  "Каждый год встречать 13 августа с улыбкой",
  "Чтобы шестнадцатый год стал началом чего-то прекрасного",
];

const memories = [
  ["Первое сообщение", "Тот самый маленький момент, после которого началась наша история."],
  ["Первый смех", "Когда стало понятно, что у нас есть свой особенный юмор."],
  ["Первое «скучаю»", "Короткое слово, которое вдруг стало значить очень много."],
  ["Разговоры допоздна", "Когда время исчезает, потому что с тобой не хочется заканчивать разговор."],
  ["Твои ОС", "Каждый новый персонаж будто открывает ещё одну комнату в твоём мире."],
  ["Поддержка", "Моменты, когда одного сообщения было достаточно, чтобы стало легче."],
  ["Наши приколы", "Архив шуток, которые без объяснений понимаем только мы."],
  ["Прямо сейчас", "Ещё одна точка на карте. И точно не последняя."],
];

const chapters = [
  ["I", "До тебя", "Дни просто шли один за другим. Но в них ещё не было человека, сообщения которого ждёшь чуть сильнее остальных."],
  ["II", "Ты появилась", "Вместе с тобой появились новые шутки, переживания, улыбки и то приятное чувство, когда кто-то становится важным."],
  ["III", "Мы сейчас", "У меня есть настоящая, красивая, творческая, иногда упрямая и очень любимая ты. Я не хочу воспринимать это как что-то обычное."],
  ["IV", "Дальше", "Я не знаю весь сюжет наперёд, но хочу быть рядом в следующих главах, поддерживать, смешить и напоминать, какая ты замечательная."],
];

const coupons = [
  ["Объятие вне очереди", "Можно активировать в любой день и при любом настроении."],
  ["Твой выбор фильма", "Смотрю вместе с тобой и не ною из-за выбора."],
  ["Час полного внимания", "Рассказывай всё, что накопилось. Я слушаю и не отвлекаюсь."],
  ["День маленьких желаний", "Ты выбираешь приятные мелочи, а я помогаю сделать день лучше."],
  ["Антигрустинка", "Экстренная помощь мемами, заботой и добрыми словами."],
  ["Свидание по твоему сценарию", "Место, музыка и настроение выбирает главная героиня."],
  ["Ночная прогулка", "Когда хочется воздуха, разговоров и немного красивой тишины."],
  ["Новый ОС вместе", "Придумаем историю, способности и самую безумную деталь персонажа."],
];

const promises = [
  "Слушать тебя, а не просто ждать своей очереди говорить",
  "Замечать, когда тебе нужна поддержка",
  "Уважать твои границы, настроение и личное пространство",
  "Радоваться твоим победам так, будто они мои",
  "Не обесценивать то, что для тебя важно",
  "Продолжать выбирать тебя не только сегодня",
];

function getCountdown() {
  const distance = Math.max(0, birthday - Date.now());
  return {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance / 3600000) % 24),
    minutes: Math.floor((distance / 60000) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
}

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [countdown, setCountdown] = useState(getCountdown);
  const [reason, setReason] = useState(0);
  const [wish, setWish] = useState<number | null>(null);
  const [memory, setMemory] = useState(0);
  const [coupon, setCoupon] = useState<number | null>(null);
  const [boostUsed, setBoostUsed] = useState(false);
  const [boostOpen, setBoostOpen] = useState(false);
  const [secretTaps, setSecretTaps] = useState(0);

  useEffect(() => {
    setBoostUsed(localStorage.getItem("birthday-boost-13-08-2026") === "used");
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const confetti = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    left: `${(i * 37) % 100}%`,
    delay: `${(i % 10) * 0.09}s`,
    color: i % 3 === 0 ? "#baff52" : i % 3 === 1 ? "#a875ff" : "#60efb1",
  })), []);

  const takeBoost = () => {
    if (boostUsed) return;
    localStorage.setItem("birthday-boost-13-08-2026", "used");
    setBoostUsed(true);
    setBoostOpen(true);
  };

  return (
    <main className={`world ${entered ? "entered" : "locked"}`}>
      <div className="noise" aria-hidden="true" />
      {!entered && (
        <section className="gate">
          <div className="gateOrb"><span>16</span></div>
          <p className="eyebrow">PERSONAL GACHA STORY • 13.08.2026</p>
          <h1>Эта глава существует только для тебя</h1>
          <p>Я собрал здесь всё, что иногда трудно сказать одним сообщением.</p>
          <button className="primary" onClick={() => setEntered(true)}>Войти в свою историю <b>♡</b></button>
          <small>осторожно: внутри много любви, магии и наших приколов</small>
        </section>
      )}

      <div className="shell">
        <header className="topbar">
          <a href="#top" className="logo">LVL<span>16</span></a>
          <nav aria-label="Навигация">
            <a href="#reasons">16 причин</a><a href="#memories">моменты</a><a href="#letter">письмо</a><a href="#boost">буст</a>
          </nav>
          <a className="dateLink" href="#final">13 августа</a>
        </header>

        <section className="hero" id="top">
          <div className="portraitCard">
            <img src="/her-photo.jpg" alt="Любимая девушка у воды" />
            <span className="rarity">ONE OF ONE</span>
            <div className="level"><small>LEVEL</small><b>16</b></div>
            <p>главная героиня моей любимой истории ♡</p>
          </div>
          <div className="heroCopy">
            <p className="eyebrow"><i /> НОВАЯ ГЛАВА ОТКРЫТА</p>
            <h2>С днём рождения,<em>моя любимая</em></h2>
            <p className="lead">13 августа тебе исполняется 16. Это не просто открытка, которую посмотрят один раз, а целый маленький мир про тебя: твою красоту, фантазию, характер и то, как много ты для меня значишь.</p>
            <div className="heroButtons"><a className="primary" href="#countdown">Начать историю ↓</a><a className="secondary" href="#boost">Забрать буст</a></div>
          </div>
          <aside className="ocCard">
            <span>ТВОЙ ОС • ХРАНИТЕЛЬ ГЛАВЫ</span>
            <img src="/gacha-oc.png" alt="Её персонаж Gacha" />
            <p>Квесты сегодня отменяются. Главная миссия: улыбаться и принимать любовь!</p>
          </aside>
        </section>

        <section className="section countdown" id="countdown">
          <div className="sectionHead"><span>01</span><p>ДО ТВОЕГО ДНЯ</p></div>
          <div className="countGrid">
            {Object.entries(countdown).map(([key, value]) => <div key={key}><strong>{String(value).padStart(2, "0")}</strong><span>{{days:"дней",hours:"часов",minutes:"минут",seconds:"секунд"}[key as keyof typeof countdown]}</span></div>)}
          </div>
          <p className="centerNote">13 • 08 • 2026 — день, когда миру особенно повезло</p>
        </section>

        <section className="section profile">
          <div className="sectionHead"><span>02</span><p>КАРТОЧКА ГЛАВНОЙ ГЕРОИНИ</p></div>
          <div className="profileGrid">
            <div className="profileTitle"><small>LEGENDARY CHARACTER</small><h3>Девушка,<br />которую нельзя повторить</h3><p>Редкость: единственная во всех вселенных</p></div>
            <div className="stats">
              {[['Красота',100],['Фантазия',999],['Характер',96],['Милота',100],['Уникальность',100]].map(([name,value]) => <div key={String(name)}><span>{name}</span><b>{value}%</b><i><em style={{width:`${Math.min(Number(value),100)}%`}} /></i></div>)}
            </div>
            <div className="passive"><span>ПАССИВНЫЙ НАВЫК</span><strong>«Сделать мой день лучше»</strong><p>Активируется автоматически после одного сообщения, улыбки или просто появления рядом.</p></div>
          </div>
        </section>

        <section className="section chapters">
          <div className="sectionHead"><span>03</span><p>НАША ИСТОРИЯ В ЧЕТЫРЁХ ГЛАВАХ</p></div>
          <div className="chapterGrid">{chapters.map(([num,title,text]) => <article key={num}><span>{num}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </section>

        <section className="section reasons" id="reasons">
          <div className="sectionHead"><span>04</span><p>16 ПРИЧИН, ПОЧЕМУ ТЫ ОСОБЕННАЯ</p></div>
          <div className="reasonStage">
            <div className="reasonPhoto"><img src="/her-photo.jpg" alt="Портрет любимой" /><b>{reasons[reason][0]}</b></div>
            <div className="reasonText"><small>ПРИЧИНА {String(reason + 1).padStart(2,"0")} / 16</small><h3>{reasons[reason][1]}</h3><p>{reasons[reason][2]}</p><div><button onClick={() => setReason((reason + 15) % 16)} aria-label="Предыдущая причина">←</button><button onClick={() => setReason((reason + 1) % 16)} aria-label="Следующая причина">→</button></div></div>
            <div className="reasonDots">{reasons.map((_,i) => <button key={i} className={i === reason ? "active" : ""} onClick={() => setReason(i)}>{String(i+1).padStart(2,"0")}</button>)}</div>
          </div>
        </section>

        <section className="section memories" id="memories">
          <div className="sectionHead"><span>05</span><p>СОЗВЕЗДИЕ НАШИХ МОМЕНТОВ</p></div>
          <div className="memoryWorld">
            <div className="memoryMap" aria-label="Карта воспоминаний">{memories.map((item,i) => <button key={item[0]} className={i === memory ? "active" : ""} onClick={() => setMemory(i)} style={{"--x":`${12 + (i * 29) % 78}%`,"--y":`${13 + (i * 41) % 72}%`} as React.CSSProperties}><i /> <span>{String(i+1).padStart(2,"0")}</span></button>)}</div>
            <div className="memoryCard"><small>ВОСПОМИНАНИЕ {String(memory+1).padStart(2,"0")}</small><h3>{memories[memory][0]}</h3><p>{memories[memory][1]}</p><span>Нажимай на звёзды, здесь спрятано больше</span></div>
          </div>
        </section>

        <section className="section ocPassport">
          <div className="sectionHead"><span>06</span><p>ПАСПОРТ ТВОЕГО ОС</p></div>
          <div className="passport">
            <div className="ocPortrait"><img src="/gacha-oc.png" alt="Gacha OC в полный рост" /><span>MYTHIC</span></div>
            <div className="ocInfo"><small>CLASS: HEART GUARDIAN</small><h3>Хранительница<br />фиолетовой луны</h3><ul><li><b>Стихия</b><span>неоновая магия</span></li><li><b>Оружие</b><span>характер + хвост</span></li><li><b>Способность</b><span>превращать грусть в сюжет</span></li><li><b>Слабость</b><span>милые сообщения</span></li></ul><blockquote>«Если мир скучный, я просто добавлю в него рога, крылья и немного фиолетового»</blockquote></div>
          </div>
        </section>

        <section className="section compatibility">
          <div className="sectionHead"><span>07</span><p>РЕЗУЛЬТАТ СКАНИРОВАНИЯ</p></div>
          <div className="scanCard"><div className="scanNumber"><strong>100</strong><span>%</span></div><div><p className="eyebrow">СОВМЕСТИМОСТЬ ПОДТВЕРЖДЕНА</p><h3>Ты + я = моя любимая сюжетная линия</h3><p>Совпадение по юмору, заботе, странностям и желанию быть рядом. Ошибка измерения: невозможна.</p></div><img src="/gacha-oc.png" alt="Gacha персонаж" /></div>
        </section>

        <section className="section wishes">
          <div className="sectionHead"><span>08</span><p>16 КРИСТАЛЛОВ ЖЕЛАНИЙ</p></div>
          <p className="intro">В каждом спрятано отдельное пожелание. Открой их все, когда захочется немного тепла.</p>
          <div className="crystals">{wishes.map((item,i) => <button key={item} className={wish === i ? "active" : ""} onClick={() => setWish(i)} aria-label={`Открыть желание ${i+1}`}><i /><span>{String(i+1).padStart(2,"0")}</span></button>)}</div>
          <div className="wishReveal"><small>{wish === null ? "ВЫБЕРИ КРИСТАЛЛ" : `ЖЕЛАНИЕ ${String(wish+1).padStart(2,"0")}`}</small><p>{wish === null ? "Твоё следующее доброе предсказание ждёт прикосновения" : wishes[wish]}</p></div>
        </section>

        <section className="section letter" id="letter">
          <div className="sectionHead"><span>09</span><p>ТО, ЧТО Я ХОЧУ ТЕБЕ СКАЗАТЬ</p></div>
          <article className="letterPaper"><span className="quote">“</span><p>Моя любимая, сегодня тебе 16. И мне хочется, чтобы ты не просто услышала «с днём рождения», а правда почувствовала, насколько ты важна.</p><p>Мне нравится твоя фантазия, твои персонажи, твой стиль и то, как ты можешь придумать целую вселенную из одной маленькой идеи. Но сильнее всего мне нравится не образ и не идеальная картинка. Мне нравишься настоящая ты — со своим характером, эмоциями, странными шутками, мечтами и днями, когда всё получается не сразу.</p><p>Я хочу, чтобы в шестнадцать ты чаще выбирала то, что делает счастливой именно тебя. Чтобы не сравнивала себя с другими и помнила: тебе не нужно становиться удобнее, тише или «правильнее», чтобы заслуживать любовь.</p><p>Спасибо за каждый разговор, каждую улыбку и за то, что впустила меня в свой мир. Я не обещаю идеальную сказку без сложных моментов. Зато обещаю стараться быть человеком, рядом с которым можно быть собой.</p><p>Пусть новый уровень принесёт вдохновение, людей, которые тебя ценят, смелость для мечтаний и очень много причин улыбаться. А я хочу быть рядом, видеть все твои новые версии и каждый раз влюбляться в них заново.</p><footer><strong>С любовью, твой человек</strong><span>13 августа 2026</span></footer></article>
        </section>

        <section className="section promises">
          <div className="sectionHead"><span>10</span><p>ШЕСТЬ ОБЕЩАНИЙ НА СЛЕДУЮЩУЮ ГЛАВУ</p></div>
          <div className="promiseGrid">{promises.map((item,i) => <article key={item}><span>0{i+1}</span><p>{item}</p><b>♡</b></article>)}</div>
        </section>

        <section className="section boost" id="boost">
          <div className="boostVisual"><div className="boostRing"><img src="/gacha-oc.png" alt="Персонаж внутри магического буста" /><span>+16</span></div></div>
          <div className="boostCopy"><p className="eyebrow">ОДНОРАЗОВЫЙ ЛЕГЕНДАРНЫЙ БУСТ</p><h3>Буст хорошего настроения</h3><p>После активации экран взорвётся конфетти, а ты получишь +16 к улыбке, +100 к уверенности и бесконечную защиту от грусти.</p><button className={`boostButton ${boostUsed ? "used" : ""}`} onClick={takeBoost} disabled={boostUsed}>{boostUsed ? "БУСТ УЖЕ ЗАБРАН ♡" : "АКТИВИРОВАТЬ БУСТ"}</button><small>Только один раз. Потому что ты тоже одна такая.</small></div>
        </section>

        <section className="section coupons">
          <div className="sectionHead"><span>11</span><p>ПОДАРКИ, КОТОРЫЕ НЕ ЗАКАНЧИВАЮТСЯ</p></div>
          <div className="couponGrid">{coupons.map(([title,text],i) => <button key={title} className={coupon === i ? "active" : ""} onClick={() => setCoupon(i)}><small>КУПОН {String(i+1).padStart(2,"0")}</small><strong>{title}</strong><span>{text}</span><b>{coupon === i ? "АКТИВИРОВАНО ♡" : "НАЖМИ, ЧТОБЫ ВЫБРАТЬ"}</b></button>)}</div>
        </section>

        <section className="section secret">
          <button onClick={() => setSecretTaps(v => Math.min(v+1,7))} aria-label="Секретное сердце"><span>♡</span></button>
          <div><p className="eyebrow">СЕКРЕТНЫЙ КВЕСТ • {secretTaps}/7</p><h3>{secretTaps < 7 ? "Нажми на сердце семь раз" : "Секрет найден: я люблю тебя сильнее, чем помещается на этом сайте"}</h3><p>{secretTaps < 7 ? "Самые любопытные героини всегда получают дополнительную награду." : "+999 к обнимашкам и пожизненный доступ к моей заботе."}</p></div>
        </section>

        <section className="final" id="final">
          <img src="/gacha-oc.png" alt="Персонаж поздравляет с днём рождения" />
          <p className="eyebrow">КОНЕЦ ЭТОЙ СТРАНИЦЫ • НАЧАЛО НОВОЙ ГЛАВЫ</p>
          <h3>С шестнадцатилетием,<br />моя любимая</h3>
          <p>Ты мой любимый человек, моя самая красивая случайность и история, которую я хочу продолжать.</p>
          <span>13 • 08 • 2026</span>
          <button className="finalHeart" onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>♡ перечитать всё сначала</button>
        </section>
      </div>

      {boostOpen && <div className="boostCelebration">{confetti.map((p,i) => <i key={i} style={{left:p.left,animationDelay:p.delay,background:p.color}} />)}<div className="boostModal"><button onClick={() => setBoostOpen(false)} aria-label="Закрыть">×</button><div className="boostHeart">♡</div><p className="eyebrow">БУСТ УСПЕШНО АКТИВИРОВАН</p><h2>+16 К СЧАСТЬЮ</h2><strong>Соси… чупа-чупс 😈 Одного буста тебе хватит. Не забывай, что я у тебя один ♡</strong><span>Этот буст запомнен на устройстве и второй раз не выдаётся.</span><button className="primary" onClick={() => setBoostOpen(false)}>Забрать эффект</button></div></div>}
    </main>
  );
}
