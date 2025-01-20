import PropTypes from "prop-types";
import {
    forwardRef,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import StartGame from "./main";
import { EventBus } from "./EventBus";

export const PhaserGame = forwardRef(function PhaserGame(
    { currentActiveScene },
    ref
) {
    const game = useRef();

    let muteListenerSet = useRef(false);

    useEffect(() => {
        // Set up global event listener for mute
        if (!muteListenerSet.current) {
            muteListenerSet.current = true;
            EventBus.on("toggle-mute", () => {
                // This will affect all scenes since we're accessing the game's global sound manager
                if (game.current) {
                    game.current.sound.mute = !game.current.sound.mute;
                }
            });
        }
    }, []);
    // Create the game inside a useLayoutEffect hook to avoid the game being created outside the DOM
    useLayoutEffect(() => {
        if (game.current === undefined) {
            game.current = StartGame("game-container");

            if (ref !== null) {
                ref.current = { game: game.current, scene: null };
            }
        }

        return () => {
            if (game.current) {
                game.current.destroy(true);
                game.current = undefined;
            }
        };
    }, [ref]);

    useEffect(() => {
        EventBus.on("current-scene-ready", (currentScene) => {
            if (currentActiveScene instanceof Function) {
                currentActiveScene(currentScene);
            }
            ref.current.scene = currentScene;
            const canvas = document.querySelector("canvas");
            canvas.click();
            canvas.focus();
        });

        return () => {
            EventBus.removeListener("current-scene-ready");
        };
    }, [currentActiveScene, ref]);

    return (
        <div className="game-container" id="game-container">
            <div className="background-overlay">
                <img src="/assets/backgrounds/gameboy.png"></img>
            </div>
        </div>
    );
});

// Props definitions
PhaserGame.propTypes = {
    currentActiveScene: PropTypes.func,
};

