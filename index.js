

class Player{
    construct({postition, velocity}){
        this.position = position
        this.velocity = velocity
        this.radius = 15
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'yellow'
        c.fill
        c.closePath
    }
}

//const map =[]
//const boundaries = []

const player = new Player({
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.heigth + Boundary.heigth / 2
    },
    velocity: {
        x: 0,
        y: 0
    }
})

//boundararies.forEach({})

player.draw()

addEventListener('keydown', ({key}) => {
    console.log(key)
    switch (key){
        case 'w':
        
        break
    }
})
 
