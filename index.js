const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
console.log("hello")

canvas.width = innerWidth
canvas.height = innerHeight

class Boundary{
    static width = 20;
    static height = 20;
    constructor({position, image}){
        this.position = position;
        this.width = 40
        this.height = 40
        this.image = image; 
    }
    draw(){
        // c.fillStyle = 'blue'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

const map = [

    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]
const boundaries = []

function creatImage(src){
    const image = new Image();
    image.src = src;
    return image

}


map.forEach((row,i) => {
    row.forEach((symbol, j) => {
        switch(symbol){
            case '-':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width*j,
                            y: Boundary.height*i
                        },
                        image: creatImage('./img/pipeHorizontal.png')
                    })
                )
                break;
            case '|':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width*j,
                            y: Boundary.height*i
                        },
                        image: creatImage('./img/pipeVertical.png')
                    })
                )
                break;
            
            // Conner  
            case '1':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width*j,
                                y: Boundary.height*i
                            },
                            image: creatImage('./img/pipeCorner1.png')
                        })
                    )
                    break;
            case '2':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width*j,
                            y: Boundary.height*i
                        },
                        image: creatImage('./img/pipeCorner2.png')
                    })
                )
                break;
            case '3':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width*j,
                            y: Boundary.height*i
                        },
                        image: creatImage('./img/pipeCorner3.png')
                    })
                )
                break;
            case '4':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width*j,
                            y: Boundary.height*i
                        },
                        image: creatImage('./img/pipeCorner4.png')
                    })
                )
            break;
        }
    })
}) 
boundaries.forEach(boundary =>{
    boundary.draw()
})

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

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

    }
}

//const map =[]
//const boundaries = []

const player = new Player({
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2
    },
    velocity: {
        x: 0,
        y: 0
    }
})

const keys = {
    w: {
        pressed: false
    },
    s: {
        pressed: false
    },
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
}

let lastKey = ''

function animate(){
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    boundaries.forEach((boundary) => {
        boundary.draw()
    })

    player.update()

    player.velocity.x = 0
    player.velocity.y = 0
    if(key.w.pressed && lastKey === 'w'){
        player.velocity.y = -5
    }else if(key.s.pressed && lastKey === 's'){
        player.velocity.y = 5
    }
    else if(key.a.pressed && lastKey === 'a'){
        player.velocity.x = -5
    }
    else if(key.d.pressed && lastKey === 'd'){
        player.velocity.x = 5
    }
}

animate()

addEventListener('keydown', ({key}) => {
    console.log(key)
    switch (key){
        case 'w':
        keys.w.pressed = true
        lastKey = 'w'
        break
        case 's':
        keys.s.pressed = true
        lastKey = 's'
        break
        case 'a':
        keys.a.pressed = true
        lastKey = 'a'
        break
        case 'd':
        keys.d.pressed = true
        lastKey = 'd'
        break
    }

})

addEventListener('keyup', ({key}) => {
    console.log(key)
    switch (key){
        case 'w':
        keys.w.pressed = false
        break
        case 's':
        keys.s.pressed = false
        break
        case 'a':
        keys.a.pressed = false
        break
        case 'd':
        keys.d.pressed = false
        break
    }

    console.log(key.d.pressed)
    console.log(key.s.pressed)
    
})
 
