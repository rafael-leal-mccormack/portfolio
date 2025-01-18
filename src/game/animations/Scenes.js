function fadeIn(camera, duration = 500) {
    camera.fadeIn(duration, 0, 0, 0);
}

function fadeOut(camera, duration = 500, scene, newSceneName, data = {}) {
    camera.fadeOut(duration, 0, 0, 0, (camera, progress) => {
        if (progress === 1) {
            scene.start(newSceneName, data);
        }
    });
}

export { fadeIn, fadeOut };
