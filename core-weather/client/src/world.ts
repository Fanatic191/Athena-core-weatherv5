import * as alt from 'alt-client';
import * as native from 'natives';
import { WEATHER_EVENTS } from '@AthenaPlugins/core-weather/shared/events';
import { WORLD_WEATHER } from '@AthenaPlugins/core-weather/shared/weather';

let isTransitioning = false;
let isFrozen = false;

// Weather types:

// EXTRASUNNY
// CLEAR
// NEUTRAL
// SMOG
// FOGGY
// OVERCAST
// CLOUDS
// CLEARING
// RAIN
// THUNDER
// SNOW
// BLIZZARD
// SNOWLIGHT
// XMAS
// HALLOWEEN

export class World {
    static hasPausedClock = false;
    static prevWeather = 'Overcast';
    static weather: string;
    static hour: number = 0;
    static minute: number = 0;

    static init() {
        alt.onServer(WEATHER_EVENTS.UPDATE_WEATHER, World.updateWeather);
        alt.setInterval(World.getWeatherUpdate, 10000); //For test all 10 seconds, Later 1 or 10 minutes?
        // alt.onServer(SYSTEM_EVENTS.WORLD_UPDATE_TIME, World.updateTime);
    }

    static getWeatherUpdate() {
        alt.emitServer(WEATHER_EVENTS.GET_WEATHER_UPDATE);
    }

    /**
     * When the weather changes, update the weather and play the appropriate audio.
     * @param {string} name - The name of the weather.
     */
    static async updateWeather(nextWeather: string, timeInSeconds: number = 60) {
        if (isFrozen) {
            return;
        }

        if (timeInSeconds > 60) {
            timeInSeconds = 60;
        }

        const timeInMs = timeInSeconds * 1000;
        await alt.Utils.waitFor(() => isTransitioning === false, timeInMs);

        isTransitioning = true;

        World.weather = nextWeather;

        if (World.weather !== World.prevWeather) {
            native.clearOverrideWeather();
            native.clearWeatherTypePersist();
            native.setWeatherTypeOvertimePersist(nextWeather, timeInSeconds);
            native.setWeatherTypePersist(nextWeather);

            World.prevWeather = World.weather;

            alt.setTimeout(() => {
                native.setWeatherTypeNow(nextWeather);
                native.setWeatherTypeNowPersist(nextWeather);
                isTransitioning = false;
            }, timeInMs - 500);

            if (World.weather === WORLD_WEATHER.XMAS) {
                native.useSnowWheelVfxWhenUnsheltered(true);
                native.useSnowFootVfxWhenUnsheltered(true);
                native.setPedFootstepsEventsEnabled(alt.Player.local, true);
                native.requestScriptAudioBank('ICE_FOOTSTEPS', true, 0);
                native.requestScriptAudioBank('SNOW_FOOTSTEPS', true, 0);
                return;
            }

            native.releaseNamedScriptAudioBank('ICE_FOOTSTEPS');
            native.releaseNamedScriptAudioBank('SNOW_FOOTSTEPS');
            native.useSnowWheelVfxWhenUnsheltered(false);
            native.useSnowFootVfxWhenUnsheltered(false);
        }
    }
}
