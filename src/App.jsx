import { useRef } from 'react';

import { PhaserGame } from './game/PhaserGame';

function App ()
{    
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();

    const changeScene = () => {

        const scene = phaserRef.current.scene;

        if (scene)
        {
            scene.changeScene();
        }
    }

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
            <div>
                <div>
                    <button className="button" onClick={changeScene}>Change Scene</button>
                </div>
            </div>
        </div>
    )
}

export default App
