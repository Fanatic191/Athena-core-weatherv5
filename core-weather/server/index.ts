import alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { WeatherCommands } from './src/commands/weatherCommands';

const PLUGIN_NAME = 'Athena Weather';

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    WeatherCommands.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} Loaded.`);
});
