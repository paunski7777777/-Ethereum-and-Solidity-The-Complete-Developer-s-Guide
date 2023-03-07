import React, { useState } from "react";
import Layout from "../../../components/Layout";
import { Form, Button, Message, Input } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";

export const getServerSideProps = async (props) => {
  const { address } = props.query;

  return {
    props: {
      address: address,
    },
  };
};

const RequestNew = ({ address }) => {
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const campaign = Campaign(address);

    try {
      const accounts = await web3.eth.getAccounts();

      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({
          from: accounts[0],
        });

      Router.pushRoute(`/campaigns/${address}/requests`);
    } catch (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  return (
    <Layout>
      <Link route={`/campaigns/${address}/requests`}>Back</Link>
      <h3>Create a Request</h3>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Value in Ether</label>
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
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

export default RequestNew;
