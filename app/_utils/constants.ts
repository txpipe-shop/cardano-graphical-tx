import JSONbig from "json-bigint";

export const ROUTES = {
  HOME: "/",
  GRAPHER: "/tx/grapher",
  TX: "/tx",
  ADDRESS: "/address",
  DISSECT: "/tx/dissect",
  DSL: "/dsl",
};

export type ROUTES = (typeof ROUTES)[keyof typeof ROUTES];

export const API_ROUTES = {
  CBOR: "api/cbor",
  HASH: "api/hash",
  DSL: "api/dsl",
  ADDRESS: "api/address",
};

export const USER_CONFIGS = {
  QUERY: "query",
  OPTION: "option",
  NET: "net",
} as const;

export const defaultPosition = { x: 0, y: 0 };

export const TX_WIDTH = 125;
export const TX_HEIGHT = 250;
export const POINT_SIZE = 10;
export const UTXO_TEXT_WIDTH = 400;
export const STROKE_WIDTH = 3;
export const LINE_WIDTH = 2;
export const UTXO_LINE_GAP = 10;
export const POLICY_LENGTH = 56;

export const KONVA_COLORS = {
  PINK: "#FF8096",
  RED: "#FF0000",
  TRANSPARENT_RED: "#FF000055",
  BLUE: "#0000FF",
  TRANSPARENT_BLUE: "#0000FF55",
  LIGHT_BLUE: "#ADD8E6",
  BLACK: "#000000",
  GREY: "#808080",
  TRANSAPARENT: "transparent",
  LIGHTER_GREY: "#F7F7F7",
  GREEN_MINT_FILL: "#8AC926",
  GREEN_MINT_STROKE: "#77AD21",
  RED_BURN_FILL: "#FF3E45",
  RED_BURN_STROKE: "#FF262D",
  RED_WARNING: "#ee6055",
  WHITE: "#FFFFFF",
  PURPLE_FILL: "#9d4edd",
  PURPLE_STROKE: "#893ec7",
  YELLOW_FILL: "#ffdd63",
  YELLOW_STROKE: "#fcd72c",
  YELLOW_WARNING: "#fcefb4",
};
export type KONVA_COLORS = (typeof KONVA_COLORS)[keyof typeof KONVA_COLORS];

export const NETWORK = {
  MAINNET: "mainnet",
  PREPROD: "preprod",
  PREVIEW: "preview",
} as const;
export type NETWORK = (typeof NETWORK)[keyof typeof NETWORK];

export const JSONBIG = JSONbig({
  useNativeBigInt: true,
  constructorAction: "preserve",
  protoAction: "preserve",
});

export const DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

export const TX_URL_PARAM = "tx";
export const UTXO_URL_PARAM = "utxo";

export const burnIconURL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iMjQiPjxwYXRoIGQ9Ik0yNDAtNDAwcTAgNTIgMjEgOTguNXQ2MCA4MS41cS0xLTUtMS05di05cTAtMzIgMTItNjB0MzUtNTFsMTEzLTExMSAxMTMgMTExcTIzIDIzIDM1IDUxdDEyIDYwdjlxMCA0LTEgOSAzOS0zNSA2MC04MS41dDIxLTk4LjVxMC01MC0xOC41LTk0LjVUNjQ4LTU3NHEtMjAgMTMtNDIgMTkuNXQtNDUgNi41cS02MiAwLTEwNy41LTQxVDQwMS02OTBxLTM5IDMzLTY5IDY4LjV0LTUwLjUgNzJRMjYxLTUxMyAyNTAuNS00NzVUMjQwLTQwMFptMjQwIDUyLTU3IDU2cS0xMSAxMS0xNyAyNXQtNiAyOXEwIDMyIDIzLjUgNTV0NTYuNSAyM3EzMyAwIDU2LjUtMjN0MjMuNS01NXEwLTE2LTYtMjkuNVQ1MzctMjkybC01Ny01NlptMC00OTJ2MTMycTAgMzQgMjMuNSA1N3Q1Ny41IDIzcTE4IDAgMzMuNS03LjVUNjIyLTY1OGwxOC0yMnE3NCA0MiAxMTcgMTE3dDQzIDE2M3EwIDEzNC05MyAyMjdUNDgwLTgwcS0xMzQgMC0yMjctOTN0LTkzLTIyN3EwLTEyOSA4Ni41LTI0NVQ0ODAtODQwWiIvPjwvc3ZnPg==";
export const mintIconURL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iMjQiPjxwYXRoIGQ9Ik00NDAtMTIwdi0zMTlxLTY0IDAtMTIzLTI0LjVUMjEzLTUzM3EtNDUtNDUtNjktMTA0dC0yNC0xMjN2LTgwaDgwcTYzIDAgMTIyIDI0LjVUNDI2LTc0NnEzMSAzMSA1MS41IDY4dDMxLjUgNzlxNS03IDExLTEzLjV0MTMtMTMuNXE0NS00NSAxMDQtNjkuNVQ3NjAtNzIwaDgwdjgwcTAgNjQtMjQuNSAxMjNUNzQ2LTQxM3EtNDUgNDUtMTAzLjUgNjlUNTIwLTMyMHYyMDBoLTgwWm0wLTQwMHEwLTQ4LTE4LjUtOTEuNVQzNjktNjg5cS0zNC0zNC03Ny41LTUyLjVUMjAwLTc2MHEwIDQ4IDE4IDkydDUyIDc4cTM0IDM0IDc4IDUydDkyIDE4Wm04MCAxMjBxNDggMCA5MS41LTE4dDc3LjUtNTJxMzQtMzQgNTIuNS03OHQxOC41LTkycS00OCAwLTkyIDE4LjVUNTkwLTU2OXEtMzQgMzQtNTIgNzcuNVQ1MjAtNDAwWm0wIDBabS04MC0xMjBaIi8+PC9zdmc+";

