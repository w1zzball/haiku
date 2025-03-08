def syllables(word: str) -> int:
    # Remove apostrophes and trailing s for possessives
    clean_word = word.lower().strip(".,;:!?")

    # Handle possessives
    if clean_word.endswith("'s"):
        clean_word = clean_word[:-2]

    # Count the number of syllables
    count = 0
    vowels = "aeiouy"
    prev_is_vowel = False

    for i, char in enumerate(clean_word):
        is_vowel = char in vowels

        # Count vowel at start or vowel after consonant
        if is_vowel and (i == 0 or not prev_is_vowel):
            count += 1

        prev_is_vowel = is_vowel

    # Handle silent e at the end
    if clean_word.endswith("e") and count > 1 and clean_word[-2] not in vowels:
        count -= 1

    # Every word has at least one syllable
    return max(1, count)


def clean_text(text: str) -> list:
    """Clean arbitrary text and return a list of words."""
    # Replace newlines and multiple spaces with single spaces
    text = ' '.join(text.split())
    # Remove all punctuation except apostrophes
    words = [word.strip('.,;:!?"()[]{}') for word in text.split()]
    return [word for word in words if word]


def haiku_syllable_count(text: str) -> int:
    words = clean_text(text)
    return sum(syllables(word) for word in words)


def can_be_haiku(text: str) -> bool:
    """Check if text has exactly 17 syllables."""
    return haiku_syllable_count(text) == 17


def format_haiku(text: str) -> str:
    """Format text into haiku structure if possible."""
    words = clean_text(text)
    if not can_be_haiku(text):
        return ""

    lines = []
    current_line = []
    current_count = 0
    target_counts = [5, 7, 5]
    line_index = 0

    for word in words:
        word_syllables = syllables(word)
        if current_count + word_syllables <= target_counts[line_index]:
            current_line.append(word)
            current_count += word_syllables
        else:
            if line_index >= 2:  # More words than can fit in haiku
                return ""
            lines.append(' '.join(current_line))
            current_line = [word]
            current_count = word_syllables
            line_index += 1

    # Add the last line if it has the correct syllable count
    if current_count == target_counts[line_index]:
        lines.append(' '.join(current_line))

    # Verify we have exactly 3 lines with correct syllable counts
    if len(lines) == 3 and all(haiku_syllable_count(line) == count
                               for line, count in zip(lines, target_counts)):
        return '\n'.join(lines)
    return ""


def is_haiku(text: str) -> bool:
    """Check if text is or can be formatted as a valid haiku."""
    return bool(format_haiku(text))


if __name__ == "__main__":
    # Test cases for arbitrary text
    test_texts = [
        # Original format
        "Silent waterfall\nNature's melody echoes\nPeace in flowing streams",
        # Single line
        "Silent waterfall Nature's melody echoes Peace in flowing streams",
        # Random text that could be a haiku
        "The old pond frog jumps in splash silence returns now",
        # Text that can't be a haiku
        "This is too many words to be a proper haiku format",
        # Exactly 17 syllables but different format
        "Coding all day long fixing bugs and drinking coffee sleep",
    ]

    print("Testing arbitrary text formatting:")
    for text in test_texts:
        print("\nOriginal text:")
        print(text)
        formatted = format_haiku(text)
        print("Formatted haiku:" if formatted else "Cannot be formatted as haiku:")
        print(formatted if formatted else "N/A")
        print(f"Total syllables: {haiku_syllable_count(text)}")
