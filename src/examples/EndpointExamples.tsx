/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-concat */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useRef, useEffect, useState, SetStateAction } from "react";
import crypto from "crypto-browserify";
import { Page } from "../Page";

const EndpointExamples: React.FC = () => {
  const instanceSDK = useRef<any>();
  const [cryptoWidget, setCryptoWidget] = useState(null);
  const [showIframe, setShowIframe] = useState(false); // state to control iframe visibility
  const [quotes, setQuotes] = useState<QuoteData | null>(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [showApiResponse, setShowApiResponse] = useState(true);
  const [showQuotesResponse, setShowQuotesResponse] = useState(true);
  const [customOrderId, setCustomOrderId] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [singleOrderResponse, setSingleOrderResponse] = useState(null);
  const [showSingleOrderResponse, setShowSingleOrderResponse] = useState(false);
  const [config, setConfig] = useState(null);

  type QuoteData = {
    // your data structure here, for example:
    id: string;
    price: number;
    // ... other fields
  };

  // State to hold the form values
  // Initial state for the form
  const [form, setForm] = useState({
    amount: "100",
    crypto: "ETH",
    fiat: "USD",
    partnerAccountId: "9e34f479-b43a-4372-8bdf-90689e16cd5b",
    payment: "BANKCARD",
    region: "US",
  });

  const [orderParams, setOrderParams] = useState({
    start: "2023-07-22",
    end: "2024-08-22",
    limit: "5",
    skip: "0",
  });

  // Event handler for custom order ID field
  const handleCustomOrderIdChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setCustomOrderId(e.target.value);
  };

  // Event handler for wallet address field
  const handleWalletAddressChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setWalletAddress(e.target.value);
  };

  var CryptoJS = require("crypto-js");
  console.log(CryptoJS.HmacSHA1("Message", "Key"));

  let secretkey = "GSLDrYtqLmXDJRHbqtUwDQLwKBbEgPvu";
  let prodSecretkey = "xxxxxxxx";

  //string will be method + api path
  let dataVerify = "GET" + "/onramp/v1/configuration";
  let dataVerify1 = "GET" + "/onramp/v1/quotes";
  let dataVerify2 = "GET" + "/onramp/v1/orders";
  let dataVerify3 =
    "GET" +
    "/onramp/v1/orders/d0c0e8bd3bb169dbc29a9db673391694f989e300e7ca9ed18dda0202215b9981";
  let dataVerify4 = "GET" + "/onramp/v1/buy";

  // Hash the secret key with the data
  function calcAuthSigHash(data: string) {
    let hash = CryptoJS.HmacSHA256(data, secretkey);
    return CryptoJS.enc.Hex.stringify(hash);
  }

  // Hash the secret key with the data
  function calcAuthSigHashProd(data: string) {
    let hash = CryptoJS.HmacSHA256(data, prodSecretkey);
    return CryptoJS.enc.Hex.stringify(hash);
  }

  console.log(calcAuthSigHash(dataVerify));

  console.log("Quotes Sig Test", calcAuthSigHash(dataVerify1));
  console.log(calcAuthSigHash(dataVerify2));
  console.log("get single order", calcAuthSigHash(dataVerify3));
  console.log("buybuybuy", calcAuthSigHash(dataVerify4));

  console.log("Prod get quotes", calcAuthSigHashProd(dataVerify1));
  console.log("Prod buy Asset", calcAuthSigHashProd(dataVerify4));
  console.log("Config Prod", calcAuthSigHashProd(dataVerify));

  let signatureConfig = calcAuthSigHash(dataVerify);
  let signature1 = calcAuthSigHash(dataVerify1);
  let signature2 = calcAuthSigHash(dataVerify2);

  const handleOrderParamChange = (e: { target: { name: any; value: any } }) => {
    setOrderParams({
      ...orderParams,
      [e.target.name]: e.target.value,
    });
  };

  const getConfig = async () => {
    const queryString = new URLSearchParams(form).toString();

    const response = await fetch(
      `/api/proxy?endpoint=/onramp/v1/configuration`,
      {
        method: "GET",
        headers: {
          "access-control-allow-headers": "Accept",
          signature: signatureConfig,
          "api-key": "VrHPdUXBsiGtIoWXTGrqqAwmFalpepUq",
        },
      }
    );
    const data = await response.json();
    setConfig(data);
  };

  const getOrders = async (params: string) => {
    const response = await fetch(
      `/api/proxy?endpoint=/onramp/v1/orders&${params}`,
      {
        method: "GET",
        redirect: "follow",
        headers: {
          "access-control-allow-headers": "Accept",
          signature: signature2,
          "api-key": "VrHPdUXBsiGtIoWXTGrqqAwmFalpepUq",
        },
      }
    );
    const data = await response.json();
    setApiResponse(data);
    setShowApiResponse(true); // Add this line
    return data;
  };

  const handleOrderFormSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const params = new URLSearchParams(orderParams).toString();
    getOrders(params);
  };

  // Function to get single order
  const getSingleOrder = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    let dataVerify3 = "GET" + `/onramp/v1/orders/${customOrderId}`;
    let signature3 = calcAuthSigHash(dataVerify3);

    const response = await fetch(
      `/api/proxy?endpoint=/onramp/v1/orders/${customOrderId}&walletAddress=${walletAddress}`,
      {
        method: "GET",
        redirect: "follow",
        headers: {
          "access-control-allow-headers": "Accept",
          signature: signature3,
          "api-key": "VrHPdUXBsiGtIoWXTGrqqAwmFalpepUq",
        },
      }
    );
    const data = await response.json();
    setSingleOrderResponse(data);
    setShowSingleOrderResponse(true);
    return data;
  };

  const handleOnClick1 = async () => {
    instanceSDK?.current?.show();
    const randomString = crypto.randomBytes(32).toString("hex");
    const newWindow = window.open("", "_blank");
    const response = await fetch(
      `/api/proxy?endpoint=/onramp/v1/buy&amount=23&crypto=ETH&fiat=USD&orderCustomId=${randomString}&partnerAccountId=9e34f479-b43a-4372-8bdf-90689e16cd5b&payment=BANKCARD&redirectUrl=https://www.google.com/&region=US&walletAddress=0xc458f721D11322E36f781a9C58055de489178BF2`,
      {
        redirect: "follow",
      }
    );

    const externalApiUrl = response.headers.get("X-External-Api-Url");
    if (externalApiUrl && newWindow) {
      newWindow.location.href = externalApiUrl;
    } else if (response.ok) {
      const finalUrl = response.headers.get("X-Final-Url");
      if (finalUrl && newWindow) {
        newWindow.location.href = finalUrl;
      }
    } else {
      const data = await response.json();
      setCryptoWidget(data);
    }
  };

  //TEST NET
  const getQuotes = async (): Promise<QuoteData | null> => {
    // Build the URL query string from the form values
    const queryString = new URLSearchParams(form).toString();
    const response = await fetch(
      `/api/proxy?endpoint=/onramp/v1/quotes&${queryString}`,
      {
        method: "GET",
        redirect: "follow",
        headers: {
          "access-control-allow-headers": "Accept",
          signature: signature1,
          "api-key": "VrHPdUXBsiGtIoWXTGrqqAwmFalpepUq",
        },
      }
    );

    const data = await response.json();
    setQuotes(data);
    return data;
  };

  // Handle form submission
  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    getQuotes();
    setShowQuotesResponse(true);
  };

  // Handle form field changes
  const handleChange = (event: { target: { name: any; value: any } }) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const buttonStyle = {
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
  };


  return (
    <Page
      title={"Unlimit API's"}
      description={"Unlimit's APIs can onboard users through a widget or retrieve metadata."}
      docs={"https://docs.gatefi.com/docs/gatefi-docs/3wt63j9l4bxg5-gate-fi-api"}
    >
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
        <button onClick={handleOnClick1} style={buttonStyle}>Buy Asset API GET</button>
        <button onClick={getConfig} style={buttonStyle}>Get Config</button>
      </div>

      {config && (
        <div style={{ position: "relative", border: "1px solid #000", margin: "10px", padding: "10px", borderRadius: "5px", maxWidth: "500px", maxHeight: "300px", overflow: "auto" }}>
          <button style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => setConfig(null)}>X</button>
          <pre>{JSON.stringify(config, null, 2)}</pre>
        </div>
      )}

            {showIframe && (
                <iframe
                    src="https://onramp-sandbox.gatefi.com/?merchantId=9e34f479-b43a-4372-8bdf-90689e16cd5b"
                    style={{ width: '100%', height: '600px', margin: '10px' }}
                />
            )}

        {/* Form for the query parameters */}
        <div
          style={{
            border: "1px solid #000",
            padding: "10px",
            borderRadius: "5px",
            margin: "10px",
            maxWidth: "500px",
          }}
        >
          <h3>Get Quotes</h3>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <label>
              Amount:
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Crypto:
              <input
                type="text"
                name="crypto"
                value={form.crypto}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Fiat:
              <input
                type="text"
                name="fiat"
                value={form.fiat}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Partner Account ID:
              <input
                type="text"
                name="partnerAccountId"
                value={form.partnerAccountId}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Payment:
              <input
                type="text"
                name="payment"
                value={form.payment}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Region:
              <input
                type="text"
                name="region"
                value={form.region}
                onChange={handleChange}
                required
              />
            </label>
            <button type="submit" style={buttonStyle}>Get Quotes</button>
          </form>
        </div>

        {/* Display the quotes */}
        {showQuotesResponse && quotes && (
          <div
            style={{
              position: "relative",
              border: "1px solid #000",
              margin: "10px",
              padding: "10px",
              borderRadius: "5px",
              maxWidth: "500px",
              maxHeight: "300px",
              overflow: "auto",
            }}
          >
            <button
              style={{ position: "absolute", right: "10px", top: "10px" }}
              onClick={() => setShowQuotesResponse(false)}
            >
              X
            </button>
            <pre>{JSON.stringify(quotes, null, 2)}</pre>
          </div>
        )}

        {/* Form for order parameters */}
        <div
          style={{
            border: "1px solid #000",
            padding: "10px",
            borderRadius: "5px",
            margin: "10px",
            maxWidth: "500px",
          }}
        >
          <h3>Get Orders</h3>
          <form
            onSubmit={handleOrderFormSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <label>
              Start Date:
              <input
                type="date"
                name="start"
                value={orderParams.start}
                onChange={handleOrderParamChange}
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                name="end"
                value={orderParams.end}
                onChange={handleOrderParamChange}
              />
            </label>
            <label>
              Limit:
              <input
                type="number"
                name="limit"
                value={orderParams.limit}
                onChange={handleOrderParamChange}
              />
            </label>
            <label>
              Skip:
              <input
                type="number"
                name="skip"
                value={orderParams.skip}
                onChange={handleOrderParamChange}
              />
            </label>
            <button type="submit" style={buttonStyle}>Get Orders</button>
          </form>
        </div>

        {showApiResponse && apiResponse && (
          <div
            style={{
              position: "relative",
              border: "1px solid #000",
              margin: "10px",
              padding: "10px",
              borderRadius: "5px",
              maxWidth: "500px",
              maxHeight: "300px",
              overflow: "auto",
            }}
          >
            <button
              style={{ position: "absolute", right: "10px", top: "10px" }}
              onClick={() => setShowApiResponse(false)}
            >
              X
            </button>
            <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
          </div>
        )}

        <div
          style={{
            border: "1px solid #000",
            padding: "10px",
            borderRadius: "5px",
            margin: "10px",
            maxWidth: "500px",
          }}
        >
          <h3>Get Single Order</h3>
          <form
            onSubmit={getSingleOrder}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <label>
              Custom Order ID:
              <input
                type="text"
                name="customOrderId"
                value={customOrderId}
                onChange={handleCustomOrderIdChange}
                required
              />
            </label>
            <label>
              Wallet Address:
              <input
                type="text"
                name="walletAddress"
                value={walletAddress}
                onChange={handleWalletAddressChange}
                required
              />
            </label>
            <button type="submit" style={buttonStyle}>Get Single Order</button>
          </form>
        </div>

        {/* Display the single order */}
        {showSingleOrderResponse && singleOrderResponse && (
          <div
            style={{
              position: "relative",
              border: "1px solid #000",
              margin: "10px",
              padding: "10px",
              borderRadius: "5px",
              maxWidth: "500px",
              maxHeight: "300px",
              overflow: "auto",
            }}
          >
            <button
              style={{ position: "absolute", right: "10px", top: "10px" }}
              onClick={() => setShowSingleOrderResponse(false)}
            >
              X
            </button>
            <pre>{JSON.stringify(singleOrderResponse, null, 2)}</pre>
          </div>
        )}
      </div>
    </Page>
  );
};

export default EndpointExamples;