export const withdrawalIconURL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjMDAwMDAwIj48cGF0aCBkPSJNMjAwLTEyMHEtMzMgMC01Ni41LTIzLjVUMTIwLTIwMHYtNTYwcTAtMzMgMjMuNS01Ni41VDIwMC04NDBoNTYwcTMzIDAgNTYuNSAyMy41VDg0MC03NjB2NDBxMCAxNy0xMS41IDI4LjVUODAwLTY4MHEtMTcgMC0yOC41LTExLjVUNzYwLTcyMHYtNDBIMjAwdjU2MGg1NjB2LTQwcTAtMTcgMTEuNS0yOC41VDgwMC0yODBxMTcgMCAyOC41IDExLjVUODQwLTI0MHY0MHEwIDMzLTIzLjUgNTYuNVQ3NjAtMTIwSDIwMFptNTI3LTMyMEg0MDBxLTE3IDAtMjguNS0xMS41VDM2MC00ODBxMC0xNyAxMS41LTI4LjVUNDAwLTUyMGgzMjdsLTc1LTc2cS0xMS0xMS0xMS41LTI3LjVUNjUyLTY1MnExMS0xMSAyOC0xMXQyOCAxMWwxNDQgMTQ0cTYgNiA4LjUgMTN0Mi41IDE1cTAgOC0yLjUgMTV0LTguNSAxM0w3MDgtMzA4cS0xMSAxMS0yNy41IDExLjVUNjUyLTMwOHEtMTEtMTEtMTEtMjh0MTEtMjhsNzUtNzZaIi8+PC9zdmc+";

export const certificateIconURL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjMDAwMDAwIj48cGF0aCBkPSJNNDQwLTQwMGg4MHExNyAwIDI4LjUtMTEuNVQ1NjAtNDQwcTAtMTctMTEuNS0yOC41VDUyMC00ODBoLTgwcS0xNyAwLTI4LjUgMTEuNVQ0MDAtNDQwcTAgMTcgMTEuNSAyOC41VDQ0MC00MDBabTAtMTIwaDI0MHExNyAwIDI4LjUtMTEuNVQ3MjAtNTYwcTAtMTctMTEuNS0yOC41VDY4MC02MDBINDQwcS0xNyAwLTI4LjUgMTEuNVQ0MDAtNTYwcTAgMTcgMTEuNSAyOC41VDQ0MC01MjBabTAtMTIwaDI0MHExNyAwIDI4LjUtMTEuNVQ3MjAtNjgwcTAtMTctMTEuNS0yOC41VDY4MC03MjBINDQwcS0xNyAwLTI4LjUgMTEuNVQ0MDAtNjgwcTAgMTcgMTEuNSAyOC41VDQ0MC02NDBaTTMyMC0yNDBxLTMzIDAtNTYuNS0yMy41VDI0MC0zMjB2LTQ4MHEwLTMzIDIzLjUtNTYuNVQzMjAtODgwaDQ4MHEzMyAwIDU2LjUgMjMuNVQ4ODAtODAwdjQ4MHEwIDMzLTIzLjUgNTYuNVQ4MDAtMjQwSDMyMFptMC04MGg0ODB2LTQ4MEgzMjB2NDgwWk0xNjAtODBxLTMzIDAtNTYuNS0yMy41VDgwLTE2MHYtNTIwcTAtMTcgMTEuNS0yOC41VDEyMC03MjBxMTcgMCAyOC41IDExLjVUMTYwLTY4MHY1MjBoNTIwcTE3IDAgMjguNSAxMS41VDcyMC0xMjBxMCAxNy0xMS41IDI4LjVUNjgwLTgwSDE2MFptMTYwLTcyMHY0ODAtNDgwWiIvPjwvc3ZnPg==";

