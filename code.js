var input_element = null;

SMILEYS = {
    'kissing': "😚",
    'smiling': "😀"
};

/*!
 * \brief Finds the input element, and waits if it's not in the DOM yet.
 */
function findElement() {
    var elements = document.getElementsByClassName('input');
    if(elements.length < 2) {
        setTimeout(findElement, 1000);
        return;
    }

    /* element found, attach an event listener so we know
    when it's contents have changed */
    input_element = elements[1];
    input_element.addEventListener('DOMSubtreeModified', onInputChanged);
}

/*!
 * \brief Iterates over a list of regex matches and filters out the
 *        groups that we don't need.
 *
 * \param matches The original list of matches that need filtering.
 *
 * \returns The actual matches left after filtering.
 */
function filterMatches(matches) {
    /* str.match returns null on zero matches, we just want
    an empty array for that */
    if(!matches) {
        return [];
    }

    var result = [];
    for(var i = 0; i < matches.length; ++i) {
        var current_match = matches[i];

        if(current_match.startsWith(':') && current_match.endsWith(':')) {
            continue;
        }

        result.push(matches[i]);
    }

    return result;
}

/*!
 * \brief Event handler for when the text of the input element changes.
 */
function onInputChanged() {
    /* get the text that was typed and apply a regular expression to
    find ':smiley_name:' type of strings */
    var text = input_element.innerText;
    var matches = filterMatches(text.match('(:(.*?):)'));

    /* filter the matches so we only get what we're interested in */
    if(matches.length <= 0) {
        return;
    }

    for(var i = 0; i < matches.length; i++) {
        /* does this shortcut name match a unicode smiley? */
        var current_match = matches[i];
        if(!(current_match in SMILEYS)) {
            console.warn(current_match + ' is an unknown smiley');
        }

        /* replace the shortcut text with the unicode symbol */
        text = text.replace(':' + current_match + ':', SMILEYS[current_match])
    }

    /* remove the event handler because we're going to modify
    the input box's contents, and we don't want to end up with infinite recusion */
    input_element.removeEventListener('DOMSubtreeModified', onInputChanged);

    /* replace the contents of the input box with our new version */
    input_element.innerText = text;

    /* add back the event handler for the next round */
    input_element.addEventListener('DOMSubtreeModified', onInputChanged);
}

/* starts searching for the input box element */
findElement();
