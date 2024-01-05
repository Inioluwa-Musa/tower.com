const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

canvas.width = innerWidth
canvas.height = 768

ctx.fillStyle = "white"
ctx.fillRect(0, 0, canvas.width, canvas.height)

const pTD2D = []

for (i = 0; i < pTD.length; i += 20) {
    pTD2D.push(pTD.slice(i, i + 20))
}



const pTs = []

pTD2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 2684354723) {
            pTs.push(
                new pT({
                    position: {
                        x: x * 64,
                        y: y * 64
                    }
                })
            )
        }
    })
})



const image = new Image()
image.onload = () => {
    animate()
}
image.src = "img/Tower Defense.png"

const enemies = []


function sE(sC) {
    for (let i = 1; i < sC + 1; i++) {
        const xOff = i * 150
        enemies.push(
            new Enemy({ 
                position: { x: waypoints[0].x - xOff, y: waypoints[0].y }
            })
        )
    }
}



const b = []
let aT = undefined
let enemyCount = 3
let hearts = 10
let coins = 125
const explosions = []
sE(enemyCount)

function animate() {
    const aID = requestAnimationFrame(animate)

    ctx.drawImage(image, 0, 0)
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i]
        enemy.update()

        if (enemy.position.x > canvas.width) {
            hearts -= 1
            enemies.splice(i, 1)
            document.querySelector("#hearts").textContent = hearts
            console.log(hearts)

            if (hearts === 0){
                console.log("GAME OVER")
                cancelAnimationFrame(aID)
                const ID = document.querySelector("#gameOver").style.display = "flex"
            }
        }
    }

    for (let i = explosions.length - 1; i >= 0; i--) {
        const explode = explosions[i]
        explode.draw()
        explode.update()
        
        if (explode.frames.current >= explode.frames.max - 1) {
            explosions.splice(i, 1)
        }
    }

    // total amount of enemies tracker
    if (enemies.length === 0) {
        enemyCount += 2
        sE(enemyCount)
    }

    pTs.forEach((tile) => {
        tile.update(mouse)
    })
    
    b.forEach((building) => {
        building.update()
        building.target = null
        const vE = enemies.filter(enemy => {
            const xD1 = enemy.center.x - building.center.x
            const yD1 = enemy.center.y - building.center.y
            const distance = Math.hypot(xD1, yD1)
            return distance < enemy.radius + building.radius
        })

        building.target = vE[0]
        for (let i = building.projectiles.length - 1; i >= 0; i--) {
            const projectile = building.projectiles[i]

            projectile.update()

            const xD1 = projectile.enemy.center.x - projectile.position.x
            const yD1 = projectile.enemy.center.y - projectile.position.y
            const distance = Math.hypot(xD1, yD1)

            //projectile and enemy collision
            if (distance < projectile.enemy.radius + projectile.radius) {
                //enemy health and removal
                projectile.enemy.health -= 20
                if (projectile.enemy.health <= 0) {
                    const enemyIndex = enemies.findIndex((enemy) => {
                        return projectile.enemy === enemy
                    })
                    if (enemyIndex > -1) {
                        enemies.splice(enemyIndex, 1)
                        coins += 25
                        document.querySelector("#coins").textContent = coins
                    }
                }

                console.log(projectile.enemy.health)
                explosions.push(
                    new Sprite({ 
                        position: { x: projectile.position.x, y: projectile.position.y }, 
                        imageSrc: "./img/explosion.png", 
                        frames: { max: 4 }, 
                        offset: { x: 0, y: 0 } 
                    })
                )
                building.projectiles.splice(i, 1)
            }
        }
    })
}

const mouse = {
    x: undefined,
    y: undefined
}

canvas.addEventListener("click", (event) => {
    if (aT && !aT.isoccupied && coins - 50 >= 0) {
        coins -= 50
        document.querySelector("#coins").textContent = coins
        b.push
        (new Building({
            position: {
                x: aT.position.x,
                y: aT.position.y
            }
        })
        )
        aT.isoccupied = true
        b.sort((a, b) => {
            return a.position.y - b.position.y
        })
    }
})

window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX
    mouse.y = event.clientY

    aT = null
    for (let i = 0; i < pTs.length; i++){
        const tile = pTs [i]
        if(
            mouse.x > tile.position.x &&
            mouse.x < tile.position.x + tile.size &&
            mouse.y > tile.position.y &&
            mouse.y < tile.position.y + tile.size
        ) {
            aT = tile
            break
        }
    }
})
