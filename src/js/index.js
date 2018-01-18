// @flow

// $FlowFixMe
import 'normalize.css'
// $FlowFixMe
import '../sass/main.scss'

import { MOTIFS } from './config'

const double = (n: number): number => {
  return n * 2
}

export function testMe (name: string) {
  console.log(double(12))
  return `Hi ${name}`
}

const motives = [ ...MOTIFS, ...MOTIFS ]

const shuffleArray = (array) => {
  let counter = array.length

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter)

    counter--

    let temp = array[counter]
    array[counter] = array[index]
    array[index] = temp
  }

  return array
}

const shuffleCards = (motives: Array<any>) => {
  shuffleArray(motives)

  const cardFronts = document.querySelectorAll('.card--front')

  cardFronts.forEach((card, i) => {
    const currClass = motives[i]

    card.classList.add(currClass)
  })
}

shuffleCards(motives)
