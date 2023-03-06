import React, { useState } from "react";
import { Table, Button, Message } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import { Router } from "../routes";

const RequestRow = ({ id, request, address, approversCount }) => {
  const [approveLoading, setApproveLoading] = useState(false);
  const [finalizeLoading, setFinalizeLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { Row, Cell } = Table;

  const readyToFinalize = request.approvalCount > approversCount / 2;

  const onApprove = async () => {
    setErrorMessage("");
    setApproveLoading(true);

    try {
      const campaign = Campaign(address);

      const accounts = await web3.eth.getAccounts();

      await campaign.methods.approveRequest(id).send({
        from: accounts[0],
      });

      Router.pushRoute(`/campaigns/${address}/requests`);
    } catch (error) {
      setErrorMessage(error.message);
    }

    setApproveLoading(false);
  };

  const onFinalize = async () => {
    setErrorMessage("");
    setFinalizeLoading(true);

    try {
      const campaign = Campaign(address);

      const accounts = await web3.eth.getAccounts();

      await campaign.methods.finalizeRequest(id).send({
        from: accounts[0],
      });

      Router.pushRoute(`/campaigns/${address}/requests`);
    } catch (error) {
      setErrorMessage(error.message);
    }

    setFinalizeLoading(false);
  };

  return (
    <Row
      disabled={request.complete}
      positive={readyToFinalize && !request.complete}
    >
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>
        {request.approvalCount}/{approversCount}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button
            disabled={finalizeLoading}
            loading={approveLoading}
            color="green"
            basic
            onClick={onApprove}
          >
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button
            disabled={approveLoading}
            loading={finalizeLoading}
            color="teal"
            basic
            onClick={onFinalize}
          >
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  );
};

export default RequestRow;
