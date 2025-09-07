// Key constants and utility classes
export const W = 'w'
export const A = 'a'
export const S = 's'
export const D = 'd'
export const SHIFT = 'shift'
export const DIRECTIONS = [W, A, S, D]

export class KeyDisplay {
    map = new Map()

    constructor() {
        const w = document.createElement("div")
        const a = document.createElement("div")
        const s = document.createElement("div")
        const d = document.createElement("div")
        const shift = document.createElement("div")

        this.map.set(W, w)
        this.map.set(A, a)
        this.map.set(S, s)
        this.map.set(D, d)
        this.map.set(SHIFT, shift)

        this.map.forEach((v, k) => {
            v.style.color = 'blue'
            v.style.fontSize = '30px'
            v.style.fontWeight = '800'
            v.style.position = 'absolute'
            v.style.zIndex = '1000'
            v.style.userSelect = 'none'
            v.textContent = k.toUpperCase()
        })

        this.updatePosition()

        this.map.forEach((v, _) => {
            document.body.append(v)
        })
    }

    updatePosition() {
        this.map.get(W).style.top = `${window.innerHeight - 120}px`
        this.map.get(A).style.top = `${window.innerHeight - 80}px`
        this.map.get(S).style.top = `${window.innerHeight - 80}px`
        this.map.get(D).style.top = `${window.innerHeight - 80}px`
        this.map.get(SHIFT).style.top = `${window.innerHeight - 80}px`

        this.map.get(W).style.left = `${250}px`
        this.map.get(A).style.left = `${200}px`
        this.map.get(S).style.left = `${250}px`
        this.map.get(D).style.left = `${300}px`
        this.map.get(SHIFT).style.left = `${50}px`
    }

    down(key) {
        if (this.map.get(key.toLowerCase())) {
            this.map.get(key.toLowerCase()).style.color = 'red'
        }
    }

    up(key) {
        if (this.map.get(key.toLowerCase())) {
            this.map.get(key.toLowerCase()).style.color = 'blue'
        }
    }

    destroy() {
        this.map.forEach((v, _) => {
            document.body.removeChild(v)
        })
        this.map.clear()
    }
}