export const OPTIONS = {
  HASH: "hash",
  CBOR: "cbor",
} as const;

export const ERRORS = {
  internal_error: "Blockfrost Internal Error",
  inputs_not_found:
    "Inputs not found. \n If it is on purpose ignore this warning",
};

export type OPTIONS = (typeof OPTIONS)[keyof typeof OPTIONS];

export const cbor1 =
  "84a70081825820f17477b3879320a18e72c6a6af1158be2a3decb8dc1b78a19d132248d6da7e150201828258390036e2bc9dc949639b9a2a1ebb1e7177fc2aaa925c945a38a1d3c3450f3d8e7565a718dee1e5f90977a7bb19df19f8b26a8ae38f2052df346e1a001e848082583900cc25b7bd71fa51376b407ce2fbf651c8bd0fc01c247852a68b33b6aea4f93ef1d4968d3be5c65289730cbfa8a81eefd4eac5f781cbe0ed3b821b000000025291ad4ca2581c2b424eb51d04e39cfe7483ffe60eda9c5388d622d2bbb10443631818aa4443424c501b0000082f79cd41e0444d454c441b0000082f79cd41e0474d696e737761701b0000082f79cd41e04c466c61632046496e616e63651b0000082f79cd41e04f4c656e66692044414f20746f6b656e1b0000082f79cd41e04f4f736d69756d44414f20546f6b656e1b0000082f79cd41e050496e6469676f2044414f20546f6b656e1b0000082f79cd41e05247656e697573205969656c6420546f6b656e1b0000082f79cd41e052576f726c64204d6f62696c6520546f6b656e1b0000082f79cd41e0581b57696e6752696465727320476f7665726e616e636520546f6b656e1b0000082f79cd41e0581c77211b30313564b8b11db9c9de94addc5fa305f5d47fd278140eef63a146534f444954411b00005af3107a4000021a00030949031a0264e3be075820b4433ddcd8c3e5d7372766de6b251fc4061e17b25ae33cf1a83b8261320472b809a1581c77211b30313564b8b11db9c9de94addc5fa305f5d47fd278140eef63a146534f444954411b00005af3107a40000e81581ccc25b7bd71fa51376b407ce2fbf651c8bd0fc01c247852a68b33b6aea20082825820e67b8e6b83eebbaa4e3a4e711ce71233a8781caa15d46e671e020f95885c0b035840a7307802e39a3800cdb9166ee443cbdccdb1b5e097488b2e2a6672fda63976131657bba26ec1c5d640610a3ef91ceb8110c0d64f028de89ae39a81af5c0c7102825820143108f515fa7636dd003d39c50b326ac4e9511e95cf9bbd406b35693bdb61d958402899071a05954127244dfea5f3d0be60541059a8b8e3eeb9d4789ff149a0d68fb3cf1b788883280bb9549b4d7732e49cba12ffbfdf58f5b605307db229838b0301818201818200581ccc25b7bd71fa51376b407ce2fbf651c8bd0fc01c247852a68b33b6aef5a11902d1a178383737323131623330333133353634623862313164623963396465393461646463356661333035663564343766643237383134306565663633a166534f44495441a265696d616765782368747470733a2f2f692e6962622e636f2f526a58585370372f736f646974612e706e67646e616d6566534f44495441";
export const hash1 =
  "64403900eb882a71f9aae0569b422c0c31a1787092a877ead54afd1b1f713b13";
export const hash2 =
  "d1ef2bf292694fbbdcc5855c040e5081e0a738701d1c3cb92410901f39504976";

export const multipleHashes =
  "c97154477f9bb04a7af4dab18ddff4f68dbd4a0871f362b26baf75352b8079cf,d8988f87cfb7b6751ca1f012cbc4dad92daca948b4f595de69b6e411bb116f07,23f407f1020d0acd93b58631b77509c789691c19834a2b6bdc3ea7c382939a4a,e714001a9e8661821ff796b8a0b1712274466416bd1635bc8e80710abe848cb6,40cd76968363bb0ce68f491a44d218fa569edb18ca18a219931f564d2c5203e0,77cf92fb5a6ee3423230a07f06f9edab6b4177a7c8ba6ed57e3d866553cb1e55,c97154477f9bb04a7af4dab18ddff4f68dbd4a0871f362b26baf75352b8079cf";

export const addr1 =
  "addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3n0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywfgse35a3x";
export const addr2 =
  "addr1w8phkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gtcyjy7wx";
export const addr3 =
  "addr1vx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzers66hrl8";
export const addr4 =
  "37btjrVyb4KDXBNC4haBVPCrro8AQPHwvCMp3RFhhSVWwfFmZ6wwzSK6JK1hY6wHNmtrpTf1kdbva8TCneM2YsiXT7mrzT21EacHnPpz5YyUdj64na";
