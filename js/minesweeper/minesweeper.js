class Minesweeper {
    constructor({el}) {
        this.element = document.querySelector(el);
        this.board = [];

        this.rowCount = window.innerWidth > window.innerHeight ? 10 : 15;
        this.colCount = window.innerWidth > window.innerHeight ? 15 : 10;
        this.mineCount = 30;

        this.mines = 0;

        this.recursiveRevealed = [];

        for (let r = 0; r < this.rowCount; r += 1) {
            this.board[r] = document.createElement('div');
            this.element.append(this.board[r]);

            for (let c = 0; c < this.colCount; c += 1) {
                this.board[r][c] = document.createElement('button');
                this.board[r][c].row = r;
                this.board[r][c].col = c;
                this.board[r].append(this.board[r][c]);
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
            const random = this.board[randomRow][randomCol];

            const isAroundTargetRow = randomRow > target.row - 3 && randomRow < target.row + 3;
            const isAroundTargetCol = randomCol > target.col - 3 && randomCol < target.col + 3;

            if ((isAroundTargetRow && isAroundTargetCol) || this.isMine(random))
                continue;

            this.insertNumberToNeighbors(randomRow, randomCol);

            random.content = this.MINE_ICON;
            this.mines += 1;
        }

        this.reveal(target);
        this.recursiveRevealed = [this.squareId(target)];

        this.isBlank(target) && this.revealNeighbors(target);
        this.recursiveRevealed = [];
    }

    insertNumberToNeighbors(r, c) {
        this.getNeighbors(r, c)
            .forEach((square) => square && !this.isMine(square) && (
                square.content = this.parseNumber(square) + 1
            ));
    }

    reveal(square) {
        if (!square) return;
        square.disabled = true;
        square.innerText = square.content ?? '';
        return this.isBlank(square);
    }

    revealNeighbors(square) {
        this.getNeighbors(square.row, square.col).forEach((neighbor) => {
            if (this.recursiveRevealed.includes(this.squareId(neighbor)))
                return;
            this.recursiveRevealed.push(this.squareId(neighbor));
            this.reveal(neighbor) && this.revealNeighbors(neighbor);
        });
    }

    squareId(square) {
        return `${square.row}:${square.col}`;
    }

    parseNumber(square) {
        return square.content === undefined ? 0 : parseInt(square.content);
    }

    isBlank(square) {
        return square.content === undefined;
    }

    isMine(square) {
        return square.content === '*';
    }

    isNumber(square) {
        return /^\d$/.test(square.content);
    }

    topLeft(r, c) {
        const row = r - 1;
        const col = c - 1;
        return row < 0 || col < 0 ? false : this.board[row][col];
    }

    topCenter(r, c) {
        const row = r - 1;
        const col = c;
        return row < 0 || col < 0 ? false : this.board[row][col];
    }

    topRight(r, c) {
        const row = r - 1;
        const col = c + 1;
        return row < 0 || col >= this.colCount ? false : this.board[row][col];
    }

    centerLeft(r, c) {
        const row = r;
        const col = c - 1;
        return row < 0 || col < 0 ? false : this.board[row][col];
    }

    centerRight(r, c) {
        const row = r;
        const col = c + 1;
        return row >= this.rowCount || col >= this.colCount ? false : this.board[row][col];
    }

    bottomLeft(r, c) {
        const row = r + 1;
        const col = c - 1;
        return row >= this.rowCount || col < 0 ? false : this.board[row][col];
    }

    bottomCenter(r, c) {
        const row = r + 1;
        const col = c;
        return row >= this.rowCount || col >= this.colCount ? false : this.board[row][col];
    }

    bottomRight(r, c) {
        const row = r + 1;
        const col = c + 1;
        return row >= this.rowCount || col >= this.colCount ? false : this.board[row][col];
    }

    getNeighbors(r, c) {
        return [this.topLeft(r, c), this.topCenter(r, c), this.topRight(r, c),
            this.centerLeft(r, c), this.centerRight(r, c),
            this.bottomLeft(r, c), this.bottomCenter(r, c), this.bottomRight(r, c)];
    }

    get MINE_ICON() {
        return '*';
    }
}

export default Minesweeper;