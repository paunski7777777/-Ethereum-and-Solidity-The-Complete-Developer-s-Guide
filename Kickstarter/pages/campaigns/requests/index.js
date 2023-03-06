import React from "react";
import Layout from "../../../components/Layout";
import { Button, Table } from "semantic-ui-react";
import { Link } from "../../../routes";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

export const getServerSideProps = async (props) => {
  const { address } = props.query;

  const campaign = Campaign(address);

  const requestsCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.approversCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestsCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );

  return {
    props: {
      address: address,
      requests: JSON.parse(JSON.stringify(requests)),
      requestsCount: requestsCount,
      approversCount: approversCount,
    },
  };
};

const RequestIndex = ({ address, requests, requestsCount, approversCount }) => {
  const { Header, Row, HeaderCell, Body } = Table;

  const renderRows = () => {
    return (
      requests &&
      requests.map((request, index) => {
        return (
          <RequestRow
            key={index}
            id={index}
            request={request}
            address={address}
            approversCount={approversCount}
          />
        );
      })
    );
  };

  return (
    <Layout>
      <h3>Requests</h3>
      <Link route={`/campaigns/${address}/requests/new`}>
        <a>
          <Button primary floated="right" style={{ marginBottom: "10px" }}>
            Add Request
          </Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows()}</Body>
      </Table>
      <div>Found {requestsCount} requests.</div>
    </Layout>
  );
};

export default RequestIndex;
