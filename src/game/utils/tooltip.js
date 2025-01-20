export function createTooltip(scene, text, x, y) {
    const tooltip = scene.add.text(x, y, text, {
        font: "16px monospace",
        padding: { x: 10, y: 5 },
        backgroundColor: "#000000",
        color: "#ffffff",
        alpha: 0.8,
    })
    .setDepth(300)
    .setVisible(false);
    
    return tooltip;
} 