import { Button, Modal, Page, TextField } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { gql, useQuery } from '@apollo/client'
import { createDraftOrderUrl } from "../server/handlers/mutations/createDraftOrder";
import { createClient } from "../server/handlers/client";
import { getOneTimeUrl } from "../server/handlers/mutations/get-one-time-url";

// allow configurable min and max
const min = 1;
const max = 1000;
// generate secret password between min and max
let secret = getRandomInt(min, max);

const Index = () => {

  console.log(secret);

  const [active, setActive] = useState(true);
  const [input, setInput] = useState();
  const [result, setResult] = useState('');

  // able to change number of guesses, default 10
  // const [guesses, setGuesses] = useState(10);

  // always able to find the secret using minimum height of a binary tree, based on number of nodes
  const [guesses, setGuesses] = useState(Math.round(Math.log2(max - min + 1)));

  const handleSubmit = () => {
    if (input != undefined) {
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

  const activator = <Button onClick={toggleModal}>Use Secret Password</Button>;

  return (
    <Page>
      <Modal
        activator={activator}
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

export default Index;

function draftOrder() {
  const client = createClient();
  // getOneTimeUrl(client)
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}