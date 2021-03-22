class Visual {
    constructor() {
        visuals.push(this);
        this.Enabled = false;
        this.Exiting = false;
        this.Enabling = false;
        this.keybind = [];
        this.title = "";
    }
}