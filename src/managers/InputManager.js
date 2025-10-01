class InputManager {
  constructor() {
    this.keys = {}; // Stores the state of the keys

    // Bind event handlers
    window.addEventListener('keydown', (e) => this.onKeyDown(e), false);
    window.addEventListener('keyup', (e) => this.onKeyUp(e), false);
  }

  onKeyDown(event) {
    this.keys[event.code] = true;
  }

  onKeyUp(event) {
    this.keys[event.code] = false;
  }

  isKeyPressed(keyCode) {
    return this.keys[keyCode] || false;
  }
}

export default InputManager;