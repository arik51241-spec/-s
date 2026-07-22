import type { BotDifficulty, CarSnapshot, DirectionInput } from "./types";

const reaction = { easy: 420, normal: 220, hard: 95 };
const mistakes = { easy: .25, normal: .11, hard: .035 };

export class BotController {
  private nextDecision = 0;
  private current: DirectionInput = { left: false, right: false };

  update(now: number, bot: CarSnapshot, opponent: CarSnapshot, difficulty: BotDifficulty): DirectionInput {
    if (now < this.nextDecision) return this.current;
    this.nextDecision = now + reaction[difficulty];

    if (Math.random() < mistakes[difficulty]) {
      this.current = Math.random() > .5 ? { left: true, right: false } : { left: false, right: true };
      return this.current;
    }

    const dx = opponent.x - bot.x;
    const botUpsideDown = Math.abs(Math.sin(bot.angle)) > .65;
    const airborne = bot.y < 380;
    if (airborne || botUpsideDown) {
      const correction = Math.sin(bot.angle) > 0 ? -1 : 1;
      this.current = correction < 0 ? { left: true, right: false } : { left: false, right: true };
    } else if (Math.abs(dx) < 90 && Math.random() < .33) {
      this.current = dx > 0 ? { left: true, right: false } : { left: false, right: true };
    } else {
      this.current = dx > 0 ? { left: false, right: true } : { left: true, right: false };
    }
    return this.current;
  }
}
