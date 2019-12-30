import {LOGINOUT, SETAUTH} from '../constants/user'

const INITIAL_STATE = {
    userName: '',
    auth: null
};

export default function user(state = INITIAL_STATE, action) {
    switch (action.type) {
        case LOGINOUT:
            return Object.assign({}, INITIAL_STATE);
        case SETAUTH:
            return Object.assign({}, state, {auth: action.payload});
        default:
            return state
    }
}
