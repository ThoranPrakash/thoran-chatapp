import React, { useContext, useReducer } from 'react';
import {createContext} from 'react';
import { AuthContext } from './AuthContext';

export const MsgContext = createContext();

export const MsgContextProvider = ({children})=>{
    const {currentUser} = useContext(AuthContext)
    const INITIAL_STATE = {
        chatId : "",
        lastMsgStatus:"",
    }

    const chatReducer = (state, action)=>{
        switch(action.type){
            case "MSG":
                return{
                    lastMsgStatus: action.payload,
                    chatId: currentUser.uid > action.payload.uid 
                    ? currentUser.uid + action.payload.uid 
                    : action.payload.uid + currentUser.uid,
                };
            default:
                return state;
        };
    };
    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
    return(
        <MsgContext.Provider value={{data:state, dispatch}}>
            {children}
        </MsgContext.Provider>
    )
};