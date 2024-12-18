pub const ALL_PARAMS_JSON: &str = r#"{
    "transaction": {
        "name": "example",
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
                        "amount": 10,
                        "name": "lovelace"
                    }
                ]
            },
            {
                "name": "wallet-A",
                "address": "addr_test1xq0pg5k3gc47qe8ntj25548dprlnmdyd44h7u653ply9pkw8yq3wjqnaym5vvm2sewd4m2xpwdhv69gqj62c5dxw5xwqm3j3fa",
                "values": [
                    {
                        "amount": 10,
                        "name": "lovelace"
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
                "name": "wallet-de-sofi",
                "address": "addr_test1qq3w5yjst20qkscef9mjtw0xfc7fn6j3ptlq9qw0garsg4tu0dsummr50mcwm9ekwv547nly5n985n3w3wqw2g8uph0sky2tsk",
                "values": [
                    {
                        "amount": 9,
                        "name": "lovelace"
                    },
                    {
                        "amount": 123,
                        "name": "New Token"
                    }
                ]
            }
        ],
        "minting": [
            {
                "amount": 123,
                "name": "New Token"
            },
            {
                "amount": 1231,
                "name": "Other Token"
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
}"#;

pub const ALL_PARAMS_RES_HEX: &str = "84a700d9010285825820000000000000000000000000000000000000000000000000000000000000000002825820000000000000000000000000000000000000000000000000000000000000000003825820000000000000000000000000000000000000000000000000000000000000000004825820000000000000000000000000000000000000000000000000000000000000000005825820328a2c5a860062fdfc968e476982561a8255ae31ae940d3022d3759fef8083d5010181a20058390022ea12505a9e0b4319497725b9e64e3c99ea510afe0281cf474704557c7b61cdec747ef0ed973673295f4fe4a4ca7a4e2e8b80e520fc0ddf018209a1581c00000000000000000000000000000000000000000000000000000000a2486c6f76656c61636509494e657720546f6b656e187b02010319014105a1586c616464725f74657374317171337735796a73743230716b73636566396d6a74773078666337666e366a3370746c71397177306761727367347475306473756d6d7235306d63776d39656b77763534376e6c79356e3938356e33773377717732673875706830736b793274736b187b08187b09a1581c00000000000000000000000000000000000000000000000000000000a2494e657720546f6b656e187b4b4f7468657220546f6b656e1904cfa105a182000382a2446e616d6543227222466e756d6265724731323332313132820000f5d90103a100a11902a2a1636b65796576616c7565";

pub const ALL_PARAMS_RES_DIAG: &str = r#"[{0: 258([[h'0000000000000000000000000000000000000000000000000000000000000000', 2], [h'0000000000000000000000000000000000000000000000000000000000000000', 3], [h'0000000000000000000000000000000000000000000000000000000000000000', 4], [h'0000000000000000000000000000000000000000000000000000000000000000', 5], [h'328A2C5A860062FDFC968E476982561A8255AE31AE940D3022D3759FEF8083D5', 1]]), 1: [{0: h'0022EA12505A9E0B4319497725B9E64E3C99EA510AFE0281CF474704557C7B61CDEC747EF0ED973673295F4FE4A4CA7A4E2E8B80E520FC0DDF', 1: [9, {h'00000000000000000000000000000000000000000000000000000000': {h'6C6F76656C616365': 9, h'4E657720546F6B656E': 123}}]}], 2: 1, 3: 321, 5: {h'616464725F74657374317171337735796A73743230716B73636566396D6A74773078666337666E366A3370746C71397177306761727367347475306473756D6D7235306D63776D39656B77763534376E6C79356E3938356E33773377717732673875706830736B793274736B': 123}, 8: 123, 9: {h'00000000000000000000000000000000000000000000000000000000': {h'4E657720546F6B656E': 123, h'4F7468657220546F6B656E': 1231}}}, {5: {[0, 3]: [{h'6E616D65': h'227222', h'6E756D626572': h'31323332313132'}, [0, 0]]}}, true, 259({0: {674: {"key": "value"}}})]"#;
