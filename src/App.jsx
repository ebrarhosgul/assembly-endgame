import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Languages from './components/Languages'
import { languages } from './languages.js'
import { getFarewellText, getNewWord } from './utils.js'
import { clsx } from 'clsx';
import Confetti from 'react-confetti'

function App() {
  const [currentWord, setCurrentWord] = useState(() => getNewWord().toLocaleLowerCase())
  const [guessedLetters, setGuessedLetters] = useState([])

  const numGuessesLeft = languages.length - 1
  const wrongGuessCount = guessedLetters.filter((letter) => !currentWord.includes(letter)).length
  const isGameWon = 
    currentWord.split('').every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= numGuessesLeft
  const isGameOver = isGameWon || isGameLost
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'

  function checkLetter(character) {
    setGuessedLetters((prevGuessed) => {
      if (prevGuessed.includes(character)) {
        return prevGuessed
      }

      return [...prevGuessed, character]
    })
  }

  const currentWordLetters = currentWord.split('').map((letter, index) => {
    return (
      <span
        key={index} 
        className={clsx('current-word-letter', {
          'game-lost-letter': !guessedLetters.includes(letter) && isGameLost
        })}
      >
        {guessedLetters.includes(letter) || isGameLost ? letter : ''}
      </span>
  )
  })


  const alphabetButtons = alphabet.split('').map((letter) => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const classes = clsx('alphabet-letter', {
        correct: isCorrect,
        wrong: isWrong
    })


    return (
      <button
        key={letter}
        className={classes}
        onClick={() => checkLetter(letter)}
        disabled={isGameOver && 'disabled'}
        aria-disabled={guessedLetters.includes(letter)}
        aria-label={`Letter ${letter}`}
      >
        {letter}
      </button>
    )
  })

  function createStatusSectionContent() {
    if (!isGameOver && isLastGuessIncorrect) {
      const farewellText = getFarewellText(languages[wrongGuessCount - 1].name)

      return (
        <p>'{farewellText}' 🫡 </p>
      )
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <div>Well done! 🎉</div>
        </>
      )
    }

    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <div>You lose! Better start learning Assembly 😭</div>
        </>
      )
    }
  }

  function createNewGame() {
    setCurrentWord(getNewWord())
    setGuessedLetters([])
  }
  

  return (
    <>
      {isGameWon && <Confetti />}
      <Header />
      <section 
        aria-live='polite'
        role='status' 
        className={clsx('status-section', {
          won: isGameWon,
          lost: isGameLost
        })}
      >
        {createStatusSectionContent()}
      </section>
      <main>
        <section className='languages-container'>
          <Languages wrongGuessCount={wrongGuessCount} />
        </section>
        <section className='current-word-container'>
          {currentWordLetters}
        </section>
        <section 
            className='sr-only' 
            aria-live='polite' 
            role='status'
        >
          <p>
            "{currentWord.includes(lastGuessedLetter)
              ? `Correct! The letter ${lastGuessedLetter} is in the word.`
              : `Sorry, the letter ${lastGuessedLetter} is not in the word.`
            }
            You have {numGuessesLeft} attempts left."
          </p>
          <p>
            Current word: {currentWord.split('').map(letter => 
            guessedLetters.includes(letter) ? letter + '.' : 'blank.')
            .join(' ')}
          </p>
        </section>
        <section className='alphabet-container'>
          {alphabetButtons}
        </section>
        {isGameOver && <button className='new-game' onClick={createNewGame}>New Game</button>}
      </main>
    </>
  )
}

export default App
