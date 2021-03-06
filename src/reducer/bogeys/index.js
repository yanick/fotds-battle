import u from 'updeep';
import fp from 'lodash/fp';
import _ from 'lodash';

import { types } from '~/actions';
import { mapping_reducer, actions_reducer, redactor } from '~/reducer/utils';

import bogey from './bogey';
import inflate from './inflate';

const debug = require('debug')('aotds:bogeys');

const default_selector = action => fp.matchesProperty('id', action.object_id);
const only_target_object = ( selector = default_selector ) => action => {
    return u.map( 
        u.if( selector(action),
           obj => object_reducer( obj, action )
        )
    );
};

let redaction = redactor();

redaction.PLAY_TURN = action => u.omitBy( u.is('structure.destroyed',true) )

redaction.INTERNAL_DAMAGE = only_target_object();

redaction.INIT_GAME = action => () => (_.get(action,'bogeys',{}) |> inflate);

const specific_bogey = action => u.updateIn( action.bogey_id, b => bogey(b,action) );

[ 'SET_ORDERS', 'BOGEY_MOVEMENT',
    'EXECUTE_FIRECON_ORDERS', 'EXECUTE_WEAPON_ORDERS', 'DAMAGE',
    'INTERNAL_DAMAGE'
].forEach( action => redaction[action] = specific_bogey );

redaction.CLEAR_ORDERS = action => u.map( b => bogey(b,action) )

export default actions_reducer( redaction, {} );
    
