let tableArr = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let points = 0;
let lines = 0;

const figures = [
  [[1, 1, 1], [0, 1, 0]],
  [[1, 1], [1, 1]],
  [[1], [1], [1], [1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[0, 0, 1], [1, 1, 1]]
];

let colors = ["red", "yellow", "green", "blue", "pink", "light-green"];

let rand = Math.floor(Math.random() * 1000) % 6;
let tableField = document.querySelector(".tetris-field").children[0];
let currentFigure = figures[rand];
let currentIndex = 0;
let left = 2;
let activeColor = colors[rand];

function draw() {
  tableArr.forEach((arr, arrIndex) => {
    arr.forEach((elem, elemIndex) => {
      let htmlElem = tableField.children[arrIndex].children[elemIndex];

      if (elem) {
        htmlElem.className == "tetris-item"
          ? htmlElem.classList.add(activeColor)
          : false;

        htmlElem.classList.add("active");
      } else {
        htmlElem.className = "tetris-item";
      }
    });
  });
}

function check(func) {
  let check = true;

  tableArr.forEach((arr, arrI) => {
    if (arrI < currentIndex || arrI >= currentIndex + currentFigure.length)
      return;

    arr.forEach((elem, elemI) => {
      if (elemI <= left || elemI > left + currentFigure[0].length) return;
      let figureArrI = arrI - currentIndex;
      let figureElemI = elemI - left - 1;

      if (!func(arrI, elemI, figureArrI, figureElemI)) check = false;
    });
  });

  return check;
}

function moveCheck() {
  if (currentIndex + currentFigure.length == 14) return false;

  return check((arrI, elemI, figureArrI, figureElemI) => {
    let figureElem = currentFigure[figureArrI][figureElemI];

    if (figureElem && tableArr[arrI + 1][elemI]) {
      if (!currentFigure[figureArrI + 1]) return false;

      if (!currentFigure[figureArrI + 1][figureElemI]) return false;
    }

    return true;
  });
}

function equalCheck(arr1, arr2) {
  let check = true;
  arr1.forEach((arr, arrIndex) => {
    arr.forEach((elem, elemIndex) => {
      if (elem != arr2[arrIndex][elemIndex]) check = false;
    });
  });

  return check;
}

function move() {
  let i = currentIndex + currentFigure.length - 1;
  while (i >= currentIndex) {
    concatRow(i, i + 1);
    i--;
  }

  currentIndex++;
}

function concatRow(currentI, nextI) {
  tableArr[nextI] = tableArr[nextI].map((elem, index) => {
    if (index <= left || index > left + currentFigure[0].length) return elem;

    let figureArrI = currentI - currentIndex;
    let figureElemI = index - left - 1;
    let figureElem = currentFigure[figureArrI][figureElemI];

    if (figureElem) return 1;

    return elem;
  });

  tableArr[currentI] = tableArr[currentI].map((elem, index) => {
    if (index <= left || index > left + currentFigure[0].length) return elem;

    let figureArrI = currentI - currentIndex;
    let figureElemI = index - left - 1;
    let figureElem = currentFigure[figureArrI][figureElemI];

    if (figureElem) return 0;

    return elem;
  });
}

function shift(count) {
  let i = currentIndex;

  if (!shiftCheck(count)) return;

  while (i < currentIndex + currentFigure.length) {
    if (count == -1) {
      for (let j = left; j < left + currentFigure[0].length + 1; j++) {
        if (currentFigure[i - currentIndex][j - left]) {
          tableArr[i][j] = 1;
          tableArr[i][j + 1] = 0;
        }
      }
    } else {
      for (let j = left + currentFigure[0].length + 1; j > left; j--) {
        if (currentFigure[i - currentIndex][j - 2 - left]) {
          tableArr[i][j] = 1;
          tableArr[i][j - 1] = 0;
        }
      }
    }

    i++;
  }

  left += count;
}

function shiftCheck(count) {
  if (
    (left == -1 && count == -1) ||
    (left + currentFigure[0].length >= 9 && count == 1)
  )
    return false;

  return check((arrI, elemI, figureArrI, figureElemI) => {
    let figureElem = currentFigure[figureArrI][figureElemI];
    if (count == -1) {
      if (figureElem && tableArr[arrI][elemI - 1]) {
        if (!currentFigure[figureArrI][figureElemI - 1]) return false;
      }
    } else {
      if (figureElem && tableArr[arrI][elemI + 1]) {
        if (!currentFigure[figureArrI][figureElemI + 1]) return false;
      }
    }

    return true;
  });
}

function rotate() {
  let figure = [];

  for (let i = currentFigure[0].length - 1; i >= 0; i--) {
    figure.push([]);
    for (let j = 0; j < currentFigure.length; j++) {
      figure[figure.length - 1].push(currentFigure[j][i]);
    }
  }

  if (left + figure[0].length > 9) return;
  if (currentIndex + figure.length > 12) return;

  if (!addCheck()) return;

  let check = true;

  tableArr.forEach((arr, arrI) => {
    if (arrI < currentIndex || arrI >= currentIndex + figure.length) return;
    arr.forEach((elem, elemI) => {
      if (elemI <= left || elemI > left + figure[0].length) return;

      if (elem) {
        if (!currentFigure[arrI - currentIndex][elemI - left - 1])
          check = false;
      }
    });
  });

  if (!check) return;

  currentFigure = currentFigure.map(arr => {
    return arr.map(() => 0);
  });

  addFigure();

  currentFigure = figure;

  addFigure();
}

function addFigure() {
  let height = currentFigure.length;
  let check = true;

  for (let i = currentIndex; i < height + currentIndex; i++) {
    tableArr[i] = tableArr[i].map((e, elemI) => {
      if (elemI > left && elemI < left + currentFigure[0].length + 1) {
        if (tableArr[i][elemI]) check = false;
        return currentFigure[i - currentIndex][elemI - 1 - left];
      } else return e;
    });
  }

  return check;
}

function addCheck() {
  let figure = tableArr.slice(
    currentIndex,
    currentIndex + currentFigure.length
  );

  figure = figure.map(arr => {
    return arr.filter(
      (e, i) => i > left && i <= left + currentFigure[0].length
    );
  });

  if (equalCheck(currentFigure, figure)) return true;

  return false;
}

function lineCheck() {
  count = 0;

  tableArr = tableArr.map((arr, i) => {
    let check = true;
    arr.forEach(elem => {
      if (!elem) check = false;
    });
    if (check) {
      count++;
      let tr = document.createElement("tr");
      for (let i = 0; i < 10; i++) {
        let td = document.createElement("td");
        td.classList.add("tetris-item");
        tr.append(td);
      }
      tableField.removeChild(tableField.children[i]);
      tableField.prepend(tr);
      return false;
    }
    return arr;
  });

  switch (count) {
    case 1: {
      points += 100;
      lines += 1;
      break;
    }
    case 2: {
      points += 300;
      lines += 2;
      break;
    }
    case 3: {
      points += 700;
      lines += 3;
      break;
    }
    case 4: {
      points += 1500;
      lines += 4;
      break;
    }
  }

  if (count) {
    document.querySelector(".count-point").textContent = `Счёт: ${points}`;
    document.querySelector(".count-line").textContent = `Ряды: ${lines}`;
  }

  while (count) {
    count--;
    tableArr.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  }

  tableArr = tableArr.filter(elem => elem);
}

function lose() {
  document.querySelector(".lose").classList.add("lose-active");
  document.querySelector(".tetris").classList.add("tetris-lose");
  clearInterval(timer);
}

document.onkeydown = e => {
  if (e.keyCode == 37) {
    shift(-1);
    draw();
  } else if (e.keyCode == 39) {
    shift(1);
    draw();
  } else if (e.keyCode == 40 && moveCheck()) {
    move();
    draw();
  } else if (e.keyCode == 38) {
    rotate();
    draw();
  }
};

addFigure();

draw();

let timer = setInterval(async () => {
  if (moveCheck()) {
    move();

    draw();
  } else {
    let random = Math.floor(Math.random() * 1000) % 6;
    currentIndex = 0;
    left = 3;
    currentFigure = figures[random];
    activeColor = colors[random];
    lineCheck();
    let check = addFigure();

    if (!moveCheck() || !check) {
      lose();
    }
    draw();
  }
}, 1000);
