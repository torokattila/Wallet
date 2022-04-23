import React from 'react';
import { Actions } from '../contexts/AuthContext';
import User from '../models/User';

export type ActionMap<M extends { [index: string]: any }> = {
    [Key in keyof M]: M[Key] extends undefined
        ? {
              type: Key;
          }
        : {
              type: Key;
              payload: M[Key];
          };
};

export type AuthUser = null | Record<string, any>;

export type AuthState = {
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: User | null;
};

export type AuthContextType = {
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: User | null;
    dispatch: React.Dispatch<Actions>;
};