export const addr5 =
  "stake178phkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gtcccycj5";
export const addr6 =
  "addr1gx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer5pnz75xxcrzqf96k";

export const AddressExamples = [
  { title: "Mainnet address in Bech32", address: addr1 },
  { title: "A script address", address: addr2 },
  { title: "An address without delegation part", address: addr3 },
  { title: "A Byron address", address: addr4 },
  { title: "A stake addresss", address: addr5 },
  {
    title: "A rare address using a pointer to the delegation cert",
    address: addr6,
  },
];

export const TxExamples = [
  { title: "Draw CBOR", code: cbor1 },
  { title: "Draw Tx Hash", code: hash1 },
  { title: "Dissect CBOR", code: cbor1 },
  { title: "Dissect Tx Hash", code: hash2 },
  { title: "Draw Multiple Tx Hashes", code: multipleHashes },
];

export const simpleDSL = `{
  "transaction": {
    "name": "simple example",
    "fee": 2,
    "inputs": [
      {
        "txHash": "328a2c5a860062fdfc968e476982561a8255ae31ae940d3022d3759fef8083d5",
        "index": 1
      }
    ],
    "outputs": [
      {
        "address": "addr_test1qq3w5yjst20qkscef9mjtw0xfc7fn6j3ptlq9qw0garsg4tu0dsummr50mcwm9ekwv547nly5n985n3w3wqw2g8uph0sky2tsk",
        "values": [
          {
            "amount": 9000000,
            "name": "lovelace"
          },
          {
            "amount": 123,
            "name": "New Token"
          }
        ]
      }
    ]
  }
}
`;

const complexDSL = `{
  "transaction": {
    "name": "complex example",
    "fee": 1,
    "start": 123,
    "ttl": 321,
    "inputs": [
      {
        "name": "wallet-A"
      },
      {
        "txHash": "328a2c5a860062fdfc968e476982561a8255ae31ae940d3022d3759fef8083d5",
        "index": 1
      },
      {
        "address": "addr_test1xq0pg5k3gc47qe8ntj25548dprlnmdyd44h7u653ply9pkw8yq3wjqnaym5vvm2sewd4m2xpwdhv69gqj62c5dxw5xwqm3j3fa",
        "redeemer": {
          "name": "r",
          "number": 1232112
        }
      },
      {
        "name": "wallet-A",
        "values": [
          {
            "amount": 10000000,
            "name": "lovelace"
          }
        ]
      },
      {
        "name": "wallet-A",
        "address": "addr_test1xq0pg5k3gc47qe8ntj25548dprlnmdyd44h7u653ply9pkw8yq3wjqnaym5vvm2sewd4m2xpwdhv69gqj62c5dxw5xwqm3j3fa",
        "values": [
          {
            "amount": 10000000,
            "name": "Token1"
          },
          {
            "amount": 10,
            "assetClass": "391589af6db9d9008e3e0952563f8d1d5c18cdb8ea0c300bfc1e60b6.414e4f4e3066396466613433"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "wallet-B",
        "address": "addr_test1qq3w5yjst20qkscef9mjtw0xfc7fn6j3ptlq9qw0garsg4tu0dsummr50mcwm9ekwv547nly5n985n3w3wqw2g8uph0sky2tsk",
        "values": [
          {
            "amount": 9000000,
            "name": "lovelace"
          },
          {
            "amount": 123,
            "name": "New Token"
          }
        ],
        "datum": {
          "hash": "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        }
      },
      {
        "address": "addr_test1qq3w5yjst20qkscef9mjtw0xfc7fn6j3ptlq9qw0garsg4tu0dsummr50mcwm9ekwv547nly5n985n3w3wqw2g8uph0sky2tsk",
        "values": [
          {
            "amount": 18000000,
            "name": "lovelace"
          },
          {
            "amount": 3463,
            "name": "Token2"
          }
        ],
        "datum": {
          "bytes": "d87980"
        }
      }
    ],
    "minting": [
      {
        "amount": 12345,
        "name": "New Token"
      },
      {
        "amount": 123456,
        "name": "Other Token"
      },
      {
        "amount": 1234567,
        "name": "Other Rare Token"
      }
    ],
    "withdrawals": [
      {
        "raw_address": "addr_test1qq3w5yjst20qkscef9mjtw0xfc7fn6j3ptlq9qw0garsg4tu0dsummr50mcwm9ekwv547nly5n985n3w3wqw2g8uph0sky2tsk",
        "amount": 123
      }
    ],
    "metadata": [
      {
        "label": 674,
        "json_metadata": {
          "key": "value"
        }
      }
    ]
  }
}
`;

export const DSLExamples = [
  { title: "Simple", code: simpleDSL },
  { title: "Complex", code: complexDSL },
];
