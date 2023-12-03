let player, ground_sensor, ground1, ground2, ground3, ground4;
let grassImg;

const window_width = 1920
const window_height = 1080

const FRICTION = 0.8;
let move_speed = 8;
let jump_height = 20;

let scaleFactor = 1;
let translateFactorX = 1;
let translateFactorY = 1;
let bullets = []

function setup() {
  canvas = createCanvas(window_width, window_height);
  world.gravity.y = 15;

  player = new Sprite(window_width/2, window_height/2, 50, 100, 'd');
  player.bounciness = 0;
  player.rotation = 0;
  player.friction = 0;
  player.rotationLock = true;

  // Ground sensor
  ground_sensor = new Sprite(player.pos.x, player.pos.y + player.h / 2, player.w - 1, 4);
  ground_sensor.mass = 0.01;
  j = new GlueJoint(player, ground_sensor);

  // Ground
  ground1 = new Sprite(window_width / 2, window_height - 20, window_width, 40, 's');
  ground1.bounciness = 0;

  ground2 = new Sprite(window_width / 2, -window_height, window_width, 40, 's');
  ground2.bounciness = 0;

  ground3 = new Sprite(window_width, window_height/2, 40, window_height, 's');
  ground3.bounciness = 0;

  ground4 = new Sprite(-window_width, window_height/2, 40, window_height, 's');
  ground4.bounciness = 0;
}

function shoot_bullet(){
	let bullet = new Sprite(0, 0, 20, 10)
	bullet.collider = 'dynamic'
	bullet.density = 1
  bullet.color = "red"

	if(mouse.pos.x > player.pos.x + player.w/2){
		bullet.pos.x = player.pos.x + player.w/2 + bullet.w/2
	} else if (mouse.pos.x < player.pos.x - player.w/2){
		bullet.pos.x = player.pos.x - player.w/2 - bullet.w/2
	} else {
		bullet.pos.x = player.pos.x
	}

	bullet.pos.y = player.pos.y

	let dx = mouse.pos.x - bullet.pos.x
	let dy = mouse.pos.y - bullet.pos.y
	let angle = atan2(dy, dx)
	bullet.rotation = angle

	// Normalize the direction vector
	let length = sqrt(dx * dx + dy * dy);
	let normalizedDX = dx / length;
	let normalizedDY = dy / length;

	// Set bullet velocity based on the normalized direction vector and desired speed
	bullet.vel.x = normalizedDX * 80;
	bullet.vel.y = normalizedDY * 80;

  player.vel.x += normalizedDX * -1;
  player.vel.y += normalizedDY * -1;

	bullets.push(bullet)
}

function draw() {
  background('gray');
  text(bullets.length, 100, 100)
  text('FPS: ' + int(frameRate()), 10, 30);

  if (kb.pressing('left')) {
    player.vel.x = -move_speed;
  } else if (kb.pressing('right')) {
    player.vel.x = move_speed;
  } else {
    player.vel.x *= 0.8;
  }

  if (mouse.pressing()){
	shoot_bullet()
  }

  if (ground_sensor.overlapping(ground1)) {
    if (kb.pressing('up') || kb.pressing('space')) {
      player.vel.y = -jump_height;
      console.log('touching floor');
    }
  }

  if (player.y > window_height + 100) {
    player.y = -50;
    player.x = 500;
    player.vel.x = 0;
    player.vel.y = 0;
  }

  camera.x = player.x
  camera.y = player.y

  for (let i = bullets.length - 1; i >= 0; i--){
	if (bullets[i].pos.x > camera.x + window_width){
		bullets.splice(i, 1)
	}

	if (bullets[i].pos.y > camera.y + window_height){
		bullets.splice(i, 1)
	}
  }
}
