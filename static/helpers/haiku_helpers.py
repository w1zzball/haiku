import sys


def syllables(word: str) -> int:
    # Remove apostrophes and trailing s for possessives
    clean_word = word.lower().strip(".,;:!?")

    # Handle possessives
    if clean_word.endswith("'s"):
        clean_word = clean_word[:-2]

    # Special cases - known word syllable counts
    known_words = {
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
        'ease': 1
    }
    if clean_word in known_words:
        return known_words[clean_word]

    # Count the number of syllables
    count = 0
    vowels = "aeiouy"
    prev_is_vowel = False

    # Handle common 'ea' patterns
    if 'ea' in clean_word:
        if clean_word.endswith('es'):
            clean_word = clean_word[:-2] + 'e'  # Treat 'es' ending as silent
        elif not any(ending in clean_word for ending in ['each', 'ead', 'eal', 'eam', 'ean']):
            clean_word = clean_word.replace('ea', 'ee')

    # Handle common 'ie' patterns
    if 'ie' in clean_word and not clean_word.endswith('ie'):
        clean_word = clean_word.replace('ie', 'ee')

    for i, char in enumerate(clean_word):
        is_vowel = char in vowels

        # Count vowel at start or vowel after consonant
        if is_vowel and (i == 0 or not prev_is_vowel):
            count += 1

        prev_is_vowel = is_vowel

    # Handle silent e at the end
    if clean_word.endswith("e") and count > 1 and clean_word[-2] not in vowels:
        count -= 1

    # Handle 'ly' ending - usually adds a syllable
    if clean_word.endswith('ly'):
        # Words ending in 'ly' should have at least 2 syllables
        count = max(count, 2)

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
    print("\n")

    def test_file_haikus(filepath):
        """Test each line in a file to check if it's a valid haiku."""
        try:
            with open(filepath, 'r', encoding='utf-8') as file:
                for i, line in enumerate(file, 1):
                    line = line.strip()
                    if not line:
                        continue

                    result = is_haiku(line)
                    formatted = format_haiku(line)
                    syllable_count = haiku_syllable_count(line)
                    for word in line.split():
                        print(f"{word} ({syllables(word)})", end=" ")

                    print(
                        f"\n {'Valid haiku' if result else 'Not a haiku'} | Syllable count: {syllable_count}")
                    # if formatted:
                    #     print(f"  Formatted:\n{formatted}")
                    print("-" * 40)
        except FileNotFoundError:
            print(f"File not found: {filepath}")
        except Exception as e:
            print(f"Error reading file: {e}")

    # # Test individual words/lines
    # test_cases = [
    #     "silent pond ripples frog jumps in water splash mountain reflection calm",
    #     "autumn leaves falling gentle breeze carries them down winter is coming",
    #     "this is just a test to see if the code works well thanks for checking"
    # ]

    # for test in test_cases:
    #     print(f"Test: '{test}'")
    #     print(f"Is haiku: {is_haiku(test)}")
    #     print(f"Formatted: \n{format_haiku(test)}")
    #     print(f"Syllable count: {haiku_syllable_count(test)}")
    #     print("-" * 40)

    # Test from file if argument provided
    if len(sys.argv) > 1:
        test_file_haikus(sys.argv[1])
