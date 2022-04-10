class Minesweeper {
    constructor({el}) {
        this.element = document.querySelector(el);
        this.grid = [];

        this.rowCount = window.innerWidth > window.innerHeight ? 10 : 15;
        this.colCount = window.innerWidth > window.innerHeight ? 15 : 10;
        this.mineCount = 20;

        this.opens = 0;
        this.mines = 0;

        for (let r = 0; r < this.rowCount; r += 1) {
            this.grid[r] = document.createElement('div');
            this.element.append(this.grid[r]);

            for (let c = 0; c < this.colCount; c += 1) {
                this.grid[r][c] = document.createElement('button');
                this.grid[r][c].row = r;
                this.grid[r][c].col = c;
                this.grid[r].append(this.grid[r][c]);
            }
        }

        this.element.classList.add('minesweeper');
        this.element.addEventListener('click', this.click.bind(this));
    }

    click(ev) {
        const target = ev.target.closest('button');

        while (this.mines < this.mineCount) {
            const randomRow = Math.floor(Math.random() * this.rowCount);
            const randomCol = Math.floor(Math.random() * this.colCount);
            const random = this.grid[randomRow][randomCol];

            const isAroundTargetRow = randomRow > target.row - 3 && randomRow < target.row + 3;
            const isAroundTargetCol = randomCol > target.col - 3 && randomCol < target.col + 3;

            if ((isAroundTargetRow && isAroundTargetCol) || this.isMine(random))
                continue;

            this.addNumbersAround(randomRow, randomCol);

            random.innerText = this.MINE_ICON;
            this.mines += 1;
        }
    }

    addNumbersAround(r, c) {
        [this.topLeft(r, c), this.topCenter(r, c), this.topRight(r, c),
            this.centerLeft(r, c), this.centerRight(r, c),
            this.bottomLeft(r, c), this.bottomCenter(r, c), this.bottomRight(r, c)].forEach(
            (square) => square && !this.isMine(square) && (
                square.innerText = this.parseNumber(square) + 1
            ));
    }

    parseNumber(square) {
        return square.innerText === '' ? 0 : parseInt(square.innerText);
    }

    isMine(square) {
        return square.innerText === '*';
    }

    topLeft(r, c) {
        const row = r - 1;
        const col = c - 1;
        return row < 0 || col < 0 ? false : this.grid[row][col];
    }

    topCenter(r, c) {
        const row = r - 1;
        const col = c;
        return row < 0 || col < 0 ? false : this.grid[row][col];
    }

    topRight(r, c) {
        const row = r - 1;
        const col = c + 1;
        return row < 0 || col >= this.colCount ? false : this.grid[row][col];
    }

    centerLeft(r, c) {
        const row = r;
        const col = c - 1;
        return row < 0 || col < 0 ? false : this.grid[row][col];
    }

    centerRight(r, c) {
        const row = r;
        const col = c + 1;
        return row >= this.rowCount || col >= this.colCount ? false : this.grid[row][col];
    }

    bottomLeft(r, c) {
        const row = r + 1;
        const col = c - 1;
        return row >= this.rowCount || col < 0 ? false : this.grid[row][col];
    }

    bottomCenter(r, c) {
        const row = r + 1;
        const col = c;
        return row >= this.rowCount || col >= this.colCount ? false : this.grid[row][col];
    }

    bottomRight(r, c) {
        const row = r + 1;
        const col = c + 1;
        return row >= this.rowCount || col >= this.colCount ? false : this.grid[row][col];
    }

    get MINE_ICON() {
        return '*';
    }
}

export default Minesweeper;