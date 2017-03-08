
import Promise from 'bluebird';
import * as types from '../actions/types';
import Logger from '../utils/logger';
import LogLevel from '../utils/logLevels';
import Locale from '../locales/locales';
import _ from 'lodash';

const logger = new Logger();

export const forbidden = () => ({
    type: types.FORBIDDEN
});

