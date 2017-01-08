// Ball Klasse
function Ball() {
  // Konstanten
  this.masseMin = 16;
  this.masseMax = 1024 * 1024 * 1024 * 10;

  this.masse = random(this.masseMin, this.masseMax);

  // Konfiguration
  this.minPos = createVector(0, 0, 0);
  this.maxPos = createVector(width, height, 200);
  this.maxRadius = 6;

  // Multiplikation der Geschwindigkeit beim Anstoß an dem Rand
  this.velBorderMult = createVector(-0.75, -0.75, -0.1);

  // Multiplikation der Masse beim Anstoß an den Rand
  this.masBorderMult = createVector(0.95, 0.95, 1);

  // Position (startet zufällig)
  var x = random(this.minPos.x + this.maxRadius, this.maxPos.x - this.maxRadius);
  var y = random(this.minPos.y + this.maxRadius, this.maxPos.y - this.maxRadius);
  var z = random(this.minPos.z + this.maxRadius, this.maxPos.z - this.maxRadius);
  this.pos = createVector(x, y, z);

  // Geschwindigkeit (startet mit 0)
  this.vel = createVector(0, 0, 0);

  // Beschleunigung (startet mit 0)
  this.acc = createVector(0, 0, 0);

  // Display (Geschwindigkeit)
  this.posVel = createVector(0, 0, 0);

  // Display (Beschleunigung)
  this.posAcc = createVector(0, 0, 0);

  // Ein paar für die Performance vorberechnete Konstanten
  this.logMaxZ = Math.log(this.maxPos.z);
  this.logMaxMasse = Math.log(this.masseMax);
  this.log2 = Math.log(2);
  this.sqrt2 = Math.pow(2, (1 / 3));

  // Eine Kraft auf den Ball ausüben
  this.applyForce = function(f) {
    this.acc.add(f);
  }

  // Berechnt aus Masse und z-Koordination den Radius des anzuzeigenden Kreises
  this.getDisplayRadius = function() {
    var massePotenz = (this.logMaxMasse / this.log2) - (Math.log(this.masse) / this.log2);
    var masseRadius = this.maxRadius / (Math.pow(this.sqrt2, massePotenz));

    var zPotenz = (this.logMaxZ / this.log2) - (Math.log(this.pos.z) / this.log2);
    var zRadius = this.maxRadius / (Math.pow(1.1, zPotenz));

    return masseRadius * zRadius;
  }

  // Einen anderen Ball auf den Ball ausüben
  this.applyBallForce = function(ball, gravity) {
    var delta = ball.pos.copy().sub(this.pos);
    var len = delta.mag();

    if ((len > 0) && (this.masse)) {
      var force = (gravity * ball.masse / (this.masse * len * len * len));
      this.applyForce(delta.mult(force));
    }
  }

  // Anderen Bälle auf den Ball ausüben
  /*
  this.applyBallsForce = function(balls, gravity) {
    for (var i = 0; balls.length; i++) {
      this.applyBallForce(balls[i], gravity);
    }
  }
*/
  // Verhalten am vorderen und hinteren Rand
  this.updateCornerZ = function() {
    if (this.pos.z < this.minPos.z) {
      this.pos.z = this.minPos.z;
      this.vel.z *= this.velBorderMult.z;
      this.masse *= this.masBorderMult.z;
    } else if (this.pos.z > this.maxPos.z) {
      this.pos.z = this.maxPos.z;
      this.vel.z *= this.velBorderMult.z;
      this.masse *= this.masBorderMult.z;
    }
  }

  // Verhalten am oberen und unteren Rand
  this.updateCornerY = function() {
    var minY = this.minPos.y + this.getDisplayRadius();
    var maxY = this.maxPos.y - this.getDisplayRadius();

    if (this.pos.y < minY) {
      this.pos.y = minY;
      this.vel.y *= this.velBorderMult.y;
      this.masse *= this.masBorderMult.y;
    } else if (this.pos.y > maxY) {
      this.pos.y = maxY;
      this.vel.y *= this.velBorderMult.y;
      this.masse *= this.masBorderMult.y;
    }
  }

  // Verhalten am linken und rechten Rand
  this.updateCornerX = function() {
    var minX = this.minPos.x + this.getDisplayRadius();
    var maxX = this.maxPos.x - this.getDisplayRadius();

    if (this.pos.x < minX) {
      this.pos.x = minX;
      this.vel.x *= this.velBorderMult.x;
      this.masse *= this.masBorderMult.x;
    } else if (this.pos.x > maxX) {
      this.pos.x = maxX;
      this.vel.x *= this.velBorderMult.x;
      this.masse *= this.masBorderMult.x;
    }
  }

  // Physik
  this.updatePhysics = function() {
    // Masse in den Grenzen halten
    if (this.masse < this.masseMin) {
      this.masse = this.masseMin;
    } else if (this.masse > this.masseMax) {
      this.masse = this.masseMax;
    }

    // Reibung
    var reib = this.vel.copy().mult(-this.masse * 0.0000000000001);
    this.applyForce(reib);

    // Geschwindigkeit um die Beschleunigung erhöhen
    this.vel.add(this.acc);

    // Position um die Geschwindigkeit erhöhen
    this.pos.add(this.vel);

    // Linie für Geschwindigkeit
    this.posVel = this.pos.copy().add(this.vel.copy().mult(30));

    // Linie für Beschleunigung
    this.posAcc = this.pos.copy().add(this.acc.copy().mult(5000 / this.vel.mag()));

    // Beschleunigung resetten
    this.acc.mult(0);
  }

  // Den Ball aktualisieren
  this.update = function() {
    this.updateCornerZ();
    this.updateCornerY();
    this.updateCornerX();
    this.updatePhysics();
  }

  // Den Ball anzeigen
  this.show = function() {
    translate(this.minPos.x, this.minPos.y);

    // Ein Kreis für den Ball (roter Rand gleich schnell)
    stroke(color(map(this.vel.mag(), 0, 5, 0, 255), 0, 0));
    fill(map(this.masse, this.masseMin, this.masseMax, 70, 255), 240);
    ellipse(this.pos.x, this.pos.y, (2 * this.getDisplayRadius()));

    // Grüne Linie für Geschwindigkeit
    stroke(0, 255, 0);
    line(this.pos.x, this.pos.y, this.posVel.x, this.posVel.y);

    // Blaue Linie für Beschleunigung
    stroke(0, 0, 255);
    line(this.pos.x, this.pos.y, this.posAcc.x, this.posAcc.y);
  }
}