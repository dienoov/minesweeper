class Minesweeper {
    constructor({el}) {
        this.element = document.querySelector(el);
        this.grid = document.createElement('div');
        this.squares = [];

        this.rowCount = this.isPortrait ? 15 : 10;
        this.colCount = this.isPortrait ? 10 : 15;
        this.mineCount = 25;

        this.mines = 0;
        this.recursiveRevealed = [];

        this.info = document.createElement('div');

        this.clockWrapper = document.createElement('div');
        this.clockIcon = document.createElement('img');
        this.clockText = document.createElement('time');
        this.startClock = 0;

        this.flagWrapper = document.createElement('div');
        this.flagIcon = document.createElement('img');
        this.flagText = document.createElement('span');
        this.startFlag = this.mineCount;

        for (let r = 0; r < this.rowCount; r += 1) {
            this.squares[r] = [];
            for (let c = 0; c < this.colCount; c += 1) {
                this.squares[r][c] = document.createElement('button');
                this.squares[r][c].row = r;
                this.squares[r][c].col = c;
                this.grid.append(this.squares[r][c]);
            }
        }

        this.clockWrapper.classList.add('clock');
        this.clockIcon.src = 'svg/clock.svg';
        this.clockText.innerText = '0';
        this.clockWrapper.append(this.clockIcon, this.clockText);

        this.flagWrapper.classList.add('flag');
        this.flagIcon.src = 'svg/flag.svg';
        this.flagText.innerText = this.startFlag;
        this.flagWrapper.append(this.flagIcon, this.flagText);

        this.info.classList.add('info');
        this.info.append(this.clockWrapper, this.flagWrapper);
        this.element.append(this.info);

        this.grid.classList.add('grid');
        this.element.append(this.grid);

        this.element.classList.add('minesweeper');
        this.isPortrait && this.element.classList.add('portrait');

        this.element.addEventListener('click', this.click.bind(this));
    }

    click(ev) {
        const square = ev.target.closest('button');

        if (!square) return;

        if (this.startClock === 0) {
            this.startClock = new Date().getTime();
            setInterval(this.timer.bind(this), 1000);
        }

        while (this.mines < this.mineCount) {
            const randomRow = Math.floor(Math.random() * this.rowCount);
            const randomCol = Math.floor(Math.random() * this.colCount);
            const random = this.squares[randomRow][randomCol];

            const isAroundTargetRow = randomRow > square.row - 3 && randomRow < square.row + 3;
            const isAroundTargetCol = randomCol > square.col - 3 && randomCol < square.col + 3;

            if ((isAroundTargetRow && isAroundTargetCol) || this.isMine(random))
                continue;

            this.insertNumberToNeighbors(randomRow, randomCol);

            random.content = this.MINE_ICON;
            this.mines += 1;
        }

        this.reveal(square);
        this.recursiveRevealed = [this.squareId(square)];

        this.isBlank(square) && this.revealNeighbors(square);
        this.recursiveRevealed = [];
    }

    timer() {
        const diff = new Date().getTime() - this.startClock;
        this.clockText.innerText = Math.floor(diff / 1000);
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
        square.content && square.classList.add(square.content);
        return this.isBlank(square);
    }

    revealNeighbors(square) {
        this.getNeighbors(square.row, square.col).forEach((neighbor) => {
            if (this.recursiveRevealed.includes(this.squareId(neighbor))) return;
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
        return row < 0 || col < 0 ? false : this.squares[row][col];
    }

    topCenter(r, c) {
        const row = r - 1;
        const col = c;
        return row < 0 || col < 0 ? false : this.squares[row][col];
    }

    topRight(r, c) {
        const row = r - 1;
        const col = c + 1;
        return row < 0 || col >= this.colCount ? false : this.squares[row][col];
    }

    centerLeft(r, c) {
        const row = r;
        const col = c - 1;
        return row < 0 || col < 0 ? false : this.squares[row][col];
    }

    centerRight(r, c) {
        const row = r;
        const col = c + 1;
        return row >= this.rowCount || col >= this.colCount ? false : this.squares[row][col];
    }

    bottomLeft(r, c) {
        const row = r + 1;
        const col = c - 1;
        return row >= this.rowCount || col < 0 ? false : this.squares[row][col];
    }

    bottomCenter(r, c) {
        const row = r + 1;
        const col = c;
        return row >= this.rowCount || col >= this.colCount ? false : this.squares[row][col];
    }

    bottomRight(r, c) {
        const row = r + 1;
        const col = c + 1;
        return row >= this.rowCount || col >= this.colCount ? false : this.squares[row][col];
    }

    getNeighbors(r, c) {
        return [this.topLeft(r, c), this.topCenter(r, c), this.topRight(r, c),
            this.centerLeft(r, c), this.centerRight(r, c),
            this.bottomLeft(r, c), this.bottomCenter(r, c), this.bottomRight(r, c)];
    }

    get isPortrait() {
        return window.innerWidth < window.innerHeight;
    }

    get MINE_ICON() {
        return '*';
    }
}

export default Minesweeper;