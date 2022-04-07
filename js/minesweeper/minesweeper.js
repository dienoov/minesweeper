class Minesweeper {
    static init(selector) {
        const element = document.querySelector(selector);
        const field = [];

        for (let r = 0; r < this.rowCount; r += 1) {
            field[r] = document.createElement('div');
            element.append(field[r]);

            for (let c = 0; c < this.colCount; c += 1) {
                field[r][c] = document.createElement('button');
                field[r].append(field[r][c]);
            }
        }

        element.classList.add('minesweeper');
    }

    static get rowCount() {
        return window.innerWidth > window.innerHeight ? 10 : 15;
    }

    static get colCount() {
        return window.innerWidth > window.innerHeight ? 15 : 10;
    }

    static get mineCount() {
        return 30;
    }
}

export default Minesweeper;