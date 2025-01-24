import { SimpleGamepad } from "./SimpleGamepad";

export function createDialog(textArray, finishAction) {
    if (!this.dialogBox) {
        const dialogText = textArray;

        // Create dialog box background - centered at 300,260
        this.dialogBox = this.add
            .rectangle(300, 260, 280, 60, 0x000000)
            .setScrollFactor(0)
            .setDepth(1000);
        this.dialogBox.setStrokeStyle(2, 0xffffff);

        // Add text - positioned relative to dialog box
        this.dialogText = this.add
            .text(300, 260, dialogText[0], {
                fontFamily: "Arial",
                fontSize: "14px", // Smaller font size
                color: "#ffffff",
                wordWrap: { width: 260 }, // Match dialog box width
                align: "center",
            })
            .setScrollFactor(0)
            .setDepth(1001);

        // Center the text in the dialog box
        this.dialogText.setX(300 - this.dialogText.width / 2);
        this.dialogText.setY(260 - this.dialogText.height / 2);

        // Setup dialog state
        this.currentDialogIndex = 0;
        this.dialogTexts = dialogText;

        // Add space key listener for next dialog
        this.spaceKey = this.input.keyboard.addKey("SPACE");
        this.spaceKey.on("down", () => showNextDialog.bind(this)(finishAction), this);
    }
}

export function showNextDialog(finishAction) {
  if (!this.dialogBox) return;

  this.currentDialogIndex++;
  if (this.currentDialogIndex >= this.dialogTexts.length) {
      // Remove dialog box when finished
      this.dialogBox.destroy();
      this.dialogText.destroy();
      this.dialogBox = null;
      this.dialogText = null;
      this.spaceKey.removeAllListeners();
      if (finishAction) {
        finishAction();
      }
  } else {
      // Show next text
      this.dialogText.setText(this.dialogTexts[this.currentDialogIndex]);
      // Re-center the text after changing it
      this.dialogText.setX(300 - this.dialogText.width / 2);
      this.dialogText.setY(260 - this.dialogText.height / 2);
  }
}

export function setDialogMobileControls(prevGamepadAState, zone) {
  const gamepadState = SimpleGamepad.getState();
  if (gamepadState.b === 1 && prevGamepadAState === 0) {
    if (this.physics.overlap(this.player.getPlayer(), zone)) {
        showNextDialog.bind(this)();
    }
  }
  prevGamepadAState = gamepadState.b;
}