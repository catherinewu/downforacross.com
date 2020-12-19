const _ = require('lodash');
const {connectPG} = require('./connectPG');

class GameModel {
  constructor() {
    this.pool = connectPG();
  }

  async getEvents(gid) {
    const startTime = Date.now();
    const res = await this.pool.query('SELECT event_payload FROM game_events WHERE gid=$1', [gid]);
    const events = _.map(res.rows, 'event_payload');
    const ms = Date.now() - startTime;
    console.log(`getEvents(${gid}) took ${ms}ms`);
    return events;
  }

  async addEvent(gid, event) {
    const startTime = Date.now();
    await this.pool.query(
      `
      INSERT INTO game_events (gid, uid, ts, event_type, event_payload)
      VALUES ($1, $2, $3, $4, $5)`,
      [gid, event.user, new Date(event.timestamp).toISOString(), event.type, event]
    );
    const ms = Date.now() - startTime;
    console.log(`addEvent(${gid}, ${event.type}) took ${ms}ms`);
  }
}

exports.GameModel = GameModel;