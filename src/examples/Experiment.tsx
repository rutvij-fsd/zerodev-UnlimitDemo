import React, { FC } from "react";
import { Page } from '../Page';

const Experiment: FC = () => {
  // Add your component logic here
  
  return (
    <Page
      title={"Experiment"}
      description={"Experiment with Unlimit's SDK. This is a live production demo. You can make real crypto purchases."}
      docs={"https://docs.gatefi.com/docs/gatefi-docs/7p34n1uhrzlg8-hosted-mode-integration"}
    >
      <iframe
        title="GateFi Examples"
        src="https://examples.gatefi.com/"
        width="100%"
        height="500px" // You can adjust the height as needed
        frameBorder="0"
        allowFullScreen
      />
    </Page>
  );
};

export default Experiment;
