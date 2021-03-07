import { Button, Form, Modal, Page, TextField } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { getGlobal, global, setGlobal } from "../utils/global";

// allow configurable min and max through app page
// generate secret password between min and max
const Index = () => {

  const [min, setMin] = useState(1);
  const [max, setMax] = useState(1000);

  // able to change number of guesses, default 10
  const [guesses, setGuesses] = useState(10);

  // always able to find the secret using minimum height of a binary tree, based on number of nodes
  useEffect(() => {
    setGuesses(Math.round(Math.log2(max - min + 1)))
    console.log(global())
  }, [min, max])

  const handleSubmit = () => {
    setGlobal(min, max, guesses);
  }

  return (
    <Page
      title="Secret Code Discount Settings">
      <Form onSubmit={handleSubmit}>
        <TextField
          label="Min"
          value={min}
          inputMode="numeric"
          onChange={e => setMin(e)}
        />
        <TextField
          label="Max"
          value={max}
          inputMode="numeric"
          onChange={e => setMax(e)}
        />
        <p>{`The user will have ${guesses} guesses`}</p>
        <Button submit>Submit</Button>
      </Form>
    </Page>
  )
};

export default Index;