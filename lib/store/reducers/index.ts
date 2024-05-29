// @flow
import { combineReducers } from 'redux';
import webviewerReducer from "../slices/webviewerSlice";

const rootReducer = combineReducers({
    webviewer: webviewerReducer,
});

export default rootReducer;