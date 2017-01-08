// Balls Klasse
function Balls(anzahl) {
  // Gravitationskonstante
  this.gravity = 0.667408;
  this.balls = [];

  for (var i = 0; i < anzahl; i++) {
    this.balls.push(new Ball());
  }

  // Wird zum Sortieren der Bälle benötigt
  function descending(a, b) {
    return Math.sign(b.pos.z - a.pos.z);
  }

  // Die Bälle aktualisieren
  this.update = function() {
    for (var i = 0; i < this.balls.length; i++) {
      for (var j = (i + 1); j < this.balls.length; j++) {
        this.balls[i].applyBallForce(this.balls[j], this.gravity);
        this.balls[j].applyBallForce(this.balls[i], this.gravity);
      }
      // TODO Das funktioniert noch nicht
      //  this.balls[i].applyBallsForce(this.balls, this.gravity);
    }
    // Jetzt mit den berechneten Kräften die Bälle aktualisieren
    for (var i = 0; i < this.balls.length; i++) {
      this.balls[i].update();
    }
    this.balls.sort(descending);
  }

  // Die Bälle anzeigen
  this.show = function() {
    for (var i = 0; i < this.balls.length; i++) {
      this.balls[i].show();
    }
  }
}