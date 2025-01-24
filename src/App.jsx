import { useRef, useState } from "react";
import { PhaserGame } from "./game/PhaserGame";
import { EventBus } from "./game/EventBus";
import { useEffect } from "react";
import { SimpleGamepad } from "./game/utils/SimpleGamepad";
function App() {
    const phaserRef = useRef();
    const [showModal, setShowModal] = useState(false);
    const [pictureUrl, setPictureUrl] = useState("");
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const handleShowPicture = (url) => {
            setPictureUrl(`/assets/${url}`);
            setShowModal(true);
        };

        SimpleGamepad.init();
        EventBus.on("show-picture", handleShowPicture);

        return () => {
            EventBus.removeListener("show-picture");
        };
    }, []);

    const changeScene = () => {
        const scene = phaserRef.current.scene;
        if (scene) {
            scene.changeScene();
        }
    };

    const toggleMute = () => {
        console.log("Togglling");
        setIsMuted(!isMuted);
        EventBus.emit("toggle-mute");
    };

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
            <div className="controls">
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                    }}
                >
                    <button
                        className="button"
                        onClick={() =>
                            window.open(
                                "https://www.linkedin.com/in/rafael-leal-mccormack-16b657130/",
                                "_blank"
                            )
                        }
                    >
                        LinkedIn
                    </button>
                    <button
                        className="button"
                        onClick={() =>
                            window.open(
                                "https://github.com/rafael-leal-mccormack",
                                "_blank"
                            )
                        }
                    >
                        GitHub
                    </button>
                    <button className="button" onClick={() => window.open('/assets/resume.pdf', '_blank')}>Resume</button>
                    <button className="button" onClick={toggleMute}>
                        {isMuted ? "🔇 Unmute" : "🔊 Mute"}
                    </button>
                </div>
            </div>

            {showModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="close-button"
                            onClick={() => setShowModal(false)}
                        >
                            X
                        </button>
                        <img
                            src={pictureUrl}
                            alt="Picture"
                            style={{ maxWidth: "100%", objectFit: "contain" }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;

