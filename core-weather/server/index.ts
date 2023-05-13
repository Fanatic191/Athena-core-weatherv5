import alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { WeatherCommands } from './src/commands/weatherCommands';
import { World } from './src/world';

const PLUGIN_NAME = 'Athena Weather';

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    WeatherCommands.init();
    World.init();
    alt.log(`~lg~CORE ==> ${PLUGIN_NAME} Loaded.`);
});
