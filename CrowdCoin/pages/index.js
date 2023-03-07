import React from "react";
import factory from "../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Layout from "../components/Layout";
import { Link } from "../routes";

export const getServerSideProps = async () => {
  const deployedCampaigns = await factory.methods.getDeployedCampaigns().call();

  return { props: { campaings: deployedCampaigns } };
};

const CampaignIndex = ({ campaings }) => {
  const renderCampaigns = () => {
    const items = campaings.map((address) => {
      return {
        header: address,
        description: <Link route={`/campaigns/${address}`}>View Campaign</Link>,
        fluid: true,
      };
    });

    return <Card.Group centered items={items} />;
  };

  return (
    <Layout>
      <div>
        <h3>Open Campaigns</h3>
        <Link route="/campaigns/new">
          <Button
            floated="right"
            content="Create Campaign"
            icon="add circle"
            primary
          />
        </Link>
        {renderCampaigns()}
      </div>
    </Layout>
  );
};

export default CampaignIndex;
