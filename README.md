# CannonBall

CannonBall is a Billiards-inspired game, that utilizes a handrolled physics engine. 

The engine utilizes the elasticity of collisions with billiards balls, and accounts for friction and energy loss as a ball rolls on along the table and bounces of off the table rails 

## Gameplay

The game play is relatively simple and straight forward. To shoot using the cue stick users will click and drag back with their mouse. Upon release the cue ball will be hit with cue stick, giving it a velocity that is dependent on how far back they drew their mouse. If the user clicks on the cue ball while it is moving they will be able to active the bomb feature. The cue ball will push all balls away from it and will move in a random direction afterwards. 

## Features & Implementation

### Collision Detection 

Collisions are detected using canvas positions and are calculated using the velocity vectors of the billiard balls. Since the balls all share the same mass, the velocity vectors post collision are calculated as follows: 

```javascript
velocityShift: function (velocityA, velocityB, positionA, positionB) {
    var velocityDiff = Util.subtract(velocityA, velocityB);
    var positionDiff = Util.subtract(positionA, positionB);
    var dotProduct = Util.dotProduct(velocityDiff, positionDiff);
    var positionNorm = Util.norm(positionDiff);     
    var velocityScale = (dotProduct)/(Math.pow(positionNorm, 2));
    return Util.scale(positionDiff, velocityScale);
}
```

This makes for physically consistent and accurate collisions. Data from the Colorado State University's physics department was use to account for energy loss in cueBall collisions.

```javascript
var BALL_TABLE_FRICTION = 0.15;
var BALL_RAIL_RESTITUTION = 0.75;
var BALL_BALL_RESTITUTION = 0.95;
```

### Exploding CueBall

CannonBall puts a spin on classic Billiards by making the cue ball a live explosive. Upon a click the cue ball pushes the other balls away from the cue ball along a velocity vector with a speed that has an inverse square relation with the ball's distance from the cue ball.

```javascript
var vectorDiff = Util.subtract(ball.position, cueBall.position);
var distanceFrom = Util.norm(vectorDiff);
var scaledVelocity = Util.scale(vectorDiff, Math.pow(1/(distanceFrom), 2));
ball.velocity = Util.scale(scaledVelocity, 2000*Math.random());
```

## Future Features

Future features include additional weapon configurations for the cueball. One possible configuration is a sniper option where users can click on the ball they wish to hit. This ensures that the user hits their target, but they still will have to account for the angle that they hit the ball. 

Another future feature is implemented consequences for missing a ball while using a weapon. This may include introducing more balls into play or increasing the table friction for a limited period of time.