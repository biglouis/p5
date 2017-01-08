var b;

function setup() {
  createCanvas(1200, 700);
  b = new Balls(20);
  noFill();
}

function draw() {
  background(0);

  b.update();
  b.show();
}