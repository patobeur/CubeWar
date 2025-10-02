class InputManager {
  constructor() {
    this.keys = {};
    this.previousKeys = {};
    window.addEventListener('keydown', (e) => (this.keys[e.code] = true));
    window.addEventListener('keyup', (e) => (this.keys[e.code] = false));
  }

  isKeyPressed(keyCode) {
    return !!this.keys[keyCode];
  }

  isKeyJustPressed(keyCode) {
    return this.isKeyPressed(keyCode) && !this.previousKeys[keyCode];
  }

  update() {
    this.previousKeys = { ...this.keys };
  }
}

export default InputManager;