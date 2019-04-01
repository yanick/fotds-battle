import fp from 'lodash/fp';

import { compose, createStore, applyMiddleware } from "redux";
import { Action } from '../reducer/types';
import reducer from '../store/reducer';
import { try_play_turn } from '../store/actions/phases';
import { log_skipper } from '../store/log/middleware';
import { timestamp } from '../store/middleware/timestamp';
import { action_id_mw_gen } from '../store/middleware/action_id';
import mw_play_phases from '../store/middleware/play_phases';

type BattleOpts = {
    devtools?: {},
    state?: {}
}

export default class Battle {

    store: any;

    constructor( opts: BattleOpts ) {

        let enhancers = applyMiddleware(
            log_skipper([ 'TRY_PLAY_TURN' ]),
            timestamp,
            action_id_mw_gen(),
            mw_play_phases,
        );

        if( opts.devtools) {
            enhancers = require('remote-redux-devtools').composeWithDevTools(
                fp.defaults({port: 8000, hostname: 'localhost'}, opts.devtools)
            )( enhancers )
        }

        this.store = createStore(
            reducer,
            opts.state,
            enhancers,
        );
    }

    get state() { return this.store.getState() }

    dispatch(action :Action) {
        this.store.dispatch(action);
    }

}