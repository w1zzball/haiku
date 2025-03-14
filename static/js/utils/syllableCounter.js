const knownWords = {
    'quiet': 2,
    'lonely': 2,
    'leaves': 1,
    'waves': 1,
    'breathe': 1,
    'lives': 1,
    'feels': 1,
    'moves': 1,
    'through': 1,
    'these': 1,
    'those': 1,
    'write': 1,
    'scene': 1,
    'peace': 1,
    'piece': 1,
    'meant': 1,
    'grace': 1,
    'dance': 1,
    'ease': 1,
    'veiled': 1,
    'snowflakes': 2,
    'twinkle': 2,
    'curled': 1
};

function syllables(word) {
    // Clean the word
    let cleanWord = word.toLowerCase().replace(/[.,;:!?]/g, '');

    // Handle possessives
    if (cleanWord.endsWith("'s")) {
        cleanWord = cleanWord.slice(0, -2);
    }

    // Check known words
    if (knownWords[cleanWord]) {
        return knownWords[cleanWord];
    }

    // Count syllables
    let count = 0;
    const vowels = "aeiouy";
    let prevIsVowel = false;

    // Handle 'ed' endings
    if (cleanWord.endsWith('ed')) {
        if (cleanWord.length > 2 &&
            !vowels.includes(cleanWord[cleanWord.length - 3]) &&
            !['t', 'd'].includes(cleanWord[cleanWord.length - 3])) {
            cleanWord = cleanWord.slice(0, -1);
        }
    }

    // Handle vowel patterns
    if (cleanWord.includes('ea')) {
        if (cleanWord.endsWith('es')) {
            cleanWord = cleanWord.slice(0, -2) + 'e';
        } else if (!['each', 'ead', 'eal', 'eam', 'ean'].some(ending => cleanWord.includes(ending))) {
            cleanWord = cleanWord.replace(/ea/g, 'ee');
        }
    }

    if (cleanWord.includes('ei')) {
        cleanWord = cleanWord.replace(/ei/g, 'ee');
    }

    if (cleanWord.includes('ie') && !cleanWord.endsWith('ie')) {
        cleanWord = cleanWord.replace(/ie/g, 'ee');
    }

    // Count vowel groups
    for (let i = 0; i < cleanWord.length; i++) {
        const isVowel = vowels.includes(cleanWord[i]);
        if (isVowel && (i === 0 || !prevIsVowel)) {
            count++;
        }
        prevIsVowel = isVowel;
    }

    // Handle silent e
    if (cleanWord.endsWith('e') && count > 1 && !vowels.includes(cleanWord[cleanWord.length - 2])) {
        count--;
    }

    // Handle special endings
    if (['le', 'les'].some(ending => cleanWord.endsWith(ending)) &&
        !vowels.includes(cleanWord[cleanWord.length - 3])) {
        count = Math.max(count, 2);
    }

    if (cleanWord.endsWith('ly')) {
        count = Math.max(count, 2);
    }

    return Math.max(1, count);
}

function cleanText(text) {
    return text.split(/\s+/)
        .filter(word => word && !word[0].match(/\d/))
        .filter(Boolean);
}

function countTotalSyllables(text) {
    const words = cleanText(text);
    return words.reduce((total, word) => total + syllables(word), 0);
}

// Export function to initialize counter
function initializeSyllableCounter() {
    const textarea = document.querySelector('textarea[name="body"]');
    const counter = document.querySelector('.syllable-counter');

    if (textarea && counter) {
        textarea.addEventListener('input', () => {
            const syllableCount = countTotalSyllables(textarea.value);
            counter.textContent = `Syllables: ${syllableCount}/17`;

            // Add visual feedback
            if (syllableCount === 17) {
                counter.classList.add('valid');
                counter.classList.remove('invalid');
            } else {
                counter.classList.add('invalid');
                counter.classList.remove('valid');
            }
        });

        // Initial count
        const syllableCount = countTotalSyllables(textarea.value);
        counter.textContent = `Syllables: ${syllableCount}/17`;
    }
}

// Remove DOMContentLoaded listener since we'll call it explicitly
window.initializeSyllableCounter = initializeSyllableCounter;
