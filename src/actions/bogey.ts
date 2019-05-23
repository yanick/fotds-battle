// @format

import { action } from '.';
import { NavigationState } from '../store/bogeys/bogey/navigation/types';
import { FireconOrdersState, WeaponOrdersState } from '../store/bogeys/bogey/orders/types';

export const bogey_movement = action('BOGEY_MOVEMENT', (id: string, navigation: NavigationState) => ({
    id,
    navigation,
}));

export const bogey_firecon_orders = action(
    'BOGEY_FIRECON_ORDERS',
    (bogey_id: string, firecon_id: number, orders: FireconOrdersState) => ({
        bogey_id,
        firecon_id,
        orders,
    }),
);

export const bogey_weapon_orders = action(
    'BOGEY_WEAPON_ORDERS',
    (bogey_id: string, weapon_id: number, orders: WeaponOrdersState) => ({
        bogey_id,
        weapon_id,
        orders,
    }),
);
