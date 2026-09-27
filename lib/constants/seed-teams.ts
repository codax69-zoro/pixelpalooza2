import { Team, ScoreEvent } from "@/types/arena";

// Clean production state: Starts completely fresh with 0 mock teams and 0 mock scores.
// Teams and score events are registered live during the event via /admin.
export const INITIAL_TEAMS: Team[] = [];

export const INITIAL_SCORE_EVENTS: ScoreEvent[] = [];
