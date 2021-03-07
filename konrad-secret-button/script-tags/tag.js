console.log('i am here!')

var secretButton = document.querySelector('.secret');
secretButton.addEventListener('click', function () {
    console.log('open modal: ', this.dataset.product);
    alert('woot woot');
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    let guesses = getCookie('guesses');
    let guess = prompt(`You have ${guesses} guesses remaining`)
    return fetch(`${process.env.HOST}/guess?guess=${guess}`, requestOptions).then(
        result => {
            console.log(result);
            if (result.result == "low") {
                alert('That guess was too low');
            } else if (result.result == "high") {
                alert('That guess was too high');
            } else if (result.result == "correct") {
                window.location = "http://www.google.com";
            }
        }
    );

});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}