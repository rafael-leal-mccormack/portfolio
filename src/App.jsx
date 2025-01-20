import { useRef, useState } from 'react';
import { PhaserGame } from './game/PhaserGame';
import { EventBus } from './game/EventBus';
import { useEffect } from 'react';

function App() {
    const phaserRef = useRef();
    const [showModal, setShowModal] = useState(false);
    const [pictureUrl, setPictureUrl] = useState('');

    useEffect(() => {
        const handleShowPicture = (url) => {
            setPictureUrl(`/assets/${url}`);
            setShowModal(true);
        };

        EventBus.on('show-picture', handleShowPicture);

        return () => {
            EventBus.removeListener('show-picture');
        };
    }, []);

    const changeScene = () => {
        const scene = phaserRef.current.scene;
        if (scene) {
            scene.changeScene();
        }
    };

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
            <div>
                <div>
                    <button className="button" onClick={changeScene}>Change Scene</button>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-button" onClick={() => setShowModal(false)}>X</button>
                        <img src={pictureUrl} alt="Picture" style={{ maxWidth: '100%', objectFit: 'contain' }} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
