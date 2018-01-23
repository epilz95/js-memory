// @flow

// $FlowFixMe
import 'normalize.css'
// $FlowFixMe
import '../sass/main.scss'

import { MOTIFS } from './config'

import { setState, store } from './store'

const double = (n: number): number => {
  return n * 2
}

export function testMe (name: string) {
  console.log(double(12))
  return `Hi ${name}`
}

const shuffleArray = (array: Array<any>): Array<any> => {
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

const shuffleCards = (MOTIFS: Array<any>): void => {
  shuffleArray(MOTIFS)

  const cardFrontNodes = document.querySelectorAll('.card--front')

  cardFrontNodes.forEach((card, i) => {
    const currClass = MOTIFS[i].class
    const currID = MOTIFS[i].id

    card.classList.add(currClass)
    card.setAttribute('data-id', currID)
  })
}

const turnCards = (cardNodes: NodeList<any>): void => {
  cardNodes.forEach(card => card.classList.remove('flipped'))
}

const flipCard = (card: ?HTMLElement) => {
  if (!card) return

  if (store.currCardNode === undefined) {
    setState({ currCardNode: card })
  } else {
    const prevCardNode = store.currCardNode

    setState({
      prevCardNode: prevCardNode,
      currCardNode: card
    })
  }

  const flippedCards = document.querySelectorAll('.card.flipped')

  if (store.currCardNode === store.prevCardNode && flippedCards.length !== 0) return

  card.classList.add('flipped')
}

const compareCards = () => {
  const flippedCards = document.querySelectorAll('.card.flipped')
  const cardMotives = Array.from(document.querySelectorAll('.card.flipped .card--front'))

  const cardMotiveID1 = parseInt(cardMotives[0].dataset.id)
  const cardMotiveID2 = parseInt(cardMotives[1].dataset.id)

  const item1 = MOTIFS.find(motive => motive.id === cardMotiveID1)
  const item2 = MOTIFS.find(motive => motive.id === cardMotiveID2)

  if (!item1 || !item2) return

  const isSameMotive = item1.id === item2.matchID

  if (isSameMotive) {
    const currMatchCounter = store.matchCounter + 1

    setState({ matchCounter: currMatchCounter })

    flippedCards.forEach(card => {
      card.classList.remove('flipped')
      card.classList.add('matched')
      card.setAttribute('disabled', '')
    })
  }
}

const checkForWin = (cardNodes: NodeList<any>) => {
  const matchedAll = store.matchCounter === MOTIFS.length / 2

  if (matchedAll) {
    const overlayNode = document.querySelector('.overlay')
    if (overlayNode) overlayNode.style.display = 'block'

    const overlayTextNode = document.querySelector('.overlay p')
    if (overlayTextNode) overlayTextNode.innerHTML = `Congrats, you guessed all pairs within ${store.clicksCount} clicks!`
  }
}

const handleRestart = () => {
  const cardFrontNodes = document.querySelectorAll('.card--front')

  cardFrontNodes.forEach(node => {
    node.removeAttribute('data-id')
    node.removeAttribute('class')
    node.setAttribute('class', 'card--front')
  })

  shuffleCards(MOTIFS)

  setState({
    clicksCount: 0,
    matchCounter: 0,
    prevCardNode: undefined,
    currCardNode: undefined
  })

  const overlayNode = document.querySelector('.overlay')

  if (overlayNode) overlayNode.style.display = 'none'

  const cardNodes = document.querySelectorAll('.card')

  cardNodes.forEach(card => {
    card.classList.remove('matched', 'flipped')
    card.removeAttribute('disabled')
  })
}

const addListeners = (): void => {
  const cardNodes = document.querySelectorAll('.card')

  cardNodes.forEach(card => card.addEventListener('click', (e: MouseEvent) => {
    if (card.hasAttribute('disabled')) return

    flipCard(card)

    const clicksCount = store.clicksCount + 1
    setState({ clicksCount: clicksCount })

    const cardsFlipped = document.querySelectorAll('.card.flipped')

    if (cardsFlipped.length === 2) compareCards()
  }))

  cardNodes.forEach(card => card.addEventListener('transitionend', () => {
    const cardsFlipped = document.querySelectorAll('.card.flipped')

    checkForWin(cardNodes)

    if (cardsFlipped.length < 2) return

    turnCards(cardNodes)
  }))

  const buttonRestart = document.querySelector('.button-restart')

  if (buttonRestart) buttonRestart.addEventListener('click', (e: MouseEvent) => handleRestart())

  const buttonClose = document.querySelector('.button-close')
  const overlayNode = document.querySelector('.overlay')

  if (buttonClose && overlayNode) {
    buttonClose.addEventListener('click', (e: MouseEvent) => {
      overlayNode.style.display = 'none'
    })
  }
}

const main = () => {
  addListeners()
  shuffleCards(MOTIFS)
}

main()
