import { Button, Modal, Page, TextField } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { gql, useQuery } from '@apollo/client'
import { createDraftOrderUrl } from "./server/handlers/mutations/createDraftOrder";
import { createClient } from "./server/handlers/client";
import { getOneTimeUrl } from "./server/handlers/mutations/get-one-time-url";
import { getRandomInt } from "../utils/randomInt";
import { global } from "../utils/global";

console.log('i am here');

// generate secret password between min and max
let secret = getRandomInt();
let active = false;
let product = 0;

var secretButton = document.querySelector('.secret')
secretButton.addEventListener('click', function () {
    console.log('open modal: ', this.dataset.product);
    active = true;
    product = this.dataset.product;
});

const SecretModal = () => {

    console.log(secret);

    const [guesses, setGuesses] = useState(global().guesses);
    const [input, setInput] = useState();
    const [result, setResult] = useState('');

    const handleSubmit = () => {
        if (input != undefined && input < global().max + 1 && input > global().min - 1) {
            setGuesses(guesses - 1);  // modal displays how many guesses are left
            // modal displays hint whether their guess was too high or low
            if (secret == input) {
                setResult(`correct`);
            } else if (secret < input) {
                setResult(`high`);
            } else {
                setResult(`low`);
            }
        }
        if (result != `correct` && guesses > 0) {
            ////TODO
            // destroy session if more than max guesses
            // create new session
        }
    }

    const toggleModal = useCallback(() => setActive((active) => !active), []);

    return (
        <Page>
            <Modal
                open={active}
                onClose={toggleModal}
                title={`Enter a Secret Password Between: [${min}-${max}]`}
            >
                {
                    result === 'correct'
                        ?
                        <Button onClick={e => draftOrder()}>
                            Get Your Discount
                        </Button>
                        :
                        <div>
                            {
                                guesses > 0 &&
                                <>
                                    <TextField
                                        value={input}
                                        inputMode="numeric"
                                        onChange={e => { setInput(e); }}
                                        connectedRight={
                                            <Button
                                                onClick={e => handleSubmit()}>
                                                Submit
                                            </Button>
                                        }
                                    />
                                    {/* modal displays how many guesses remain */}
                                    <p>{`You have ${guesses} guesses remaining`}</p>
                                    {/* modal displays hint whether the guess was too high or too low */}
                                    <p>{`Your guess of ${input} was ${result}`}</p>
                                </>
                            }
                        </div>
                }
            </Modal>
        </Page>
    )
};

function draftOrder() {
    const client = createClient();
    console.log(product)
    // getOneTimeUrl(client)
};
