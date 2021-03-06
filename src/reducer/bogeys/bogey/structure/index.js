import u from 'updeep';
import fp from 'lodash/fp';

import { actions_reducer } from '../../../utils';
import Actions from '../../../../actions';

const debug = require('debug')('aotds:reducer:struct');


export
let redact = {};

redact.DAMAGE = ({ damage, penetrating }) => state => {
    if( !damage ) return state;

    debug( state );
    let update;
    if( penetrating ) {
        update = u({ hull: { current: c => c - damage } })
    }
    else {
        let armor_damage = fp.min([ fp.ceil(damage/2), state.armor.current ]);
        update =  u({
            hull: { current: c => c - damage + armor_damage },
            armor: { current: c => c - armor_damage },
        })
    }

    let destroy = u.if( s => fp.getOr(1)('hull.current')(s) <= 0, { destroyed: true } );

    return destroy( update(state) );

};

function state_watch(dependencies,target,transform) {
    let previous_watched = undefined;

    if( typeof dependencies === 'string' ) {
        dependencies = fp.get(dependencies);
    }

    let watched = dependencies;
    if( Array.isArray(dependencies) ) {
        watched = state => dependencies.map( d => fp.get(d)(state) );
    }

    return reducer => (state,action) => {
        let new_state = reducer(state,action);

        let new_watched = watched(new_state);

        if ( fp.isEqual(previous_watched,new_watched) ) {
            return new_state;
        }

        let p = previous_watched;
        previous_watched = new_watched;

        return u.updateIn(target, transform(
            new_watched, fp.get(target)(new_state)
        ))(new_state);
    }

}

// const reducer = state_watch( [ 'hull.current' ] , 
//     'status', ([hull]) => { return ( hull <= 0 ) ? 'destroyed' : 'nominal' } ) (
//     actions_reducer( redact, { hull: 0, armor: 0, status: 'nominal' } )
// );

const reducer = actions_reducer( redact, { hull: 0, armor: 0, status: 'nominal' } );

export default reducer;
