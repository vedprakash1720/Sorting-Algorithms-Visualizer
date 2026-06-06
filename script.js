var currentAlgo = "bubble";
var arr = [];
var compCount = 0;
var swapCount = 0;
var startTime = 0;
var sorting = false;
var stopped = false;

var complexityInfo = {
  bubble:    "Time: Best = O(n) | Avg = O(n²) | Worst = O(n²) | Space: O(1)",
  selection: "Time: Best = O(n²) | Avg = O(n²) | Worst = O(n²) | Space: O(1)",
  insertion: "Time: Best = O(n) | Avg = O(n²) | Worst = O(n²) | Space: O(1)"
};

generateArray();

function selectAlgo(name) {
  currentAlgo = name;

  var buttons = document.querySelectorAll("#algo-section button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("selected");
  }

  document.getElementById(name).classList.add("selected");
  document.getElementById("complexity").innerText = complexityInfo[name];
}

function updateSize() {
  var val = document.getElementById("sizeInput").value;
  document.getElementById("sizeDisplay").innerText = val;
  if (!sorting) {
    generateArray();
  }
}

function generateArray() {
  var size = parseInt(document.getElementById("sizeInput").value);
  arr = [];
  for (var i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 90) + 10);
  }
  drawBars(arr, [], [], []);
  compCount = 0;
  swapCount = 0;
  document.getElementById("comp").innerText = 0;
  document.getElementById("swap").innerText = 0;
  document.getElementById("time").innerText = 0;
  document.getElementById("status").innerText = "New array generated. Click Sort!";
}

function drawBars(array, comparing, swapping, sorted) {
  var container = document.getElementById("bar-container");
  container.innerHTML = "";

  var max = Math.max.apply(null, array);
  var showNumbers = array.length <= 40;

  for (var i = 0; i < array.length; i++) {
    var box = document.createElement("div");
    box.className = "bar-box";

    var label = document.createElement("span");
    if (showNumbers) {
      label.innerText = array[i];
    }

    var bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = ((array[i] / max) * 90) + "%";

    if (sorted.indexOf(i) !== -1) {
      bar.style.backgroundColor = "green";
    } else if (swapping.indexOf(i) !== -1) {
      bar.style.backgroundColor = "red";
    } else if (comparing.indexOf(i) !== -1) {
      bar.style.backgroundColor = "orange";
    } else {
      bar.style.backgroundColor = "steelblue";
    }

    box.appendChild(label);
    box.appendChild(bar);
    container.appendChild(box);
  }
}

function pause() {
  var speed = parseInt(document.getElementById("speedInput").value);
  var delay = Math.round(400 / speed);
  return new Promise(function(resolve) {
    setTimeout(resolve, delay);
  });
}

async function startSort() {
  if (sorting) {
    stopped = true;
    return;
  }

  sorting = true;
  stopped = false;
  compCount = 0;
  swapCount = 0;
  document.getElementById("sortBtn").innerText = "Stop";
  document.getElementById("status").innerText = "Sorting...";
  startTime = Date.now();

  var workArr = arr.slice();

  if (currentAlgo === "bubble")    await bubbleSort(workArr);
  if (currentAlgo === "selection") await selectionSort(workArr);
  if (currentAlgo === "insertion") await insertionSort(workArr);

  arr = workArr;
  document.getElementById("time").innerText = Date.now() - startTime;

  if (!stopped) {
    var done = [];
    for (var i = 0; i < arr.length; i++) {
      done.push(i);
      drawBars(arr, [], [], done);
      await new Promise(r => setTimeout(r, 10));
    }
    document.getElementById("status").innerText = "Done! Comparisons: " + compCount + ", Swaps: " + swapCount;
  } else {
    drawBars(arr, [], [], []);
    document.getElementById("status").innerText = "Stopped.";
  }

  document.getElementById("sortBtn").innerText = "Sort";
  sorting = false;
}

// ---- BUBBLE SORT ----
async function bubbleSort(a) {
  var n = a.length;
  for (var i = 0; i < n - 1; i++) {
    for (var j = 0; j < n - i - 1; j++) {
      if (stopped) return;

      compCount++;
      document.getElementById("comp").innerText = compCount;
      drawBars(a, [j, j+1], [], []);
      await pause();

      if (a[j] > a[j+1]) {
        var temp = a[j];
        a[j] = a[j+1];
        a[j+1] = temp;

        swapCount++;
        document.getElementById("swap").innerText = swapCount;
        drawBars(a, [], [j, j+1], []);
        await pause();
      }
    }
  }
}

// ---- SELECTION SORT ----
async function selectionSort(a) {
  var n = a.length;
  for (var i = 0; i < n - 1; i++) {
    var minIndex = i;
    for (var j = i + 1; j < n; j++) {
      if (stopped) return;

      compCount++;
      document.getElementById("comp").innerText = compCount;
      drawBars(a, [minIndex, j], [], []);
      await pause();

      if (a[j] < a[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      var temp = a[i];
      a[i] = a[minIndex];
      a[minIndex] = temp;

      swapCount++;
      document.getElementById("swap").innerText = swapCount;
      drawBars(a, [], [i, minIndex], []);
      await pause();
    }
  }
}

// ---- INSERTION SORT ----
async function insertionSort(a) {
  for (var i = 1; i < a.length; i++) {
    var key = a[i];
    var j = i - 1;

    while (j >= 0 && a[j] > key) {
      if (stopped) return;

      compCount++;
      document.getElementById("comp").innerText = compCount;

      a[j + 1] = a[j];
      swapCount++;
      document.getElementById("swap").innerText = swapCount;

      drawBars(a, [j], [j+1], []);
      await pause();
      j--;
    }
    a[j + 1] = key;
    drawBars(a, [], [], []);
    await pause();
  }
}
