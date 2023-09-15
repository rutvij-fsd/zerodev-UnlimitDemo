/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-useless-concat */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  GateFiDisplayModeEnum,
  GateFiSDK,
} from "@gatefi/js-sdk";
import { FC, useRef, useEffect, useState, ChangeEvent, FormEvent } from "react";
import crypto from 'crypto-browserify';
import { Page } from '../Page'


const OnrampExample: React.FC = () => {
  const [showIframe, setShowIframe] = useState(false); // state to control iframe visibility
  const overlayInstanceSDK = useRef<GateFiSDK | null>(null);
  const embedInstanceSDK = useRef<GateFiSDK | null>(null);

  const handleOnClickEmbed = () => {
    if (!embedInstanceSDK.current) {
      createEmbedSdkInstance();
    }

    embedInstanceSDK?.current?.show();
  };

  let isOverlayVisible = false; // A flag to keep track of the overlay's visibility status

  // Function to create a new overlay SDK instance
  const createOverlaySdkInstance = () => {
    const randomString = crypto.randomBytes(32).toString("hex");

    overlayInstanceSDK.current =
      typeof document !== "undefined"
        ? new GateFiSDK({
            merchantId: "9e34f479-b43a-4372-8bdf-90689e16cd5b",
            displayMode: GateFiDisplayModeEnum.Overlay,
            nodeSelector: "#overlay-button",
            isSandbox: true,
            walletAddress: "0xc458f721D11325E38f781a9C58055de489178BF2",
            email: "d.dadkhoo@unlimit.com",
            externalId: randomString,
            defaultFiat: {
              currency: "EUR",
              amount: "500",
            },
            defaultCrypto: {
              currency: "BTC",
            },
          })
        : null;
  };

  const handleOnClick = () => {
    if (!overlayInstanceSDK.current) {
      createOverlaySdkInstance();

      const targetNode = document.getElementById("overlay-button");
      
      const observerOptions = {
        childList: true,
      };
      const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
          if (
            mutation.type === "childList" &&
            mutation.removedNodes.length > 0
          ) {
            overlayInstanceSDK?.current?.destroy();
            overlayInstanceSDK.current = null;

            observer.disconnect();
          }
        }
      });
      if (targetNode) {
        observer.observe(targetNode, observerOptions);
    }    }

    // Toggle the overlay visibility
    if (isOverlayVisible) {
      overlayInstanceSDK?.current?.hide();
      isOverlayVisible = false;
    } else {
      overlayInstanceSDK?.current?.show();
      isOverlayVisible = true;
    }
  };

  // Function to create a new embed SDK instance
  const createEmbedSdkInstance = () => {
    const randomString = crypto.randomBytes(32).toString("hex");

    embedInstanceSDK.current =
      typeof document !== "undefined"
        ? new GateFiSDK({
            merchantId: "9e34f479-b43a-4372-8bdf-90689e16cd5b",
            displayMode: GateFiDisplayModeEnum.Embedded,
            nodeSelector: "#embed-button",
            isSandbox: true,
            walletAddress: "0xc458h721D11322E34f781a9C58055de489178BF2",
            email: "d.dadkhoo@unlimit.com",
            externalId: randomString,
            defaultFiat: {
              currency: "USD",
              amount: "30",
            },
            defaultCrypto: {
              currency: "ETH",
            },
          })
        : null;
  };

  // Function to handle 'Hosted Flow' button click
  const handleHostedFlowClick = () => {
    setShowIframe(true);
  };

  return (
    <Page 
    title={"Onramp"} 
    description={"Onramp users with our SDK or Hosted Flows"} 
    docs={"https://docs.gatefi.com/docs/gatefi-docs/7p34n1uhrzlg8-hosted-mode-integration"}
  >

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >

      {/* Buttons with modern styling */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        <button 
          onClick={handleOnClick} 
          style={{
            background: 'rgb(201, 247, 58)',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 20px',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: '0.3s',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            fontWeight: 'bold',
            color: 'black'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          Overlay
        </button>
        <button 
          onClick={handleOnClickEmbed} 
          style={{
            background: 'rgb(201, 247, 58)',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 20px',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: '0.3s',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            fontWeight: 'bold',
            color: 'black'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          Embed
        </button>
        <button 
          onClick={handleHostedFlowClick} 
          style={{
            background: 'rgb(201, 247, 58)',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 20px',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: '0.3s',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            fontWeight: 'bold',
            color: 'black'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          Hosted Flow
        </button>
      </div>
  
      {showIframe && (
        <iframe
          title="Unlimit Crypto"
          src="https://onramp-sandbox.gatefi.com/?merchantId=9e34f479-b43a-4372-8bdf-90689e16cd5b"
          style={{ width: "100%", height: "600px", margin: "10px" }}
        />
      )}
  
      <div id="overlay-button"></div>
      <div id="embed-button"></div>
    </div>
    </Page>

  );
  

};

export default OnrampExample;
