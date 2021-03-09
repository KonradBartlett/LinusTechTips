// script tag on shopify store front
var secretButton = document.querySelector('.secret');
fetch(`https://34f3e057b086.ngrok.io/session`, requestOptions).then(result => { });

// handle secret button
secretButton.addEventListener('click', function () {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    let guesses = getCookie('guesses');
    let guess = prompt(`You have ${guesses} guesses remaining`)
    // need to replace domain to your own tunnel / production address
    return fetch(`https://34f3e057b086.ngrok.io/guess?guess=${guess}&variant=${this.dataset.product}`, requestOptions).then(
        result => {
            // alert user if high or low
            if (result.result == "low") {
                alert('That guess was too low');
            } else if (result.result == "high") {
                alert('That guess was too high');
            } else if (result.result == "correct") {
                // redirect to draftOrder if correct
                window.location = result.draftOrder;
            }
        }
    );
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}