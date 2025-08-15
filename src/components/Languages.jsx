import { languages } from '../languages.js'
import { clsx } from 'clsx';

export default function (props) {
    const languageElements = languages.map((language, index) => (
        <div
            key={language.name}
            className={clsx('language-box', props.wrongGuessCount > index ? 'lost' : '')}
            style={{backgroundColor: language.backgroundColor, color: language.color}}
        >
            {language.name}
        </div>
    ))

    return (
        <>
            {languageElements}
        </>
    )
}