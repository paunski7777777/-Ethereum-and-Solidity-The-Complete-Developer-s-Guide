import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

const New = () => {
  const [minimumContribution, setMinimumContribution] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();

      await factory.methods.createCampaign(minimumContribution).send({
        from: accounts[0],
      });

      Router.pushRoute("/");
    } catch (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  return (
    <Layout>
      <h3>Create a Campaign</h3>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            value={minimumContribution}
            onChange={(event) => setMinimumContribution(event.target.value)}
          />
        </Form.Field>
        <Message error header="Oops!" content={errorMessage} />
        <Button loading={loading} primary>
          Create
        </Button>
      </Form>
    </Layout>
  );
};

export default New;
