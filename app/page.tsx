"use client";

import { useEffect, useState } from "react";
import { PixelArena } from "../components/PixelArena";

const wishes = [
  "Больше дней, после которых хочется улыбаться",
  "Смелости быть собой, даже если кто-то не понимает",
  "Вдохновения для новых персонажей и историй",
  "Людей рядом, с которыми можно не притворяться",
  "Музыки, которая попадает прямо в настроение",
  "Тёплых объятий именно тогда, когда они нужны",
  "Уверенности в себе и своих идеях",
  "Маленьких чудес в самых обычных днях",
  "Побольше моментов, которые захочется запомнить",
  "Спокойствия, когда вокруг всё слишком громко",
  "Смешных историй, которые потом станут любимыми",
  "Желаний, которые однажды станут реальностью",
  "Свободы создавать свой мир по своим правилам",
  "Удачи в важных выборах",
  "Чувства, что тебя любят и ценят",
  "И самого классного шестнадцатого года жизни",
];

const stats = [
  ["Красота", 100],
  ["Характер", 97],
  ["Фантазия", 100],
  ["Уникальность", 999],
];

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [wish, setWish] = useState<number | null>(null);
  const [secretOpen, setSecretOpen] = useState(false);

  useEffect(() => {
    if (!entered) return;
    const timer = window.setTimeout(() => {
      document.getElementById("birthday-world")?.focus();
    }, 500);
    return () => window.clearTimeout(timer);
  }, [entered]);

  return (
    <main className={entered ? "world entered" : "world"}>
      <div className="noise" aria-hidden="true" />
      <div className="aurora auroraOne" aria-hidden="true" />
      <div className="aurora auroraTwo" aria-hidden="true" />

      {!entered && (
        <section className="gate" aria-label="Начало поздравления">
          <div className="gateHalo" aria-hidden="true"><span>16</span></div>
          <p className="eyebrow">MYTHIC EVENT • 22.07</p>
          <h1>Для самой особенной девушки</h1>
          <p className="gateText">Я сделал для тебя маленький мир. Нажми, чтобы войти.</p>
          <button className="enterButton" onClick={() => setEntered(true)}>
            <span>Открыть поздравление</span>
            <b aria-hidden="true">↗</b>
          </button>
          <p className="tiny">лучше смотреть со звуком в голове и улыбкой на лице</p>
        </section>
      )}

      <div className="siteShell" id="birthday-world" tabIndex={-1}>
        <header className="topbar">
          <a className="mark" href="#top" aria-label="В начало">LVL<span>16</span></a>
          <p>Личная история • только для тебя</p>
          <a href="#wishes">16 желаний</a>
        </header>

        <section className="hero" id="top">
          <div className="portraitCard">
            <div className="photoFrame">
              <img src="/her-photo.jpg" alt="Любимая девушка у воды" />
              <span className="scanline" aria-hidden="true" />
              <div className="rarity">MYTHIC</div>
              <div className="levelBadge"><small>LEVEL</small><strong>16</strong></div>
            </div>
            <p className="photoCaption">главная героиня этого мира ♡</p>
          </div>

          <div className="heroCopy">
            <p className="eyebrow"><span>●</span> НОВАЯ ГЛАВА ОТКРЫТА</p>
            <h2>С днём рождения,<br /><em>моя любимая</em></h2>
            <p className="lead">
              Сегодня тебе 16. Я очень хочу, чтобы этот год был не просто ещё одной цифрой,
              а временем, когда сбываются твои идеи, рядом остаются нужные люди,
              а ты всё чаще смотришь на себя и понимаешь, какая ты классная.
            </p>
            <div className="heroActions">
              <a className="primaryAction" href="#message">Читать дальше <span>↓</span></a>
              <button className="ghostAction" onClick={() => setSecretOpen(true)}>Секретный бафф</button>
            </div>
          </div>

          <aside className="ocCard" aria-label="Её персонаж Gacha">
            <div className="ocGlow" aria-hidden="true" />
            <p className="ocTag">ТВОЙ ОС • СПУТНИК</p>
            <img src="/gacha-oc.png" alt="Персонаж Gacha с чёрными волосами, фиолетовыми рогами и крыльями" />
            <div className="speech">Сегодня все квесты отменяются. Только праздник!</div>
          </aside>
        </section>

        <section className="statsSection" aria-labelledby="stats-title">
          <div className="sectionLabel"><span>01</span><p id="stats-title">КАРТОЧКА ПЕРСОНАЖА</p></div>
          <div className="statsPanel">
            <div className="statsIntro">
              <p className="miniLabel">РЕДКОСТЬ</p>
              <strong>ЕДИНСТВЕННАЯ</strong>
              <p>Повторить невозможно. Заменить тоже.</p>
            </div>
            <div className="statList">
              {stats.map(([label, value]) => (
                <div className="stat" key={label}>
                  <div><span>{label}</span><b>{value}{value === 999 ? "+" : "%"}</b></div>
                  <div className="bar"><i style={{ width: value === 999 ? "100%" : `${value}%` }} /></div>
                </div>
              ))}
            </div>
            <div className="passive">
              <span>ПАССИВНЫЙ НАВЫК</span>
              <strong>Делать мой мир лучше просто своим присутствием</strong>
            </div>
          </div>
        </section>

        <section className="messageSection" id="message" aria-labelledby="message-title">
          <div className="sectionLabel"><span>02</span><p>ЛИЧНОЕ СООБЩЕНИЕ</p></div>
          <div className="messageCard">
            <p className="quoteMark" aria-hidden="true">“</p>
            <h3 id="message-title">Мне правда повезло, что в моей истории есть ты</h3>
            <div className="messageText">
              <p>
                Мне нравится в тебе не что-то одно. Мне нравится, как ты думаешь, как создаёшь своих
                персонажей, как можешь быть смешной, серьёзной, милой и упрямой. Ты настоящая, и именно
                поэтому рядом с тобой всё ощущается по-особенному.
              </p>
              <p>
                Я не обещаю, что каждый день будет идеальным. Но обещаю замечать тебя, поддерживать,
                слушать твои истории и радоваться твоим победам. Даже самым маленьким.
              </p>
            </div>
            <p className="signature">люблю тебя. с твоим шестнадцатилетием ♡</p>
          </div>
        </section>

        <section className="wishesSection" id="wishes" aria-labelledby="wishes-title">
          <div className="sectionLabel"><span>03</span><p>16 МАЛЕНЬКИХ ЖЕЛАНИЙ</p></div>
          <div className="wishesHeading">
            <h3 id="wishes-title">Выбери кристалл</h3>
            <p>В каждом спрятано что-то, чего я хочу пожелать тебе в этом году.</p>
          </div>
          <div className="crystalGrid">
            {wishes.map((text, index) => (
              <button
                className={wish === index ? "crystal active" : "crystal"}
                key={text}
                onClick={() => setWish(index)}
                aria-label={`Открыть желание ${index + 1}`}
                aria-pressed={wish === index}
              >
                <span>{index + 1}</span>
              </button>
            ))}
          </div>
          <div className={wish === null ? "wishReveal" : "wishReveal visible"} aria-live="polite">
            <small>{wish === null ? "ЖЕЛАНИЕ ЖДЁТ" : `ЖЕЛАНИЕ ${String(wish + 1).padStart(2, "0")}`}</small>
            <p>{wish === null ? "Нажми на любой кристалл" : wishes[wish]}</p>
          </div>
        </section>

        <PixelArena />

        <footer>
          <img src="/gacha-oc.png" alt="" aria-hidden="true" />
          <p>Этот сайт существует в одном экземпляре. Как и ты.</p>
          <span>Сделано с любовью • 2026</span>
        </footer>
      </div>

      {secretOpen && (
        <div className="modalBackdrop" role="presentation" onMouseDown={() => setSecretOpen(false)}>
          <section className="secretModal" role="dialog" aria-modal="true" aria-labelledby="secret-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modalClose" onClick={() => setSecretOpen(false)} aria-label="Закрыть">×</button>
            <p className="eyebrow">SECRET BUFF UNLOCKED</p>
            <div className="heartCore" aria-hidden="true">♡</div>
            <h2 id="secret-title">+100 к ощущению, что тебя любят</h2>
            <p>Эффект постоянный. Не снимается расстоянием, плохим настроением или сложным днём.</p>
            <button className="primaryAction" onClick={() => setSecretOpen(false)}>Забрать бафф</button>
          </section>
        </div>
      )}
    </main>
  );
}
