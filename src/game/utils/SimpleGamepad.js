export const SimpleGamepad = (function () {
    const canvas = document.createElement("canvas");
    canvas.classList.add("gamepad");
    const ctx = canvas.getContext("2d");

    // Basic configuration
    const config = {
        width: window.innerWidth,
        height: window.innerHeight,
        radius: 25,
        opacity: 0.4,
        colors: {
            red: "rgba(255,0,0,0.4)",
            green: "rgba(0,255,0,0.4)",
            joystick: {
                base: "rgba(0,0,0,0.4)",
                stick: "rgba(204,204,204,1)",
            },
        },
    };

    // Button layout
    const buttons = [
        {
            x: -config.radius,
            y: config.radius,
            r: config.radius,
            color: config.colors.red,
            name: "a",
        },
        {
            x: config.radius * 2,
            y: config.radius,
            r: config.radius,
            color: config.colors.green,
            name: "b",
        },
    ];

    // Track touch/mouse inputs
    const touches = {};
    const gameState = {
        'a': 0,
        'b': 0,
        'x-axis': 0,
        'y-axis': 0
    };

    // Joystick configuration
    const stick = {
        radius: 40,
        x: config.width * 0.2, // 20% from left
        y: config.height * 0.8, // 80% from top
        dx: 0,
        dy: 0,
    };
    stick.dx = stick.x;
    stick.dy = stick.y;

    // Button positions
    const buttonBase = {
        x: config.width * 0.8, // 80% from left
        y: config.height * 0.8, // 80% from top
    };

    // Function to simulate keyboard events
    function simulateKey(key, isPressed) {
        const event = new KeyboardEvent(isPressed ? 'keydown' : 'keyup', {
            key: key,
            code: key === 'e' ? 'KeyE' : 'Space',
            bubbles: true
        });
        window.dispatchEvent(event);
    }

    function init() {
        // Setup canvas
        canvas.width = config.width;
        canvas.height = config.height;
        document.body.appendChild(canvas);

        // Prevent default touch behaviors
        canvas.addEventListener("touchmove", (e) => e.preventDefault(), {
            passive: false,
        });

        // Add event listeners
        [
            "mousedown",
            "mouseup",
            "mousemove",
            "touchstart",
            "touchend",
            "touchmove",
        ].forEach((event) =>
            canvas.addEventListener(event, handleInput, false)
        );

        // Start render loop
        requestAnimationFrame(draw);
    }

    function handleInput(e) {
        e.preventDefault(); // Prevent scrolling and other default behaviors
        const touches = e.touches || [e];
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;    // Scale factor for X
        const scaleY = canvas.height / rect.height;  // Scale factor for Y

        // Reset button states before checking new touches
        let newAState = 0;
        let newBState = 0;

        for (let touch of touches) {
            // Convert touch coordinates to canvas coordinates
            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;

            // Check joystick
            const dx = x - stick.x;
            const dy = y - stick.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < stick.radius * 1.5) {
                stick.dx = Math.abs(dx) < stick.radius ? x : stick.x + (dx / dist) * stick.radius;
                stick.dy = Math.abs(dy) < stick.radius ? y : stick.y + (dy / dist) * stick.radius;

                gameState['x-axis'] = (stick.dx - stick.x) / stick.radius;
                gameState['y-axis'] = (stick.dy - stick.y) / stick.radius;
            }

            // Check buttons
            buttons.forEach((button, i) => {
                const bx = buttonBase.x - button.x;
                const by = buttonBase.y - button.y;
                const bdx = x - bx;
                const bdy = y - by;
                const bdist = Math.sqrt(bdx * bdx + bdy * bdy);

                if (bdist < button.r) {
                    if (button.name === 'a') newAState = 1;
                    if (button.name === 'b') newBState = 1;
                }
            });
        }

        // Only trigger keyboard events if the state has changed
        if (newAState !== gameState.a) {
            simulateKey('e', newAState === 1);
            gameState.a = newAState;
        }
        if (newBState !== gameState.b) {
            simulateKey('space', newBState === 1);
            gameState.b = newBState;
        }

        if (e.type === 'mouseup' || e.type === 'touchend') {
            stick.dx = stick.x;
            stick.dy = stick.y;
            gameState['x-axis'] = 0;
            gameState['y-axis'] = 0;
            
            // Reset button states and trigger key up events
            if (gameState.a === 1) simulateKey('e', false);
            if (gameState.b === 1) simulateKey('space', false);
            
            gameState.a = 0;
            gameState.b = 0;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw joystick base with border
        ctx.fillStyle = config.colors.joystick.base;
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(stick.x, stick.y, stick.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw joystick stick
        ctx.fillStyle = config.colors.joystick.stick;
        ctx.beginPath();
        ctx.arc(stick.dx, stick.dy, stick.radius / 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw buttons with text
        buttons.forEach(button => {
            const x = buttonBase.x - button.x;
            const y = buttonBase.y - button.y - (button.name === 'a' ? 30 : 0) + 35;
            
            // Draw button circle
            ctx.fillStyle = button.color;
            ctx.beginPath();
            ctx.arc(x, y, button.r, 0, Math.PI * 2);
            ctx.fill();

            // Draw button press effect
            if (gameState[button.name]) {
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.beginPath();
                ctx.arc(x, y, button.r * 0.8, 0, Math.PI * 2);
                ctx.fill();
            }

            // Add text
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(button.name === 'a' ? 'E' : 'SPACE', x, y);
        });

        requestAnimationFrame(draw);
    }

    return {
        init: init,
        getState: () => gameState,
    };
})();

